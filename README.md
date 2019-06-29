<div align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
  </a>
  <br>
  <br>

![GitHub package.json version](https://img.shields.io/github/package-json/v/itw-creative-works/push-manager.svg)

![David](https://img.shields.io/david/itw-creative-works/push-manager.svg)
![David](https://img.shields.io/david/dev/itw-creative-works/push-manager.svg) <!-- ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/itw-creative-works/push-manager.svg) -->
![npm bundle size](https://img.shields.io/bundlephobia/min/push-manager.svg)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/push-manager.svg)
![npm](https://img.shields.io/npm/dm/push-manager.svg) <!-- [![NPM total downloads](https://img.shields.io/npm/dt/push-manager.svg?style=flat)](https://npmjs.org/package/push-manager) -->
![node](https://img.shields.io/node/v/push-manager.svg)
![Website](https://img.shields.io/website/https/itwcreativeworks.com.svg)
![GitHub](https://img.shields.io/github/license/itw-creative-works/push-manager.svg)
![GitHub contributors](https://img.shields.io/github/contributors/itw-creative-works/push-manager.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/itw-creative-works/push-manager.svg)


# Push Manager
**Push Manager** is an NPM module that instantly implements Firebase push notifications in your Firebase project. Its main purpose is to simplify the process of storing tokens and sending the actual notifications to your users.

[Site](https://itwcreativeworks.com) | [NPM Module](https://www.npmjs.com/package/push-manager) | [GitHub Repo](https://github.com/itw-creative-works/push-manager)

</div>

## Install
Install with npm:
```shell
npm install push-manager
```

## Features
* Implements server side Firebase Functions code that manages and sends push notifications.
* Sends push notifications in proper batch sizes (1000) as set by Google.
* Clears inactive and invalid tokens to save you space in Firestore.
* Configure your own path in Firestore where notifications are stored and triggered from.
* No dependencies or dev dependencies.

If you would rather start by seeing a full example, please clone [https://github.com/itw-creative-works/push-manager-example](https://github.com/itw-creative-works/push-manager-example) and follow the README in that repo for detailed instructions on how to set up Push Manager in 5 minutes!

## Implement Push Manager
To get this module to work we must accomplish 3 things:
* Set up a listener function in Firebase functions.
* Subscribe the client to your notifications.
* Add a document to Firestore to trigger the sending of the notification.

### 1. Listen for new Notifications
Open up your local project for your Firebase Functions and add a function to process the notifications as they come in called `processNotification`.

This function is triggered when a document is added to the path you specify. In this case the path is `notifications/processing/all/{notificationId}`.
```js
// /<your-firebase-project>/functions/index.js
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

That's it for the server side code!

To get this to work, however, you still must subscribe the user's browser to the push notifications as well as add a document to your Firebase Function trigger path, `notifications/processing/all/{notificationId}`.

#### Firestore Document Structure for Tokens
This is the required format for the subscription document in Firestore. Here, the `token` is stored so Firebase knows *where* to send the notifications.
If you are not sure how to subscribe a user to Firebase push notifications, keep reading.
```js
// notifications/subscriptions/all/{subscriptionId}
{
  token: 'tokenId',
}
```

#### Firestore Document Structure for Notifications
This is the required format for the notification document in Firestore. Here, the notification `payload` is stored so Firebase knows *what* to send in the notifications.
```js
// notifications/processing/all/{notificationId}
payload: {
  icon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg', // Link to notification icon
  click_action: 'https://google.com', // URL click action
  title: 'Hello world!',
  body: 'This is my first push notification using Push Manager!',
}
```

The Firestore documents for both the *tokens* and the *notifications* can have other data, but both must *at least* have the above data for push-manager to work properly.
<!--
### Options
* `processingPath`: Path where you store notification payloads
* `subscriptionsPath`: Path where you store your tokens -->

If this was confusing or you would rather see a fully functional example with Firebase functions code and client-side subscriptions, please fork [https://github.com/itw-creative-works/push-manager-example](https://github.com/itw-creative-works/push-manager-example).

## Final Words
If you are still having difficulty, we would love for you to post
a question to [the Push Manager issues page](https://github.com/itw-creative-works/push-manager/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library. <br>
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes. <br>
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites. <br>
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs. <br>
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products. <br>

Ask us to have your project listed! :)
