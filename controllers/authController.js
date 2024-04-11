const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Employee/User Login
// @route POST /auth
// @access Public
const handleUserLogin = asyncHandler(async (req, res) => {
  const { usernum, password } = req.body;
  if (!usernum || !password) {
    return res
      .status(400)
      .json({ message: `Employee's ID and password are required` });
  }
  // Find the Employee usernum in the dataBase
  const findUser = await User.findOne({ usernum }).exec();
  if (!findUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the input password matches the found Usernum
  const match = await bcrypt.compare(password, findUser.password);
  if (match) {
    const roles = findUser.roles;
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": findUser.username,
          "usernum": findUser.usernum,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { "usernum": findUser.usernum },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // create a http only secure cookie to store the refreshToken
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only by a web server
      sameSite: "None", // cross site cookie
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send only the accessToken containing the usernum, username and roles
    res.json({ accessToken });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// @desc Student Login
// @route POST /auth/student
// @access Public
const handleStudentLogin = asyncHandler(async (req, res) => {
  const { usernum, password } = req.body;
  if (!usernum || !password) {
    return res
      .status(400)
      .json({ message: `Student's ID and password are required` });
  }

  // Finding the input student's usernum in the database
  const findStudent = await Student.findOne({ usernum }).exec();
  if (!findStudent) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Compare the input password with the student's password
  const match = await bcrypt.compare(password, findStudent.password);
  if (match) {
    const roles = findStudent.roles;
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "usernum": findStudent.usernum,
          "username": findStudent.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { "usernum": findStudent.usernum },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // create a http only secure cookie to store the refreshToken
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send only the accessToken containing the usernum, username and roles
    res.json({ accessToken });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// @desc Refresh
// @route POST /auth/refresh
// @access Public (because access token must have expired)
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      let findUser;
      findUser = await User.findOne({ usernum: decoded.usernum }).exec();
      if (!findUser)
        findUser = await Student.findOne({ usernum: decoded.usernum }).exec();

      if (!findUser) return res.status(401).json({ message: "Unauthorized" });

      const roles = findUser.roles;
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "usernum": findUser.usernum,
            "username": findUser.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    })
  );
});

// @desc Logout
// @route POST /auth/logout
// @access Public (to make sure to clear cookies if exist)
const handleLogout = (req, res) => {
  const cookies = req?.cookies;
  if (!cookies) res.sendStatus(204);

  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.json({ message: "Cookies cleared" });
};

module.exports = {
  handleUserLogin,
  handleStudentLogin,
  handleRefreshToken,
  handleLogout,
};
