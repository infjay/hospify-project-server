const router = require("express").Router();
const { default: mongoose } = require("mongoose");

const Patient = require("../models/Patient.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// get the list of patients

router.get("/patients", isAuthenticated, (req, res, next) => {

  Patient.find()
    .then((response) => {
        console.log('hello there ' , response)
      res.json(response)
    })
    .catch((err) => {
      console.log("error getting the list of patients");
      res.status(500).json({
        message: "error getting the list of patients",
        error: err,
      });
    });
});

// Create a new Patient

router.post("/patients", isAuthenticated, (req, res, next) => {
  const { firstName, lastName, email, birthDate, bloodType, description } =
    req.body;
  console.log("hello");
  const doctor = req.payload._id;
  console.log(doctor);
  const newPatient = {
    firstName,
    lastName,
    email,
    birthDate,
    bloodType,
    description,
    doctor,
  };
  console.log(newPatient);
  Patient.create(newPatient)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("error on create patient route", err);
      res.status(500).json({
        message: "error on creating patient",
        error: err,
      });
    });

});

// get the list of specific patient by id

router.get("/patients/:patientId", (req, res, next) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    res.status(400).json({ message: "Specified id is not Valid" });
    return;
  }
  Patient.findById(patientId)
    .then((patient) => res.json(patient))
    .catch((err) => {
      console.log("error getting details of a patient", err);
      res.status(500).json({
        message: "error getting details of a patient",
        error: err,
      });
    });
});

// Update a details of a patient
router.put("/patients/:patientId", (req, res, next) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    res.status(400).json({ message: "Specified id is not Valid" });
    return;
  }

  Patient.findByIdAndUpdate(patientId, req.body, { new: true })
    .then((updatedPatient) => res.json(updatedPatient))
    .catch((err) => {
      console.log("error updating patient", err);
      res.status(500).json({
        message: "error updating patient",
        error: err,
      });
    });
});

module.exports = router;
