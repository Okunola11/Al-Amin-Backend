const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

//@desc Get all students
//@route GET /students
//@access Private
const getAllStudents = asyncHandler(async (req, res) => {
  // Query the database for the students
  const students = await Student.find().select(-password).lean();

  if (!students) {
    return res.status(400).json({ message: "No students found" });
  }

  // send the class teacher's name with the students
  const studentWithTeachers = await Promise.all(
    students.map(async (student) => {
      const teacher = await User.findById(student.teacher).lean().exec();
      return { ...students, teacher: teacher.username };
    })
  );

  res.json(studentWithTeachers);
});

//@desc POST a new student
//@route POST /students
//@access Private
const postStudent = asyncHandler(async (req, res) => {
  const { teacher, studentname, studentnum, password, classname, subjects } =
    req.body;

  // confirm the data is received
  if (
    !teacher ||
    !studentname ||
    !studentnum ||
    !password ||
    !classname ||
    !subjects?.length ||
    !Array.isArray(subjects)
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  const duplicate = await Student.findOne({ studentnum })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // encrypt the password
  const hashedPwd = await bcrypt.hash(password, 10);

  const studentObject = {
    studentname,
    studentnum,
    "password": hashedPwd,
    teacher,
    classname,
    subjects,
  };

  // create and store the new student
  const student = await Student.create(studentObject);

  if (student) {
    return res
      .status(201)
      .json({ message: `New student ${studentname} created.` });
  } else {
    return res.status(400).json({ message: "Invalid student data entry" });
  }
});

//@desc PUT to a student
//@route PUT /students
//@access Private
const updateStudent = asyncHandler(async (req, res) => {
  const { teacher, studentname, studentnum, password, classname, subjects } =
    req.body;

  if (
    !id ||
    !teacher ||
    !studentname ||
    !studentnum ||
    !classname ||
    !subjects?.length ||
    !Array.isArray(subjects)
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }
  // Query the particular student
  const student = await Student.findById(id).exec();
  if (!student) {
    return res.status(400).json({ message: "Student not found" });
  }

  // Check for duplicate
  const duplicate = await Student.findOne({ studentnum })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  student.teacher = teacher;
  student.studentname = studentname;
  student.studentnum = studentnum;
  student.classname = classname;
  student.subjects = subjects;
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10);
  }

  const updatedStudent = await student.save();

  res.json({ message: `${updatedStudent.studentname} updated` });
});

//@desc Delete a student
//@route DELETE /students
//@access Private
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm the data
  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  // Query the database for the User
  const student = await Student.findById(id).lean().exec();

  if (!student) {
    return res.status(400).json({ message: "No student found" });
  }

  const result = await student.deleteOne();

  const reply = `Student ${result.studentname} with student ID number ${result.studentnum} deleted `;

  res.json(reply);
});

module.exports = { getAllStudents, postStudent, updateStudent, deleteStudent };
