const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  studentID: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: [String],
    require: true,
    default: ["Mathematics", "English Language", "Yoruba"],
  },
});

module.exports = mongoose.model("Student", studentSchema);
