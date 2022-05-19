const router = require("express").Router();

const { default: mongoose } = require('mongoose');
const Patient = require('../models/Patient.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const { response } = require("express");

//CREATE POST list

router.post('/appointments/create', (req,res,next) => {

    const { date, doctor, patient } = req.body;

    Appointment.create({date, doctor: "", patient: ""})
    .then(response => res.status(201).json(response))
    .catch( err => {
        console.log('error on create appointments route', err)
        res.status(500).json({
            message:'error on creating appointment',
            error: err
        })
    })
})

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

    Appointment.findById(appointmentId)
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


// router.post('/:patientId/appointment/create', (req,res,next) => {
    
//     const { _id } = req.payload;
//     patientId = req.params
//     date = req.body
//     doctor = req.payload 

//     Appointment.create()
// })

//UPDATE APPOINTMENT 

router.put("/appointments/:appointmentId", (req,res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    Appointment.findOneAndUpdate(appointmentId)
    .then( response => console.log(reponse))
    .catch( err => {
        console.log("error updating appointment route", err)
        res.status(500).json({
            message:"error updating appointment",
            error: err
        });
    });
});


//DELETE APPOINTMENT 


router.delete("/appointments/:appointmentId", (req,res, next) => {
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
              message: "error deleting appointments",
              error: err
          });
      });
});


module.exports = router;