
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
    }
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
      click_action: data.payload.click_action
    }
  };

  This.result.notification = data;

  const batchSizeMax = 3;
  let batchCurrent = [];
  let batchCurrentSize = 0;
  let batchPromises = [];
  let batchLoops = 1;

  await admin.firestore().collection('notifications/subscriptions/all/')
    // .where('capital', '==', true)
    .get()
    .then(function(querySnapshot) {
      // console.log('querySnapshot.size', querySnapshot.size);
      This.result.subscriptionsStart = querySnapshot.size;
      querySnapshot.forEach(function(doc) {
        // console.log('loading... ', batchLoops+'/'+querySnapshot.size);
        if ((batchCurrentSize < batchSizeMax - 1) && (batchLoops < querySnapshot.size)) {
          batchCurrent.push(doc.data().meta.token);
          batchCurrentSize++;
        } else {
          batchCurrent.push(doc.data().meta.token);
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

    await Promise.all(batchPromises)
      .then(function(values) {
        This.result.status = 'success';
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

// async function iterateNotifications() {
//
//
//   return new Promise((resolve, reject) => {
//     resolve(true);
//   })
// }

// async function sendBatch(batch, batchNumber) {
PushManager.prototype.sendBatch = async function(batch, batchNumber) {
  let This = this;
  await This.admin.messaging().sendToDevice(batch, This.payload)
    .then(async function (response) {
      This.result.batches.list.push('#' + batchNumber + ' | ' + '✅  ' + response.successCount + ' | ' + '❌  ' + response.failureCount)
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
  results.forEach(async (result, i) => {
    if (!result.error) { return false; }
    if (result.error.code == 'messaging/invalid-registration-token') {
      This.result.badTokens.invalid += 1;
      cleanPromises.push(deleteBadToken(This, tokens[i]));
    } else if (result.error.code == 'messaging/registration-token-not-registered') {
      This.result.badTokens.notRegistered += 1;
      cleanPromises.push(deleteBadToken(This, tokens[i]));
    } else {
      This.result.badTokens.other.push(result.error.code);
    }
  });

  await Promise.all(cleanPromises)
    .catch(function(e) {
      console.error("Error cleaning failed tokens: ", e);
      This.result.status = 'fail';
    });

  return new Promise((resolve, reject) => {
    resolve(true);
  })
}

async function deleteBadToken(This, token) {
  return This.admin.firestore().doc('notifications/subscriptions/all/' + token).delete()
    .then(function() {
      // console.log('Deleted token ' + tokens[i]);
    })
    .catch(function(error) {
      console.error('Error removing token: ', error);
      This.result.status = 'fail';
    })
}


/**
* MODULE EXPORT
*/

module.exports = PushManager;
