const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  studentname: {
    type: String,
    required: true,
  },
  studentnum: {
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
});

module.exports = mongoose.model("Student", studentSchema);
