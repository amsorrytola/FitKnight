import mongoose from "mongoose";
import {genSalt, hash} from "bcrypt"



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required."],
  },
  color:{
    type: String,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["Squire", "Knight"],
  },
  FitnessGoals: [
    {
      value: { type: String,},
      label: { type: String,},
    },
  ],
  Preferences: [
    {
      value: { type: String,},
      label: { type: String,},
    },
  ],
  availability: [
    {
      value: { type: String,},
      label: { type: String,},
    },
  ],
  
  location: {
    lat:{type: String},
    lng:{type:String}
  },
  activityType:[{
    value:{type: String},
    label:{type:String},
  }],
  schedule:[{
    value:{type: String},
    label:{type:String},
  }],
  address:{
    type: String,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

userSchema.pre("save",async function(next){
    const salt= await genSalt();
    this.password = await hash(this.password, salt);
    next();
});

const User = mongoose.model("Users",userSchema);

export default User;
