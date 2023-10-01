const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwt_secret_key } = require("../config/config");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (!(firstName && lastName && email && password && confirmPassword))
      return res.status(400).json({ message: "All fields are required" });
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Password and confirm password must be same" });
    const existingUser = await User.find({ email });
    if (existingUser.length != 0)
      return res.status(409).json({ message: "User already exists" });

    const newPassword = await bcrypt.hash(password, 11);
    const user = new User({
      firstName,
      lastName,
      email,
      password: newPassword,
    });
    const response = await user.save();
    // const {id,firstName,lastName,email} = response
    const username = response.firstName + " " + response.lastName;
    const userId = response._id;

    const token = jwt.sign({ userId, username }, jwt_secret_key, {
      expiresIn: "240h",
    });
    res.cookie("token", token, { httpOnly: false, maxAge: 3600000 });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.messsage });
  }
};

const signin = async (req, res) => {

  const { email, password } = req.body;
  if (!(email && password))
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.find({ email });

  if (user.length == 0)
    return res.status(400).json({ message: "Invalid username or password" });

  const response = user[0];

  const isPasswordCorrect = await bcrypt.compare(password, response.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid username or password" });

  const data = {
    userId: response._id,
    username: response.firstName + " " + response.lastName,
  };


  const token = jwt.sign(data, jwt_secret_key, { expiresIn: "120h" });

  res.cookie("token", token, { httpOnly: false, maxAge: 3600000 });
  res.status(200).json(response);
};

module.exports = { signin, signup };
