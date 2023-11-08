const { MongoClient } = require("mongodb");
const chai = require("chai");
const expect = chai.expect;

chai.should();

describe("Reset Database and Create Collection", () => {
    let client;

    before(async () => {
        // Construct the MongoDB connection string using environment variables
        const mongoUri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`;
        client = new MongoClient(mongoUri, {});

        try {
            await client.connect();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    });

    after(async () => {
        // Close the MongoDB connection
        try {
            await client.close();
            console.log("Closed MongoDB connection");
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);
            throw error;
        }
    });

    it("should reset the database and create 'tickets' collection", async function () {
        this.timeout(50000); // Increase the timeout for creating the database and collection

        // Specify the database name and collection name
        const databaseName = "test";
        const collectionName = "tickets";

        // Drop the existing database
        try {
            await client.db(databaseName).dropDatabase();
            console.log(`Dropped database: ${databaseName}`);
        } catch (error) {
            console.error(`Error dropping database: ${databaseName}`, error);
            throw error;
        }

        // Create the 'tickets' collection
        try {
            await client.db(databaseName).createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
        } catch (error) {
            console.error(
                `Error creating collection: ${collectionName}`,
                error
            );
            throw error;
        }
    });
});
