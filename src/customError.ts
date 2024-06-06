/**
 * Error Class for Empty Topic
 */
export class EmptyTopicError extends Error {
    constructor() {
        super('Topic can\'t be empty,Either provide a topic or provide a token');
        this.name = 'EmptyTopicError';
    }
}

/**
 * Error Class to throw when Firebase Admin SDK JSON file not found
 */
export class FirebaseAdminSDKjsonNotFoundError extends Error {
    constructor() {
        super('Firebase Admin SDK JSON file not found in the root directory and no path provided');
        this.name = 'FirebaseAdminSDKjsonNotFoundError';
    }
}
