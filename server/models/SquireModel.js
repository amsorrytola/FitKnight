import mongoose from "mongoose";


const squireSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to BaseUser
  fitnessLevel: [{ value: { type: String }, label: { type: String } }],
  availableDays: [{ value: { type: String }, label: { type: String } }],
  buddyType: [{ value: { type: String }, label: { type: String } }],
  achievements: [
    {
      title: { type: String },
      date: { type: Date },
      description: { type: String },
    },
  ],


  availability: [{ value: { type: String }, label: { type: String } }],
  FitnessGoals: [{ value: { type: String }, label: { type: String } }],
  Preferences: [{ value: { type: String }, label: { type: String } }],
  location: { lat: { type: String }, lng: { type: String } },
  address: { type: String },

  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channels" }],
  buddies: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: false }],

});

const Squire = mongoose.model("Squire", squireSchema);
export default Squire;
