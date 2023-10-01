require('dotenv').config();

const mongooseUrl = process.env.DB_URI
const jwt_secret_key = process.env.JWT_SECRET_KEY

module.exports = {mongooseUrl,jwt_secret_key}