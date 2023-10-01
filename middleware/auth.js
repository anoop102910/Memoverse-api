const jwt = require("jsonwebtoken");
const {jwt_secret_key} = require("../config/config");

const auth = (req, res, next) => {
  const token = req.cookies.token;
  console.log("auth", token);
  if (!token) {
    console.log("token not present");
    return res.status(401).json({ message: "token is not present" });
  }
  jwt.verify(token, jwt_secret_key, (err, decoded) => {
    if (err) {
      console.log("token is expired");
      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.log(decoded);
      req.user = { userId: decoded.userId, username: decoded.username };
      next();
    }
  });
};

module.exports = auth;
