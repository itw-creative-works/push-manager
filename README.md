<div align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-pictoral-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-pictoral-black-x.svg">
  </a>
  <br>
  <br>

![GitHub package.json version](https://img.shields.io/github/package-json/v/itw-creative-works/push-manager.svg)

![David](https://img.shields.io/david/itw-creative-works/push-manager.svg)
![David](https://img.shields.io/david/dev/itw-creative-works/push-manager.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/itw-creative-works/push-manager.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/push-manager.svg)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/push-manager.svg)
![npm](https://img.shields.io/npm/dm/push-manager.svg)
![node](https://img.shields.io/node/v/push-manager.svg)
![Website](https://img.shields.io/website/https/itwcreativeworks.com.svg)
![GitHub](https://img.shields.io/github/license/itw-creative-works/push-manager.svg)
![GitHub contributors](https://img.shields.io/github/contributors/itw-creative-works/push-manager.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/itw-creative-works/push-manager.svg)


# Push Manager
**Push Manager** is an NPM module that instantly implements Firebase push notifications in your Firebase project. It's main purpose is to simplify the process of storing tokens and sending the actual notifications to your users.
</div>

<div align="left">
## Install
Install with npm:
```
bash
npm install push-manager
```

## Features
* Implements server side Firebase Functions code that manages and sends push notifications.
* Sends push notifications in proper batch sizes (1000) as set by Google.
* Clears inactive and invalid tokens to save you space in Firestore.
* Configure your own path in Firestore where notifications are stored and triggered from.
* No dependencies or dev dependencies.


## Example
Open up your local project for your Firebase Functions and paste this code:
```
// Standard Firebase Functions code
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  // ...
});

// Push Manager code
exports.processNotification = functions
.firestore
.document('notifications/processing/all/{notificationId}') // Feel free to change the path
.onCreate(async (snap, context) => {

  let pushManager = new (require('push-manager'));
  let options = {
    processingPath: 'notifications/processing/all/{notificationId}', // Path where you store notification payloads. Can be anything but must be the same as the path from line 3
    subscriptionsPath: 'notifications/subscriptions/all', // Path where you store your tokens
  };
  let result = await pushManager.process(admin, snap, context, options);

  return new Promise((resolve, reject) => {
    resolve();
  })

});
```

## Trigger a Notification
Push notifications are triggered by adding a Firestore document to your configured `path`. In the example above, the `path` is set to `notifications/processing/all/{notificationId}`, but you can change this to anything you want.
This module does not help you trigger a notification, so this is something you must do yourself. You can easily send a test notification by using the following code (client side, such as your website):
```
firebase.firestore().collection('notifications/processing/list') // Feel free to change the path but make sure to keep it consistent!
  .add(
    {
      payload: {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg', // Link to notification icon
        click_action: 'https://google.com', // URL click action
        title: 'Hello world!',
        body: 'This is my first push notification using Push Manager!',
      },
    }
  )
  .catch(function(e) {
    console.error('Failed to set Firestore doc:', e);
  });
```

## Options
* `processingPath`: Path where you store notification payloads
* `subscriptionsPath`: Path where you store your tokens

## Final Words
If you are still having difficulty, we would love for you to post
a question to [the Push Manager issues page](https://github.com/itw-creative-works/push-manager/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

</div>
