# FIRE MSG

## Overview
This is a simple wrapper service for sending notifications built on top of Firebase Cloud Messaging (FCM). It provides a function to send notifications with customizable options.

# Installation 
You can install **firemsg** using `npm`, `yarn`, `pnpm`.

## npm
```sh
npm i firemsg
```

## pnpm
```sh
pnpm install firemsg
```

## yarn
```sh
yarn add firemsg
```

# Example 
## TypeScript
First, import the package and initialize the `firemsg` with the path to your Firebase Admin SDK JSON file:
```ts
import { FCM, NotificationOptions } from 'firemsg';

// Initialize FCM service with Firebase Admin SDK JSON file path
const fcm = FCM('./path/to/credentials.json');

// Define notification options
const options: NotificationOptions = {
    title: 'New Message',
    body: 'You have received a new message',
    topic: 'news',
    imageUrl: 'https://example.com/image.png',
    sound: 'default',
};

// Send a notification
try {
    const messageId = await fcm.sendNotification(options);
    console.log('Notification sent. Message ID:', messageId);
} catch (error) {
    console.error('Failed to send notification:', error);
}
```
## CommonJS
First, require the package and initialize the Firebase Cloud Messaging service with the path to your Firebase Admin SDK JSON file:

```js
const { FCM } = require('firemsg');

// Initialize FCM service with Firebase Admin SDK JSON file path
const fcm = FCM('./path/to/credentials.json');

// Define notification options
const options = {
    title: 'New Message',
    body: 'You have received a new message',
    topic: 'news',
    imageUrl: 'https://example.com/image.png',
    sound: 'default',
};

// Send a notification
fcm.sendNotification(options)
    .then((messageId) => {
        console.log('Notification sent. Message ID:', messageId);
    })
    .catch((error) => {
        console.error('Failed to send notification:', error);
    });
```

# API
`FCM(credentialPath: string): { sendNotification: (options: NotificationOptions) => Promise<string> }`

Initializes the  Firebase Cloud Messaging service  service with the provided Firebase Admin SDK JSON file path. Returns an object with a sendNotification method.

### Parameters

* `credentialPath` (string): The path to the Firebase Admin SDK JSON file.

`sendNotification(options: NotificationOptions): Promise<string>`

Sends a notification using Firebase Cloud Messaging with the provided options.

### Parameters

* options (NotificationOptions): The notification options.

    * title (string): The title of the notification.
    * `body` (string): The body of the notification.
    * `topic` (string): The topic to which the notification will be sent.
    * `imageUrl` (string, optional): The URL of the image to be included in the notification.
    * `sound` (string, optional): The sound to be played when the notification is received.

### Returns
* `Promise<string>`: The message ID of the sent notification.

# Note
This package is created as part of a learning process. Feedback and contributions are welcome! Feel free to open issues or pull requests on [GitHub](https://github.com/PrantaDas/firemsg).

License
This project is licensed under the [MIT License](https://github.com/PrantaDas/firemsg/blob/main/LICENSE).