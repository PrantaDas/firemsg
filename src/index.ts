/**
 * Wrapper of Firebase Cloud Messaging Service
 * Author:  Pranta Das
 * Github:  https://github.com/PrantaDas
 * Email:   prantodas043@gmail.com
 * Version: 1.0.0
 */


import path from 'node:path';
import fs from 'node:fs';
import admin from 'firebase-admin';
import { AppName, NotificationOptions } from './types';
import { EmptyAppNameError, EmptyTopicError, FirebaseAdminSDKjsonNotFoundError } from './customError';


/**
 * Checking the installed environment
 */

// Only Node.js has a process variable that is of [[Class]] process
const processGlobal = typeof process !== 'undefined' ? process : 0;

if (Object.prototype.toString.call(processGlobal) !== '[object process]') {
    const message = `
        ==========Warning===========

        firemsg appears to have been installed in an unsupported environment.
        This package should only be used in server-side or backend Node.js environments,
        and should not be used in web browsers or other client-side environments.
    `;
    console.error(message);
}

/**
 * Initializes the Firebase Cloud Messaging service.
 *
 * @param {string} name - The app name.Ex: 'android' | 'ios .
 * @param  {string} credentialPath - The optional path to the Firebase Admin SDK JSON file.
 * @returns An object with the send method.
 */
const FCM = (name: AppName, credentialPath?: string) => {

    if (!name || name.trim().length === 0) {
        throw new EmptyAppNameError();
    }

    let initialized: boolean = false;

    /**
     * Initializes the Firebase Admin SDK.
     * Throws an error if initialization fails.
     */
    const initialize = (): void => {
        if (initialized) return;

        if (!credentialPath) {
            // looking for the Firebase Admin SDK credentials if not provided as parameter
            const files = fs.readdirSync(process.cwd());
            const credentialFile = files.find((file) =>
                file.includes("firebase-adminsdk") && path.extname(file) === '.json'
            );

            if (!credentialFile) {
                throw new FirebaseAdminSDKjsonNotFoundError();
            }

            credentialPath = path.join(process.cwd(), credentialFile);
        }

        const credential = admin.credential.cert(path.resolve(credentialPath));

        admin.initializeApp({
            credential
        }, name);

        initialized = true;
    };

    // initializing the sdk service
    initialize();

    /**
    * Sends a notification using Firebase Cloud Messaging.
    *
    * @param {NotificationOptions} options - The notification options.
    * @returns {Promise<string>} - The message ID of the sent notification.
    * @throws {EmptyTopicError} - Will throw an error if the topic in empty.
    *
    * @example
    * // Send a notification with required options
    * const fcm = FCM("/path/to/firebase/credentials");
    * const options = {
    *   title: 'New Message',
    *   body: 'You have received a new message',
    *   topic: 'news',
    *   imageUrl: 'https://example.image.url',
    *   sound: 'default',
    *   data: {
    *       "key":"value"
    *   }
    * };
    * try {
    *   const messageId = await fcm.send(options);
    *   console.log('Notification sent. Message ID:', messageId);
    * } catch (error) {
    *   console.error('Failed to send notification:', error);
    * }
    */
    const send = async ({
        title,
        body,
        topic,
        sound = 'default',
        imageUrl,
        data
    }: NotificationOptions): Promise<string | undefined> => {
        // calling the function again to ensure that the sdk is initialized before send notification
        initialize();

        if (!topic || topic.trim().length === 0) {
            throw new EmptyTopicError();
        }

        // forming the notification object
        const messageBody: admin.messaging.Message = {
            apns: {
                payload: {
                    aps: {
                        sound
                    }
                }
            },
            notification: {
                title,
                body,
                ...(imageUrl && { imageUrl })
            },
            topic,
            ...(data && { data })
        };

        const messageId = await admin.messaging().send(messageBody);
        return messageId;
    };


    return { send };
};

export { FCM };
