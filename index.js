const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/route/route.js");
const app = express();

const path =  require('path');

const multer = require("multer");

app.use(express.json());
const upload = multer();
app.use(upload.any());


const rootDir = path.resolve(__dirname);

mongoose.set("strictQuery", true);
let mongoDbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "testenv") {
  dotenv.config({ path: ".env.testenv" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
}


let PORT = process.env.PORT;
let DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE, mongoDbConfig)
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));



app.use("/api", route);




if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  app.use(express.static("ui"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "ui/index.html"));
  });
}

app.use((req, res, next) => {
  const error = new Error("Path not found.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Express app running on ${PORT}`);
});