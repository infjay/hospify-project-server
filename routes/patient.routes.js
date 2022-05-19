const router =  require('express').Router();

const Patient = require('../models/Patient.model');
const Appointment = require('../models/Appointment.model');
const User = require('../models/User.model');
const {isAuthenticated} = require('../middleware/jwt.middleware')
// Create a new Patient
router.post('/patients', (req, res, next) => {
    const { firstName, lastName, email, birthDate, bloodType, description,userId } = req.body;

    const newPatient = {
        firstName,
        lastName,
        email,
        birthDate,
        bloodType,
        description,
        doctor: userId
    }

    Patient.Create(newPatient)
        .then((patientsFromDB) => {
         User.findByIdAndUpdate(userId, {$push: { patients: patientsFromDB._id }});
         res.status(201).json(response)
        })

        .catch(err => res.json(err));
})


// get the list of patients


router.get('/patients', isAuthenticated,  (req, res, next) => {

    const {id} = req.payload._id
   

    Patient.find()
        // .populate("appointments")
        .then(response => {
            console.log(response);
            res.json(response)
        })
        .catch(err => {
            console.log("error getting the list of patients");
            res.status(500).json({
                message: "error getting the list of patients",
                error: err
                });
        })
})

// get the list of specific patient by id



router.get('/patient/:patientId', (req, res, next) => {
    const {patientId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(patientId)){
        res.status(400).json({ message: "Specified id is not Valid"});
        return;
    }
Patient.findById(patientId)
    .then(patient => res.json(patient))
    .catch(err => {
        console.log("error getting details of a patient", err);
        res.status(500).json({
            message: 'error getting details of a patient',
            error: err
        });
    })

})



// Update a details of a patient
router.put('/patient/:patientId', (req, res, next )=> {
    const {patientId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        res.status(400).json({ message: "Specified id is not Valid"});
        return;
    }

    Patient.findByIdAndUpdate(patientId, req.body, {new: true})
    .then((updatedPatient)=> res.json(updatedPatient))
    .catch(err => {
        console.log("error updating patient", err);
        res.status(500).json({
            message: 'error updating patient',
            error: err
        });
    })

});



module.exports = router;