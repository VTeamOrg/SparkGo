const database = require("../db/database.js");

const users = {
    getAllUsers: async function () {
        try {
            const db = await database.openDb();
            const allUsers = await database.query(
                db,
                "SELECT * FROM member ORDER BY id DESC"
            );

            await database.closeDb(db);

            return allUsers;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createUser: async function (
        role,
        email,
        name,
        personal_number,
        address,
        wallet
    ) {
        try {
            const db = await database.openDb();
            const newUser = await database.query(
                db,
                "INSERT INTO member (role, email, name, personal_number, address, wallet) VALUES (?, ?, ?, ?, ?, ?)",
                [role, email, name, personal_number, address, wallet]
            );

            await database.closeDb(db);

            return newUser;
        } catch (error) {
            console.error("Error creating user:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getUserById: async function (userId) {
        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE id = ?",
                userId
            );

            await database.closeDb(db);

            return user[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },


    getUserByEmail: async function (userId) {
        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE email = ?",
                userId
            );

            await database.closeDb(db);

            return user[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updateUser: async function (
        userId,
        role,
        email,
        name,
        personal_number,
        address,
        wallet
    ) {
        try {
            const db = await database.openDb();
            const setFields = [];
            const updateParams = [];

            if (role) {
                setFields.push("role = ?");
                updateParams.push(role);
            }
            if (email) {
                setFields.push("email = ?");
                updateParams.push(email);
            }
            // Include conditions for other fields to update

            // Prepare the SQL query
            const setFieldsStr = setFields.join(", ");
            const updateQuery = `UPDATE member SET ${setFieldsStr} WHERE id = ?`;
            updateParams.push(userId);

            // Perform the update query
            const updatedUser = await database.query(
                db,
                updateQuery,
                updateParams
            );

            await database.closeDb(db);

            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getUserByEmail: async function (email) {
        if (!email) {
          throw new Error("Missing user email");
        }
    
        try {
          const db = await database.openDb();
          const user = await database.query(
            db,
            "SELECT * FROM member WHERE email = ?",
            [email]
          );
    
          await database.closeDb(db);
    
          return user.length > 0 ? user[0] : null;
        } catch (error) {
          console.error("Error querying database:", error.message);
          throw new Error("Internal Server Error");
        }
      },
    
      isAdminByEmail: async function (email) {
        if (!email) {
          throw new Error("Missing user email");
        }
    
        try {
          const db = await database.openDb();
          const user = await database.query(
            db,
            "SELECT * FROM member WHERE email = ? AND role = 'admin'",
            [email]
          );
    
          await database.closeDb(db);
    
          return user.length > 0;
        } catch (error) {
          console.error("Error querying database:", error.message);
          throw new Error("Internal Server Error");
        }
      },
    
      isRepairByEmail: async function (email) {
        if (!email) {
          throw new Error("Missing user email");
        }
    
        try {
          const db = await database.openDb();
          const user = await database.query(
            db,
            "SELECT * FROM member WHERE email = ? AND role = 'repair'",
            [email]
          );
    
          await database.closeDb(db);
    
          return user.length > 0;
        } catch (error) {
          console.error("Error querying database:", error.message);
          throw new Error("Internal Server Error");
        }
      },

    deleteUser: async function (userId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM member WHERE id = ?", userId);

            await database.closeDb(db);

            return { message: "User deleted successfully" };
        } catch (error) {
            console.error("Error deleting user:", error.message);
            throw new Error("Internal Server Error");
        }
        
    },
};

module.exports = users;
