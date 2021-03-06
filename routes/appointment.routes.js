const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const { default: mongoose } = require('mongoose');
const Appointment = require('../models/Appointment.model');



//GET list of appointments

router.get('/appointments',isAuthenticated, (req,res,next) => {
    Appointment.find()
    .populate("patient")
    .populate("doctor")
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


//CREATE POST appointment

router.post('/appointments', isAuthenticated,  (req,res,next) => {

    const { date, doctor, patient, time } = req.body;

    Appointment.create({date, doctor, patient, time})
    .then(response => res.status(201).json(response))
    .catch( err => {
        console.log('error on create appointments route', err)
        res.status(500).json({
            message:'error on creating appointment',
            error: err
        })
    })
})


//appointments by  ID

router.get('/appointments/:appointmentId', isAuthenticated, (req,res,next) => {
    const { appointmentId } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    Appointment.findById(appointmentId)
      .populate('doctor')
      .populate('patient')
      .then( appointment => res.status(200).json(appointment))
      .catch( err => {
        console.log("error getting list of projects", err);
        res.status(500).json({
            message: "error getting list of projects",
            error: err
        });
    })
})


//UPDATE APPOINTMENT 

router.put("/appointments/:appointmentId", isAuthenticated,(req,res, next) => {
    const { appointmentId } = req.params;
    const { date, doctor, patient, time } = req.body;

    Appointment.findByIdAndUpdate(appointmentId , req.body, {new:true} )
    .then( updateAppointment => res.status(200).json(updateAppointment))
    .catch( err => {
        console.log("error updating appointment route", err)
        res.status(500).json({
            message:"error updating appointment",
            error: err
        });
    });
});


//DELETE APPOINTMENT 


router.delete("/appointments/:appointmentId", isAuthenticated, (req,res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    Appointment.findByIdAndDelete(appointmentId)
      .then( (response) => {
          res.json({ message: "appointmet deleted succesfully"})
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