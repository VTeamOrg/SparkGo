const { MongoClient } = require("mongodb");

const tickets = {
    getTickets: async function getTickets(req, res) {
        const client = new MongoClient(
            `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
        );

        try {
            await client.connect();
            const db = client.db("test"); // Replace with your MongoDB database name

            const allTickets = await db.collection("tickets").find().toArray();

            return res.json({
                data: allTickets,
            });
        } finally {
            client.close();
        }
    },

    getTicketsByActivityId: async function getTicketsByActivityId(req, res) {
        const client = new MongoClient(
            `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
        );

        try {
            await client.connect();
            const db = client.db("test"); // Replace with your MongoDB database name

            const activityId = req.params.activityId; // Get the Activity ID from the URL parameter

            // Query the database to find a ticket by both _id and activityId
            const ticket = await db.collection("tickets").findOne({
                activityId: activityId,
            });

            if (ticket) {
                return res.json({
                    data: [ticket], // Return the ticket as an array
                });
            } else {
                return res.status(404).json({
                    error: "Ticket not found.",
                });
            }
        } catch (error) {
            console.error("Error fetching ticket by Activity ID:", error);
            return res.status(500).json({
                error: "An internal server error occurred.",
            });
        } finally {
            client.close();
        }
    },

    createTicket: async function createTicket(req, res) {
        const client = new MongoClient(
            `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
        );

        try {
            await client.connect();
            const db = client.db("test"); // Replace with your MongoDB database name

            // Process the request data and create the ticket
            console.log("Received request data:", req.body);
            const result = await db.collection("tickets").insertOne({
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
                activityId: req.body.activityId, // Corrected line
            });

            return res.json({
                data: {
                    id: result.insertedId,
                    code: req.body.code, // Corrected line
                    trainnumber: req.body.trainnumber,
                    traindate: req.body.traindate,
                    activityId: req.body.activityId,
                },
            });
        } catch (error) {
            console.error("Error creating ticket:", error);
            // Return an error response
            return res.status(500).json({
                error: "An internal server error occurred.",
            });
        } finally {
            client.close();
        }
    },
    updateTicket: async function updateTicket(req, res) {
        const client = new MongoClient(
            `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
        );

        try {
            await client.connect();
            const db = client.db("test"); // Replace with your MongoDB database name

            const activityId = req.params.activityId; // Get the activity ID from the URL
            const receivedData = req.body;

            console.log(receivedData);
            const updatedTicketData = {
                id: receivedData.id,
                code: receivedData.code,
                trainnumber: receivedData.trainnumber,
                traindate: receivedData.traindate,
                activityId: receivedData.activityId,
            };

            console.log("Received id for update:", activityId); // Log the _id value
            console.log("Received update data:", updatedTicketData); // Log the update data

            const result = await db.collection("tickets").updateOne(
                { activityId: activityId }, // Use the correct field to find the document
                { $set: { code: updatedTicketData.code } } // Specify the field to update
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Ticket not found." });
            }

            return res.json({ message: "Ticket updated successfully." });
        } catch (error) {
            console.error("Error updating ticket:", error);
            return res
                .status(500)
                .json({ error: "An internal server error occurred." });
        } finally {
            client.close();
        }
    },

    deleteTicket: async function deleteTicket(req, res) {
        const client = new MongoClient(
            `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ljydkel.mongodb.net/?retryWrites=true&w=majority`
        );

        try {
            await client.connect();
            const db = client.db("test"); // Replace with your MongoDB database name

            const activityId = req.params.activityId; // Get the ticket ID from the URL

            const result = await db.collection("tickets").deleteOne(
                { activityId: activityId } // Specify the ticket to delete by its activity Id
            );

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Ticket not found." });
            }

            return res.json({ message: "Ticket deleted successfully." });
        } catch (error) {
            console.error("Error deleting ticket:", error);
            return res
                .status(500)
                .json({ error: "An internal server error occurred." });
        } finally {
            client.close();
        }
    },
};

module.exports = tickets;
