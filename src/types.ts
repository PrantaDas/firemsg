/**
 * Interface for notification options.
 */
export interface NotificationOptions {
    title: string;
    body: string;
    sound: string | "default";
    topic: string;
    data?: Data;
    imageUrl?: string;
};

export interface Data {
    [key: string]: string;
}

/**
 * Type of app name.
 */
export type AppName = "android" | "ios";