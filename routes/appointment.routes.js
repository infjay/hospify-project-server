const router = require("express").Router();

const { default: mongoose } = require('mongoose');
const Patient = require('../models/Patient.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const { response } = require("express");


//GET list of appointments

router.get('/appointments', (req,res,next) => {
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

router.post('/appointments', (req,res,next) => {

    const { date, doctor, patient, time } = req.body;
    console.log("date", req.body.date)
  

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


//UPDATE APPOINTMENT 

router.put("/appointments/:appointmentId", (req,res, next) => {
    const { appointmentId } = req.params;

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


router.delete("/appointments/:appointmentId", (req,res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    Appointment.findByIdAndRemove(appointmentId)
      .then( (response) => {
          console.log("appointmet deleted succesfully", response)
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