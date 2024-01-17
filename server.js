require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

// middleware to connect to mongoDB database
connectDB();

// middleware to keep record of all request logs
app.use(logger);

// middleware for cross-origin-resource-sharing
app.use(cors(corsOptions));

// middleware to process json data
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// middleware for static files
app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));

app.use(verifyJWT);
app.use("/results", require("./routes/resultRoutes"));
app.use("/students", require("./routes/studentRoutes"));
app.use("/users", require("./routes/userRoutes"));

// catching pages or requests not found
app.use("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type(txt).send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
