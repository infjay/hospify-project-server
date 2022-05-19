const mongoose = require("mongoose")
const { Schema, model } = mongoose;


const appointmentSchema = new Schema(
    {
    date:{
            required:true,
            type: Date,
            },
    doctor: {
        type: Schema.Types.ObjectId, ref:'User'
        },
    patient:{
        type: Schema.Types.ObjectId, ref:'Patient'
        }}
)

const Appointment = model("Appointment", appointmentSchema);


module.exports = Appointment;