const knightSchema = new mongoose.Schema({
    baseUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to BaseUser
    groups: { type: mongoose.Schema.Types.ObjectId, ref: "Channels" }, // Group created by the Knight
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }], // Reels uploaded by the Knight
  
    achievements: [
      {
        title: { type: String, required: true }, // Achievement title
        date: { type: Date }, // Date of achievement
        description: { type: String }, // Additional details about the achievement
      },
    ],
    qualifications: [
      {
        title: { type: String, required: true }, // Qualification title
        issuedBy: { type: String }, // Organization or body issuing the qualification
        certificationDate: { type: Date }, // Date of certification
      },
    ],
  });
  
  const Knight = mongoose.model("Knight", knightSchema);
  export default Knight;
  