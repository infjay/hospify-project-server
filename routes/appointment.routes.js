const router = require("express").Router();

const { default: mongoose } = require('mongoose');
const Patient = require('../models/Patient.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');

//CREATE POST list

router.post

//GET list of appointments

router.get('/appointments', (req,res,next) => {
    Appointment.find()
    .then( (response) => {
        res.json(response)
    })
    .catch( e => {
        console.log('error on appointments get route', e);
        res.status(500).json({
            message: "error getting list of appointments",
            error: e
      })
    });
})


//appointments by  ID

router.get('/appointments/:appointmentId', (req,res,next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    Patient.findById(appointmentId)
      .then( appointment => res.status(200).json(appointment))
      .catch( err => {
        console.log("error getting list of projects", err);
        res.status(500).json({
            message: "error getting list of projects",
            error: err
        });
    })
})


 

//CREATE APPPOINTMENT routes


router.post('/:patientId/appointment/create', (req,res,next) => {
    
    const { _id } = req.payload;
    patientId = req.params
    date = req.body
    doctor = req.payload 

    Appointment.create()
})


//DELETE APPOINTMENT 


router.delete("/appointment/:appointmentId", (req,res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    
    Appointment.findByIdAndRemove(appointmentId)
      .then( () => {
          res.redirect("/appointments")
      })
      .catch( err => {
          console.log("error deleting appointment", err)
          res.status(500).json({
              message: "error getting list of appointments",
              error: err
          });
      });
});


module.exports = router;