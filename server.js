const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = 3500;

// middleware to keep record of all request logs
app.use(logger);

// middleware for static files
app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/root"));

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

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
