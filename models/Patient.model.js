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
        type: Date,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    
    doctor : { type: Schema.Types.ObjectId, ref: 'User' },
    

    
});


module.exports = model("Patinet", patientSchema);