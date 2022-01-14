const User = require("../schemas/user");
const mongoose = require("mongoose");

const addUser = async (userCredentials) => {
  try {
    const userExists = await User.findOne({ email: userCredentials.email });
    if (userExists) return { error: true, message: "User already exists" };
    const user = await User.create(userCredentials);
    if (!user.email)
      return { error: true, message: "Could not write to MongoDB" };
    return user;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
    return;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User does not exist", error: err });
    return;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User does not exist", error: err });
    return;
  }
};

module.exports = {
  addUser,
  getUserById,
  getUserByEmail,
};
