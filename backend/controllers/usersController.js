const userModel = require("../models/userModel.js");

const usersController = {
    getAllUsers: async function getAllUsers(req, res) {
        try {
            const allUsers = await userModel.getAllUsers();
            return res.json({
                data: allUsers,
            });
        } catch (error) {
            console.error("Error getting all users:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createUser: async function (req, res) {
        try {
            const {
                role,
                email,
                name,
                personal_number,
                address,
                wallet,
            } = req.body;

            const newUser = await userModel.createUser({
                role,
                email,
                name,
                personal_number,
                address,
                wallet,
            });

            return res.status(201).json({
                message: "User created successfully",
                data: newUser,
            });
        } catch (error) {
            console.error("Error creating user:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getUserById: async function getUserById(req, res) {
        console.log("controller by id");
        try {
            const userId = req.params.id;
            console.log("userId ", userId);
            const user = await userModel.getUserById(userId);

            return res.json({
                data: user,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateUser: async function updateUser(req, res) {
        try {
          const userId = req.params.id;
          const requestBody = req.body;
      
          // Specify the allowed fields to be updated
          const allowedFields = ['role', 'email', 'name', 'personal_number', 'address', 'wallet'];
      
          // Extract only the allowed fields from the request body
          const updatedFields = {};
          for (const field of allowedFields) {
            if (requestBody.hasOwnProperty(field)) {
              updatedFields[field] = requestBody[field];
            }
          }
      
          const updatedUser = await userModel.updateUser(userId, updatedFields);
      
          return res.json({
            message: "User updated successfully",
            data: updatedUser,
          });
        } catch (error) {
          console.error("Error updating user:", error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      },
      

    deleteUser: async function deleteUser(req, res) {
        try {
            const userId = req.params.id;

            await userModel.deleteUser(userId);

            return res.json({
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting user:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getUserByEmail: async function getUserByEmail(req, res) {
        console.log("getbyEmail");
        console.log('Received parameters:', req.params);
        try {
            const userEmail = req.params.email; 
            console.log('Searching for user by email:', userEmail);
            const user = await userModel.getUserByEmail(userEmail);
    
            if (user) {
                return res.json({
                    data: user,
                });
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    isAdminByEmail: async function isAdminByEmail(req, res) {
        try {
            const userEmail = req.params.email; 
            const isAdmin = await userModel.isAdminByEmail(userEmail);

            return res.json({
                isAdmin: isAdmin
            });
        } catch (error) {
            console.error("Error checking if user is admin:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    addToWallet: async (req, res) => {
        console.log("UserController addtowallet");
        try {
            const userId = req.params.id;
            const refillAmount = req.body.refillAmount;

            if (!userId || !refillAmount) {
                return res.status(400).json({ error: "Missing userId or refillAmount" });
            }

            const result = await userModel.addToWallet(userId, refillAmount);

            if (result && result.affectedRows === 1) {
                return res.status(200).json({ message: "Funds added to wallet successfully" });
            } else {
                return res.status(400).json({ error: "Failed to add funds to wallet" });
            }
        } catch (error) {
            console.error("Error adding funds to wallet:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },


};

module.exports = usersController;
