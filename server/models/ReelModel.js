const reelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }, // URL or path to the reel video
    uploadDate: { type: Date, default: Date.now },
    knight: { type: mongoose.Schema.Types.ObjectId, ref: "Knight", required: true }, // Reference to the Knight model
  });
  
  const Reel = mongoose.model("Reel", reelSchema);
  export default Reel;
  