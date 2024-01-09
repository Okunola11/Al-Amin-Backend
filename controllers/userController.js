const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  // get all users from mongoDB
  const users = await User.find().select("-password").lean();

  // If no user
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

//@desc POST a user
//@route POST /users
//@access Private
const postUser = asyncHandler(async (req, res) => {
  const { username, usernum, password, roles } = req.body;

  // confirm that the data
  if (!username || !usernum || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check for duplicate
  const duplicate = await User.findOne({ usernum })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // encrypting the password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    usernum,
    "password": hashedPwd,
    roles,
  };

  // create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${usernum} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

//@desc Update a user
//@route PUT /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, usernum, password, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !usernum ||
    !roles.length ||
    !Array.isArray(roles) ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All parameter field except password are required" });
  }

  // Find the User
  const user = await User.findById(id).exec();
  // evaluate if the given id does not exist in the database
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // evaluate duplicate username
  const duplicate = await User.findOne({ usernum })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  // allow updates only to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  user.username = username;
  user.usernum = usernum;
  user.roles = roles;
  user.active = active;
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }

  // save the updates
  const updatedUser = await user.save();
  res
    .status(201)
    .json({ message: `User ${updatedUser.username} data has been updated` });
});

//@desc Delete a user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm if data is gotten
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Find the user
  const user = await User.findById(id).exec();

  //evaluate for no found user
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();
  const reply = `Employee ${user.username} with usernumber ${user.usernum} and ID ${user._id} has been deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, postUser, updateUser, deleteUser };
