const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  studentName: {
    type: String,
    required: true,
  },
  studentID: {
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
