process.env.NODE_ENV = "test";

const { MongoClient } = require("mongodb");

async function resetTestDatabaseAndCreateCollection() {
    // Construct the MongoDB connection string using environment variables
    const mongoUri = `mongodb://localhost:27017/testlocal`;

    const client = new MongoClient(mongoUri, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Specify the collection name
        const collectionName = "tickets";

        // Drop the existing collection (if it exists)
        try {
            await client.db().collection(collectionName).drop();
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
