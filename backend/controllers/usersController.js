const priceListModel = require("../models/priceListModel.js");
const subscriptionModel = require("../models/subscriptionModel.js");
const userModel = require("../models/userModel.js");

const usersController = {
    getAllUsers: async function getAllUsers(req, res) {
        console.log("get all users");
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

    getUserVehiclePrice: async function getUserVehiclePrice(req, res) {
        // will be changed to get user id from token when auth is implemented
        const userId = 1;
        const vehicleType = req.params.vehicleType;
        console.log("vehicleType ", vehicleType);
        // checks if user have a subscription and if have free minutes or free unlocks left return free. if not return price of vehicle type
        try {
            const user = await userModel.getUserById(userId);
            const subscription = await subscriptionModel.getSubscriptionByMemberId(userId);
            const priceList = await priceListModel.getPriceListItemByTypeId(vehicleType);

            if (!priceList) {
                return res.status(404).json({ message: "Price list not found" });
            }

            const price = {
                unlock: priceList.price_per_unlock,
                minute: priceList.price_per_minute,
            }

            if (subscription && subscription.available_unlocks > 0) {
                price.unlock = 0;
            }

            if (subscription && subscription.available_minutes > 0) {
                price.minute = 0;
            }

            res.json({
                data: price,
            });
        } catch (error) {
            throw error;
        }
    },

    getUserById: async function getUserById(req, res) {
        console.log("controller by id");
        try {
            const userId = req.params.id;
            console.log("userId ", userId);
            const user = await userModel.getUserById(userId);

            return res.json({
                data: [user],
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
};

module.exports = usersController;
