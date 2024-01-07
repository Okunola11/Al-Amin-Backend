const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}`,
    "errLog.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; //500 is http header for server error

  res.status(status);

  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
