const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required:true,
      unique:true

      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: {
    type:String,
    requires:true
  },
  doctor:{
    default:false
  }
  },

);

const User = model("User", userSchema);

module.exports = User;
