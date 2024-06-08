/**
 * Interface for notification options.
 */
export interface NotificationOptions {
    title: string;
    body: string;
    topic: string;
    sound?: string | "default";
    data?: Data;
    imageUrl?: string;
};

export interface Data {
    [key: string]: string;
}

/**
 * Type of app name.
 */
export type AppName = string | "android" | "ios";