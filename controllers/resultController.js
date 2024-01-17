const Result = require("../models/Result");
const Student = require("../models/Student");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

//@desc Get all results
//@route GET /results
//@access Private
const getAllResults = asyncHandler(async (req, res) => {
  // get all results form MongoDB
  const results = await Result.find().lean();

  // if no results
  if (!results?.length) {
    return res.status(400).json({ message: "No results found" });
  }

  // send the student name with the results
  const resultWithStudent = await Promise.all(
    results.map(async (result) => {
      const student = await Student.findById(result.student).lean().exec();
      const teacher = await User.findById(student.teacher).lean().exec();
      return {
        ...result,
        username: student.username,
        classname: student.classname,
        studentID: student.usernum,
        teachernum: teacher.usernum,
      };
    })
  );

  res.json(resultWithStudent);
});

//@desc Post a new result
//@route POST /results
//@access Private
const postResult = asyncHandler(async (req, res) => {
  const { student, subjects } = req.body;

  // Confirm the data is received
  if (!student || !subjects?.length || !Array.isArray(subjects)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check for duplicate student
  const duplicate = await Result.findOne({ student })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Student already has a result" });
  }

  // calculte the grade for each subject score
  const calculateGrade = (result) => {
    // The grading logic is customized based on the schools requirements
    if (result >= 70) {
      return "A";
    } else if (result >= 60) {
      return "B";
    } else if (result >= 50) {
      return "C";
    } else if (result >= 40) {
      return "D";
    } else {
      return "F";
    }
  };

  // calculate for the academic standing
  const getStanding = (result) => {
    if (result >= 70) {
      return "Excellent";
    } else if (result >= 60) {
      return "Good";
    } else if (result >= 50) {
      return "Average";
    } else if (result >= 40) {
      return "Fair";
    } else {
      return "Poor";
    }
  };

  const studentWithGradesObject = {
    student,
    subjects: subjects.map((subject) => ({
      name: subject.name,
      result: subject.result,
      grade: calculateGrade(subject.result),
      standing: getStanding(subject.result),
    })),
  };

  const result = await Result.create(studentWithGradesObject);

  if (result) {
    return res
      .status(201)
      .json({ message: `New result for ${result.student} created.` });
  } else {
    return res.status(400).json({ message: "Invalid data entry" });
  }
});

//@desc PUT to a result
//@route PUT /results
//@access Private
const updateResult = asyncHandler(async (req, res) => {
  const { id, student, subjects } = req.body;
  if (!id || !student || !subjects.length || !Array.isArray(subjects)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // query to know the exact result to update
  const result = await Result.findById(id).exec();

  if (!result) {
    return res.status(400).json({ message: "No results found" });
  }

  //check for duplicate
  const duplicate = await Result.findOne({ student })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  // we just make sure only one result can be assigned to a studentID
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate student" });
  }

  result.student = student;
  if (subjects) {
    // calculte the grade for each subject score
    const calculateGrade = (result) => {
      // The grading logic is customized based on the schools requirements
      if (result >= 70) {
        return "A";
      } else if (result >= 60) {
        return "B";
      } else if (result >= 50) {
        return "C";
      } else if (result >= 40) {
        return "D";
      } else {
        return "F";
      }
    };

    // calculate for the academic standing
    const getStanding = (result) => {
      if (result >= 70) {
        return "Excellent";
      } else if (result >= 60) {
        return "Good";
      } else if (result >= 50) {
        return "Average";
      } else if (result >= 40) {
        return "Fair";
      } else {
        return "Poor";
      }
    };

    result.subjects = subjects.map((subject) => ({
      name: subject.name,
      result: subject.result,
      grade: calculateGrade(subject.result),
      standing: getStanding(subject.result),
    }));
  }

  const savedResult = await result.save();
  res.status(201).json({
    message: `Results of ${result.student} has been successfully updated`,
  });
});

//@desc Delete a result
//@route DELETE /results
//@access Private
const deleteResult = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // confirm data is received
  if (!id) {
    return res.status(400).json({ message: "Result ID is required" });
  }

  //find the result
  const result = await Result.findById(id).exec();
  if (!result) {
    return res.status(400).json({ message: "There is no result found" });
  }

  const deleteResult = await result.deleteOne();

  const reply = `Results of ${result.student} with ID ${result._id} has been deleted`;

  res.json(reply);
});

module.exports = { getAllResults, postResult, updateResult, deleteResult };
