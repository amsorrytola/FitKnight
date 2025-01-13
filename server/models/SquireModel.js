const squireSchema = new mongoose.Schema({
  User: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to BaseUser
  fitnessLevel: {
    type: String,
    enum: [
      "Sedentary",
      "Lightly Active",
      "Moderately Active",
      "Active",
      "Athletic",
      "Highly Active",
      "Professional Athlete",
      "Recovering",
      "Beginner",
      "Intermediate",
      "Advanced",
    ],
  },
  availableDays: [
    {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  ],
  achievements: [
    {
      title: { type: String },
      date: { type: Date },
      description: { type: String },
    },
  ],
  buddyType: {
    type: String,
    enum: [
      "Encourager",
      "Competitor",
      "Trainer",
      "Accountability Partner",
      "Learning Buddy",
      "Social Butterfly",
      "Early Riser",
      "Night Owl",
      "Solo Booster",
      "Explorer",
      "Flexible Partner",
    ],
  },
  FitnessGoals: [{ value: { type: String }, label: { type: String } }],
  Preferences: [{ value: { type: String }, label: { type: String } }],
  location: { lat: { type: String }, lng: { type: String } },
  address: { type: String },

  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channels" }],
});

const Squire = mongoose.model("Squire", squireSchema);
export default Squire;
