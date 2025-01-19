import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: false }],
  admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  messages: [
    { type: mongoose.Schema.ObjectId, ref: "Message", required: false },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  description: { type: String, required: false },
  activityType: [{ value: { type: String }, label: { type: String } }],
  schedule: [{ value: { type: String }, label: { type: String } }],
  approvalRequired: { type: Boolean, default: false }, // If true, Knight needs to approve join requests
  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Squire who requested to join
      requestedAt: { type: Date, default: Date.now },
      message: { type: String }, // Optional message from the Squire
    },
  ], // List of pending join requests
  feedback: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Squire giving feedback
      rating: { type: Number, min: 1, max: 5 }, // Rating for the channel
      comments: { type: String }, // Additional comments
      createdAt: { type: Date, default: Date.now },
    },
  ],

  location: { lat: { type: String }, lng: { type: String } },
  address: { type: String },

});

channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channels", channelSchema);
export default Channel;
