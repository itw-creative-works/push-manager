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
**Push Manager** is an NPM module that instantly implements Firebase push notifications in your Firebase project. Its main purpose is to simplify the process of storing tokens and sending the actual notifications to your users.

[Site](https://itwcreativeworks.com) | [NPM Module](https://www.npmjs.com/package/push-manager) | [GitHub Repo](https://github.com/itw-creative-works/push-manager)

</div>

## Install
Install with npm:
```
npm install push-manager
```

## Features
* Implements server side Firebase Functions code that manages and sends push notifications.
* Sends push notifications in proper batch sizes (1000) as set by Google.
* Clears inactive and invalid tokens to save you space in Firestore.
* Configure your own path in Firestore where notifications are stored and triggered from.
* No dependencies or dev dependencies.


## Example
Open up your local project for your Firebase Functions and paste this code. You can skip this step if you already have this part setup.
```
// Standard Firebase Functions code
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  // ...
});

```

Next, lets add the code to process the notifications as they come in. This function is triggered when a document is added to the path you specify.
```
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

### Options
* `processingPath`: Path where you store notification payloads
* `subscriptionsPath`: Path where you store your tokens

## Trigger a Notification
Push notifications are triggered by adding a Firestore document to your configured `path`. In the example above, the `path` is set to `notifications/processing/all/{notificationId}`, but you can change this to anything you want.

This module does not help you trigger a notification (since this module is built for the server side), so this is something you must do yourself. You can easily send a test notification by using the following code.

First, lets add the Firebase SDKs and configure the app. You can skip this step if you already have this part setup.
```
// Setting up Firebase instructions: https://firebase.google.com/docs/web/setup
<script defer src="https://www.gstatic.com/firebasejs/6.2.3/firebase-app.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/6.2.3/firebase-auth.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/6.2.3/firebase-firestore.js"></script>

// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  // ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

```

Next, lets trigger a notification by adding a new document to the `notifications/processing/list` collection.
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

Note: The document saved must follow the above format, i.e. have a `map` type field called `payload` with the following child text fields: `icon`, `click_action`, `title`, and `body`.

## Final Words
If you are still having difficulty, we would love for you to post
a question to [the Push Manager issues page](https://github.com/itw-creative-works/push-manager/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library.
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes.
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites.
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs.
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products.

Ask us to have your project listed! :)
