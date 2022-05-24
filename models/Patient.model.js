const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    birthDate: {
        type: String,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});


module.exports = model("Patient", patientSchema);