const userModel = require("../models/userModel.js");

async function createUserIfNotExists(userData) {
  const user = await userModel.getUserByEmail(userData.email);
  
  if (!user) {
    const newUser = await userModel.createUser({
      role: 'user', // Set the default role
      email: userData.email,
      name: userData.name || '', // Set the name from Google OAuth
      personal_number: null, // Set other fields to null or default values
      address: null,
      wallet: 0
    });

    console.log("New User Created:", newUser);
    return newUser;
  }

  return user;
}

async function checkAdminStatus(email) {
  const isAdmin = await userModel.isAdminByEmail(email);
  return isAdmin;
}

module.exports = {
  createUserIfNotExists,
  checkAdminStatus,
};