const router = require("express").Router();
const { Student, validate } = require("../models/student");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    // Validate the incoming request data to ensure it meets expected criteria.
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if a student with the provided email already exists in the database.
    const student = await Student.findOne({ email: req.body.email });
    if (student) {
      return res.status(200).send({ message: "User exist" });
    }

    // Generate a salt for password hashing. The salt is a random value used to add complexity to the password hash.
    const salt = await bcrypt.genSalt(Number(process.env.SALT));

    // Hash the incoming password using bcrypt with the generated salt.
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Save the student data to the database, including the hashed password.
    await new Student({ ...req.body, password: hashPassword }).save();

    // await new Student({ ...req.body }).save();
    res.status(201).send({ message: "Student Created" });
  } catch (error) {
    // Handle any unexpected errors that may occur during this process.
    res.status(500).send({ message: "Server error" });
  }
});

router.route("/get").get((req, res) => {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.route("/update/:id").put((req, res) => {
  let id = req.params.id;
  const { studentName, studentId, email, gender } = req.body;

  const updateStudent = {
    studentName,
    studentId,
    email,
    gender,
  };

  const update = Student.findByIdAndUpdate(id, updateStudent)
    .then(() => {
      res.status(200).send({ status: "Student Updated", student: update });
    })
    .catch((error) => {
      res.status(500).send({ status: "error", error: error });
    });
});

router.route("/get/:id").get((req, res) => {
  const id = req.params.id;
  Student.findById(id)
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;
  Student.findByIdAndDelete(id)
    .then(() => {
      res.status(200).send({ status: "Student Deleted" });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
