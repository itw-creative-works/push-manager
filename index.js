
function PushManager() {
  /**
  * OPTIONS
  */
  this.properties = {
  };

}

/**
* METHODS
*/
PushManager.prototype.process = async function(admin, snap, context) {

  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  const data = snap.data();

  // access a particular field as you would any JS property
  // const name = newValue.name;

  // perform desired operations ...
  let NOTIFICATION_META = {
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

  const payload = {
    notification: {
      title: data.payload.title,
      body: data.payload.body,
      icon: data.payload.icon,
      click_action: data.payload.click_action
    }
  }

  NOTIFICATION_META.notification = data;

  const batchSizeMax = 3;
  let batchCurrent = [];
  let batchCurrentSize = 0;
  let batchPromises = [];
  let batchLoops = 1;

  await admin.firestore().collection('notifications/subscriptions/list/')
    // .where('capital', '==', true)
    .get()
    .then(function(querySnapshot) {
      // console.log('querySnapshot.size', querySnapshot.size);
      NOTIFICATION_META.subscriptionsStart = querySnapshot.size;
      querySnapshot.forEach(function(doc) {
        // console.log('loading... ', batchLoops+'/'+querySnapshot.size);
        if ((batchCurrentSize < batchSizeMax - 1) && (batchLoops < querySnapshot.size)) {
          batchCurrent.push(doc.data().meta.token);
          batchCurrentSize++;
        } else {
          batchCurrent.push(doc.data().meta.token);
          batchPromises.push(sendBatch(batchCurrent, batchPromises.length + 1));
          batchCurrent = [];
          batchCurrentSize = 0;
        }
        batchLoops++;

      });
    })
    .catch(function(error) {
      console.error("Error querying tokens: ", error);
    });

    NOTIFICATION_META.batches.count = batchPromises.length;

    await Promise.all(batchPromises)
      .then(function(values) {
        // console.log('Finished all batches.');
        NOTIFICATION_META.status = 'success';
      })
      .catch(function(e) {
        console.error("Error sending batches: ", e);
        NOTIFICATION_META.status = 'fail';
        // NOTIFICATION_META.errors.list.push("Error sending batches: " + e);
      });

    async function sendBatch(batch, batchNumber) {
      // console.log('Batch send start #' + batchNumber + ': count = ' + batch.length);
      await admin.messaging().sendToDevice(batch, payload)
        .then(async function (response) {
          // console.log('Batch send finished #' + batchNumber + ':', 'Successes: '+response.successCount, 'Failures: '+response.failureCount );
          NOTIFICATION_META.batches.list.push('#' + batchNumber + ' | ' + '✅  ' + response.successCount + ' | ' + '❌  ' + response.failureCount)
          NOTIFICATION_META.successes += response.successCount;
          NOTIFICATION_META.failures += response.failureCount;
          if (response.failureCount > 0) {
            await cleanTokens(batch, response.results, batchNumber);
          }
        })
        .catch(function (e) {
          console.error('Error sending batch #' + batchNumber, e);
          NOTIFICATION_META.status = 'fail';
        })

      return new Promise((resolve, reject) => {
        resolve(true);
      })
    }

    async function cleanTokens(tokens, results, batchNumber) {
      // console.log('Batch clean start #' + batchNumber + ': ');
      // console.log(tokens);
      let cleanPromises = [];
      results.forEach(async (result, i) => {
        if (!result.error) {
          // console.log('Good: skipping for ' + tokens[i])
          return false;
        }
        // console.log('Error: ' + result.error.code + ' for ' + tokens[i]);
        if (result.error.code == 'messaging/invalid-registration-token') {
          NOTIFICATION_META.badTokens.invalid += 1;
          cleanPromises.push(
            admin.firestore().doc('notifications/subscriptions/list/' + tokens[i]).delete()
              .then(function() {
                // console.log('Deleted token ' + tokens[i]);
              }).catch(function(error) {
                console.error('Error removing token: ', error);
                NOTIFICATION_META.status = 'fail';
              })
          );
        } else if (result.error.code == 'messaging/registration-token-not-registered') {
          NOTIFICATION_META.badTokens.notRegistered += 1;
          cleanPromises.push(
            admin.firestore().doc('notifications/subscriptions/list/' + tokens[i]).delete()
              .then(function() {
                // console.log('Deleted token ' + tokens[i]);
              }).catch(function(error) {
                console.error('Error removing token: ', error);
                NOTIFICATION_META.status = 'fail';
              })
          );
        } else {
          NOTIFICATION_META.badTokens.other.push(result.error.code);
        }

      });
      await Promise.all(cleanPromises)
        .then(function(values) {
        })
        .catch(function(e) {
          console.error("Error cleaning failed tokens: ", e);
          NOTIFICATION_META.status = 'fail';
        });

      return new Promise((resolve, reject) => {
        resolve(true);
      })
    }

    // snap.ref()
    admin.firestore().doc(snap.ref.path)
      .delete()
      .then(function() {
        // console.log('Deleted token ' + tokens[i]);
      }).catch(function(error) {
        console.error('Error removing notification: ', error);
      })

    NOTIFICATION_META.subscriptionsEnd = NOTIFICATION_META.subscriptionsStart - NOTIFICATION_META.failures;

  return new Promise((resolve, reject) => {
    resolve(NOTIFICATION_META);
  })

}


module.exports = PushManager;
