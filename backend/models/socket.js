const lockedItems = new Set(); // Track locked tickets

const setupSocketServer = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected to Tickets");

        socket.on("openErrand", async (data) => {
            const { ticketId } = data;

            if (!lockedItems.has(ticketId)) {
                lockedItems.add(ticketId);
                // Logic for opening the errand
                console.log(`Ticket ${ticketId} has been opened by a user.`);
            } else {
                console.log(`Ticket ${ticketId} is already being handled.`);
                socket.emit("ticketLocked", { ticketId: ticketId });
                return;
            }
        });

        socket.on("closeErrand", async (data) => {
            const { ticketId } = data;

            if (lockedItems.has(ticketId)) {
                lockedItems.delete(ticketId);
                // Logic for closing the errand
                console.log(`Ticket ${ticketId} has been closed by a user.`);
            } else {
                console.log(
                    `Ticket ${ticketId} is not currently being handled.`
                );
            }
        });

        socket.on("checkLock", (data, callback) => {
            const { ticketId } = data;
            const isLocked = lockedItems.has(ticketId);
            callback({ isLocked });
        });
    });
};

module.exports = setupSocketServer;
