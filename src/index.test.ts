import { FCM } from ".";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { EmptyAppNameError, EmptyTopicError, FirebaseAdminSDKjsonNotFoundError } from "./customError";

jest.mock("fs");
jest.mock("firebase-admin");
jest.mock("path");

describe("FCM Wrapper", () => {

    beforeEach(() => jest.clearAllMocks());

    it("Should throw an error if name is not provided or empty", () => {
        expect(() => FCM("")).toThrow(EmptyAppNameError);
    });

    it("Should not throw an error if name is not provided", () => {
        expect(() => FCM("android")).not.toThrow(EmptyAppNameError);
    });

    it("Should not throw an error if the credentials file is in the root directory or path is provided", () => {
        expect(() => FCM("test-app")).not.toThrow(FirebaseAdminSDKjsonNotFoundError);
    });

    // it("Should throw an error if the credentials are not in the root or path not provided", () => {
    //     expect(() => FCM("test-app")).toThrow(FirebaseAdminSDKjsonNotFoundError);
    // });

    it("Should return a function name send if initialized successfully", () => {
        const fcm = FCM("test-app");
        expect(typeof fcm.send).toBe("function");
    });

    it("Should throw an error if the topic is empty or not provided in send function", async () => {
        const fcm = FCM("test-app");
        await expect(fcm.send({ title: 'test-title', body: 'test-body', topic: '' })).rejects.toBeInstanceOf(EmptyTopicError);
    });

});