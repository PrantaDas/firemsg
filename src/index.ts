/**
 * Wrapper of Firebase Cloud Messaging Service
 * Author:  Pranta Das
 * Github:  https://github.com/PrantaDas
 * Email:   prantodas043@gmail.com
 * Version: 1.0.0
 */


import * as path from 'path';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';


/**
 * Interface for notification options.
 */
interface NotificationOptions {
    title: string;
    body: string;
    sound: string;
    topic: string;
    imageUrl?: string;
};


/**
 * Initializes the Firebase Cloud Messaging service.
 *
 * @param  {string} credentialPath - The optional path to the Firebase Admin SDK JSON file.
 * @returns An object with the sendNotification method.
 */
const FCM = (credentialPath?: string) => {

    let initialized: boolean = false;

    /**
     * Initializes the Firebase Admin SDK.
     * Throws an error if initialization fails.
     */
    const initialize = (): void => {
        if (initialized) return;

        try {
            if (!credentialPath) {
                const files = fs.readdirSync(process.cwd());
                const credentialFile = files.find((file) =>
                    file.includes("firebase-adminsdk") && path.extname(file) === 'json'
                );

                if (!credentialFile) {
                    throw new Error(
                        'Firebase Admin SDK JSON file not found in the root directory and no path provided'
                    );
                }

                credentialPath = path.join(process.cwd(), credentialFile);
            }

            const credential = admin.credential.cert(path.resolve(credentialPath));

            admin.initializeApp({
                credential
            });

            initialized = true;
            console.log("🔔 Notification service initialized");
        } catch (err) {
            console.error('Initialization error\n', err);
            // Re-throwing the error to ensure it can be handled by the caller
            throw err;
        }
    };

    /**
    * Sends a notification using Firebase Cloud Messaging.
    *
    * @param {NotificationOptions} options - The notification options.
    * @returns {Promise<string>} - The message ID of the sent notification.
    * @throws Will throw an error if sending the notification fails.
    *
    * @example
    * // Send a notification with required options
    * const options = {
    *   title: 'New Message',
    *   body: 'You have received a new message',
    *   topic: 'news',
    * };
    * try {
    *   const messageId = await sendNotification(options);
    *   console.log('Notification sent. Message ID:', messageId);
    * } catch (error) {
    *   console.error('Failed to send notification:', error);
    * }
    */
    const sendNotification = async ({
        title,
        body,
        imageUrl = '',
        sound = 'default',
        topic = '',
    }: NotificationOptions): Promise<string> => {
        try {
            initialize();

            if (!topic || topic.trim() === '') {
                throw new Error(
                    'Topic can\'t be empty,Either provide a topic or provide a token'
                );
            }

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
                    imageUrl
                },
                topic
            };

            if (!imageUrl) {
                delete messageBody.notification?.imageUrl;
            }

            const messageId = await getMessaging().send(messageBody);
            console.log("💥 Notification sent");
            return messageId;
        }
        catch (err) {
            console.error('Error Sending Notification:\n', err);
            // Re-throwing the error to ensure it can be handled by the caller
            throw err;
        }
    };

    return { sendNotification };
};

export { FCM };
