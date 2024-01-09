const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
  usernum: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  classname: {
    type: String,
    required: true,
  },
  subjects: {
    type: [String],
    require: true,
    default: ["Mathematics", "English Language", "Yoruba"],
  },
  roles: {
    type: [String],
    default: ["Student"],
  },
});

module.exports = mongoose.model("Student", studentSchema);
