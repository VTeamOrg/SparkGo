const database = require("../db/database.js");

const userModel = {
    getAllUsers: async function getAllUsers() {
        try {
            const db = await database.openDb();
            const allUsers = await database.query(
                db,
                "SELECT * FROM member ORDER BY id DESC"
            );
            await database.closeDb(db);
            return allUsers;
        } catch (error) {
            throw error;
        }
    },

    createUser: async function (userData) {
        try {
            const db = await database.openDb();
            const {
                role,
                email,
                name,
                personal_number,
                address,
                wallet,
            } = userData;

            const newUser = await database.query(
                db,
                "INSERT INTO member (role, email, name, personal_number, address, wallet) VALUES (?, ?, ?, ?, ?, ?)",
                [role, email, name, personal_number, address, wallet]
            );

            await database.closeDb(db);
            return newUser;
        } catch (error) {
            throw error;
        }
    },

    getUserById: async function getUserById(userId) {
        if (!userId) {
            throw new Error("Missing user ID");
        }

        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE id = ?;",
                userId
            );
            await database.closeDb(db);
            return user[0];
        } catch (error) {
            throw error;
        }
    },

    updateUser: async function updateUser(userId, updatedFields) {
        if (!userId) {
          throw new Error("Missing user ID");
        }

        console.log("updated fields", updatedFields);
        try {
          const db = await database.openDb();
      
          const setFields = [];
          const updateParams = [];
      
          for (const field in updatedFields) {
            // Check if the field value is not null before adding it to setFields
            if (updatedFields[field] !== null) {
              setFields.push(`${field} = ?`);
              updateParams.push(updatedFields[field]);
            }
          }
      
          if (setFields.length === 0) {
            // No fields to update, return early
            return null;
          }
      
          updateParams.push(userId);
      
          const setFieldsStr = setFields.join(", ");
          const updateQuery = `UPDATE member SET ${setFieldsStr} WHERE id = ?`;
      
          const updatedUser = await database.query(
            db,
            updateQuery,
            updateParams
          );
      
          await database.closeDb(db);
          return updatedUser;
        } catch (error) {
          throw error;
        }
      },
      

    deleteUser: async function deleteUser(userId) {
        if (!userId) {
            throw new Error("Missing user ID");
        }
        try {
            const db = await database.openDb();

            await database.query(db, "DELETE FROM member WHERE id = ?", userId);

            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async function getUserByEmail(email) {
        if (!email) {
            throw new Error("Missing user email");
        }
    
        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE email = ?;",
                [email]
            );
            await database.closeDb(db);
            return user.length > 0 ? user[0] : null;
        } catch (error) {
            throw error;
        }
    },

    isAdminByEmail: async function isAdminByEmail(email) {
        if (!email) {
            throw new Error("Missing user email");
        }
        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE email = ?;",
                [email]
            );
            await database.closeDb(db);
            return user.length > 0 && user[0].role === 'admin';
        } catch (error) {
            throw error;
        }    
    },

    isRepairByEmail: async function isRepairByEmail(email) {
        if (!email) {
            throw new Error("Missing user email");
        }
        try {
            const db = await database.openDb();
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE email = ?;",
                [email]
            );
            await database.closeDb(db);
            return user.length > 0 && user[0].role === 'repair';
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userModel;
