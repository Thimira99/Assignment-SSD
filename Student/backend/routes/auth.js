const router = require("express").Router();
const { Student } = require("../models/student");
const joi = require("joi");

router.post("/post", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const student = await Student.findOne({ email: req.body.email });
    if (!student) {
      return res.status(200).send({ message: "Invalid Email" });
    }

    res.status(200).send({ student, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;