var log = function () {};

function PushManager() {
  /**
  * OPTIONS
  */
  this.result = {
    status: 'success',
    notification: {},
    successes: 0,
    failures: 0,
    batches: {
      count: 0,
      list: []
    },
    subscriptionsStart: 0,
    subscriptionsEnd: 0,
    errors: {
      count: 0,
      list: [],
    },
    badTokens: {
      invalid: 0,
      notRegistered: 0,
      other: []
    },
  };
}

/**
* METHODS
*/
PushManager.prototype.process = async function(admin, snap, context, options) {

  const data = snap.data();
  let This = this;
  this.admin = admin;
  this.snap = snap;
  this.context = context;
  this.payload = {
    notification: {
      title: data.payload.title,
      body: data.payload.body,
      icon: data.payload.icon,
      click_action: data.payload.click_action,
    }
  };
  options = options || {};
  this.options = options;
  this.options.processingPath = options.processingPath || 'notifications/processing/all/{notificationId}';
  this.options.subscriptionsPath = options.subscriptionsPath || 'notifications/subscriptions/all';
  this.options.log = (typeof options.log !== 'undefined') ? options.log : false;

  // console.log('@PushManager start...');

  if (this.options.log === true) {
    this.result.log = [];
    log = function (This, msg) {
      var args = Array.prototype.slice.call(arguments);
      args = args.splice(1,args.length)
      args.unshift('[Push Manager DEV]');
      console.log.apply(console, args);
      // This.result.log.push(args);
    }
    var pjson = require('./package.json');
    log(This, 'Logging enabled on Push Manager version: ' + pjson.version);
    // console.log('Logging enabled on Push Manager version: ' + pjson.version)
    // this.result.log.push('Logging enabled on Push Manager version: ' + pjson.version);

  }

  This.result.notification = data;

  const batchSizeMax = 1000;
  let batchCurrent = [];
  let batchCurrentSize = 0;
  let batchPromises = [];
  let batchLoops = 1;

  // await admin.firestore().collection('notifications/subscriptions/all/')
  await admin.firestore().collection(this.options.subscriptionsPath)
    // .where('capital', '==', true)
    .get()
    .then(function(querySnapshot) {
      // console.log('querySnapshot.size', querySnapshot.size);
      log(This, 'Queried ' + querySnapshot.size + ' tokens to send to.');
      This.result.subscriptionsStart = querySnapshot.size;
      querySnapshot.forEach(function(doc) {
        // log(This, 'loading... ', batchLoops+'/'+querySnapshot.size);
        if ((batchCurrentSize < batchSizeMax - 1) && (batchLoops < querySnapshot.size)) {
          batchCurrent.push(doc.data().token);
          batchCurrentSize++;
        } else {
          batchCurrent.push(doc.data().token);
          batchPromises.push(This.sendBatch(batchCurrent, batchPromises.length + 1));
          batchCurrent = [];
          batchCurrentSize = 0;
        }
        batchLoops++;
      });
    })
    .catch(function(error) {
      console.error("Error querying tokens: ", error);
    });

    This.result.batches.count = batchPromises.length;
    log(This, 'Total batches = ' + This.result.batches.count);


    await Promise.all(batchPromises)
      .then(function(values) {
        // This.result.status = 'success';
        log(This, 'Finished all batches.');
      })
      .catch(function(e) {
        console.error("Error sending batches: ", e);
        This.result.status = 'fail';
      });

    // snap.ref()
    await admin.firestore().doc(snap.ref.path)
      .delete()
      .then(function() {
        // console.log('Deleted token ' + tokens[i]);
        log(This, 'Removed notification at ' + snap.ref.path);

      }).catch(function(error) {
        console.error('Error removing notification: ', error);
      })

    This.result.subscriptionsEnd = This.result.subscriptionsStart - This.result.failures;

  return new Promise((resolve, reject) => {
    resolve(This.result);
  })

}


/**
* HELPERS
*/

PushManager.prototype.sendBatch = async function(batch, batchNumber) {
  let This = this;
  log(This, 'Sending batch #', batchNumber, batch);
  await This.admin.messaging().sendToDevice(batch, This.payload)
    .then(async function (response) {
      This.result.batches.list.push('#' + batchNumber + ' | ' + '✅  ' + response.successCount + ' | ' + '❌  ' + response.failureCount);
      log('Sent batch #' + batchNumber);
      This.result.successes += response.successCount;
      This.result.failures += response.failureCount;
      if (response.failureCount > 0) {
        await cleanTokens(This, batch, response.results, batchNumber);
      }
    })
    .catch(function (e) {
      console.error('Error sending batch #' + batchNumber, e);
      This.result.status = 'fail';
    })

  return new Promise((resolve, reject) => {
    resolve(true);
  })
}



async function cleanTokens(This, tokens, results, batchNumber) {
  let cleanPromises = [];
  log('Started cleaning tokens for batch #' + batchNumber);
  results.forEach(async (result, i) => {
    if (!result.error) { return false; }
    if (result.error.code == 'messaging/invalid-registration-token') {
      // log(This, 'Bad token: ' + tokens[i]);
      This.result.badTokens.invalid += 1;
      cleanPromises.push(deleteBadToken(This, tokens[i]));
    } else if (result.error.code == 'messaging/registration-token-not-registered') {
      // log(This, 'Bad token: ' + tokens[i]);
      This.result.badTokens.notRegistered += 1;
      cleanPromises.push(deleteBadToken(This, tokens[i]));
    } else {
      // log(This, 'Bad token: ' + tokens[i]);
      cleanPromises.push(deleteBadToken(This, tokens[i]));
      This.result.badTokens.other.push(result.error.code);
    }
  });

  await Promise.all(cleanPromises)
    .catch(function(e) {
      console.error("Error cleaning failed tokens: ", e);
      This.result.status = 'fail';
    });

  log('Finished cleaning tokens for batch #' + batchNumber);

  return new Promise((resolve, reject) => {
    resolve(true);
  })
}

async function deleteBadToken(This, token) {
  // return This.admin.firestore().doc('notifications/subscriptions/all/' + token).delete()
  return This.admin.firestore().doc(This.options.subscriptionsPath + '/' + token).delete()
    .then(function() {
      log(This, 'Removed bad token: ' + token);
    })
    .catch(function(error) {
      console.error('Error removing token: ', token, error);
      This.result.status = 'fail';
    })
}


/**
* MODULE EXPORT
*/
module.exports = PushManager;
