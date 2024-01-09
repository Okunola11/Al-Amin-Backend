const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    name: {
      type: String,
    },
    subjects: [
      {
        name: String,
        result: Number,
        grade: String,
        standing: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);
