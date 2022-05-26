const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

const userSchema = new Schema(
  {
    email: {
      type: String,
      required:true,
      unique:true
    },
    firstName:{
      type:String
    },
    lastName: {
      type:String
    },
    password: {
    type:String,
    required:true
  },
  specialty:{
    type: String,
    required:true
  }}

);

const User = model("User", userSchema);

module.exports = User;
