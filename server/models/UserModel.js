import mongoose from "mongoose";
import {genSalt, hash} from "bcrypt"



const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required."], unique: true },
  password: { type: String, required: function () { return !this.googleId; } },
  googleId: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  image: { type: String },
  profileSetup: { type: Boolean, default: false },
  role: { type: String, enum: ["Squire", "Knight"], required: true },
  age: { type: Number },
  gender: { type: String },
  shortDescription: { type: String },
  assignedCharacter: {
    type: String,
    
  },
  
});



userSchema.pre("save", async function(next) {
  if (this.password && this.isModified("password")) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("Users",userSchema);

export default User;
