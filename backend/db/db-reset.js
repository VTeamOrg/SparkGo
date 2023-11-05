const { MongoClient } = require("mongodb");

const ATLAS_USERNAME = "adriandedorson2";
const ATLAS_PASSWORD = "8PJFVm5m6xStZS59";

async function resetTestDatabaseAndCreateCollection() {
    // Construct the MongoDB connection string using environment variables
    const client = new MongoClient(
        `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
    );

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const databaseName = "test";
        // Specify the collection name
        const collectionName = "tickets";

        // Drop the existing collection (if it exists)
        try {
            await client.db(databaseName).collection(collectionName).drop();
            console.log(`Dropped collection: ${collectionName}`);
        } catch (error) {
            // Ignore the error if the collection doesn't exist
            if (error.code !== 26) {
                console.error(
                    `Error dropping collection: ${collectionName}`,
                    error
                );
                throw error;
            }
        }

        // Create the 'tickets' collection
        try {
            await client.db().createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
        } catch (error) {
            console.error(
                `Error creating collection: ${collectionName}`,
                error
            );
            throw error;
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    } finally {
        await client.close();
        console.log("Closed MongoDB connection");
    }
}

// Call this function to reset the "testlocal" database and create the "tickets" collection
resetTestDatabaseAndCreateCollection();
