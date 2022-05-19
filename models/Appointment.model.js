const mongoose = require("mongoose")
const { Schema, model } = mongoose;


const appointmentSchema = new Schema(
    {
    apointment: {
        date:{
            required:true,
            format: Date,
            },
    doctor: {
        type: Schema.Types.ObjectId, ref:'User'
        },
    Patient:{
        type: Schema.Types.ObjectId, ref:'Patient'
        }}}
)

const Appointment = model("Appointment", appointmentSchema);


module.exports = Appointment;