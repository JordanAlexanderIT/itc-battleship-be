// const User = require("../schemas/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { addUser, getUserByEmail, getUserById } = require("../dao/user");

const signUpController = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCredentials = {
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
      displayName,
    };
    const user = await addUser(userCredentials);
    if (user.error) throw user;
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res.status(201).json({
      message: "Sign-up successful",
      token: token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "A serious error occurred", error: err });
    return;
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(500).json({ message: "User does not exist" });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Password incorrect" });
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res
      .status(200)
      .json({ message: "Login successful", token: token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "A serious error occured", error: err });
    return;
  }
};

const getUserByIdController = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await getUserById(id);
    if (!user) return res.status(500).json({ message: "User does not exist" });
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "A serious error occured", error: err });
    return;
  }
};

module.exports = {
  signUpController,
  loginController,
  getUserByIdController,
};
