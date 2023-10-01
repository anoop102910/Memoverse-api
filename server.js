const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const {mongooseUrl} = require('./config/config')

const app = express();

mongoose
  .connect(mongooseUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PATCH,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);


app.listen(5000, (error) => {
  if (error) console.log(error);
  console.log("Listening on port number 5000");
});
