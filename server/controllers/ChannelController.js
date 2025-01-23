import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import Squire from "../models/SquireModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, admin } = req.body;

    if (!admin) {
      return res.status(400).json({ message: "Admin user ID is required." });
    }

    

    const newChannel = new Channel({
      name,
      image: "",
      admin: admin,
    });

    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).send("Internal Server Error");
  }
};


export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return response.status(201).json({ channels });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getChannelMessages = async (request, response, next) => {
  try {
    const { channelId } = request.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return response.status(404).send("Channel not found.");
    }
    const messages = channel.messages;
    return response.status(201).json({ messages });
  } catch (error) {
    console.log("LO ERROR!! ",error);
    return response.status(500).send("Internal Server Error");
  }
};

export const addMemberToChannel = async (req, res) => {
  try {
    const { channelId, memberId } = req.body;

    // Find the channel by ID
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel not found.");
    }
    const squire = await Squire.findOne({user:memberId});

    // Add memberId to the members array if not already present
    if (!channel.members.includes(memberId)) {
      channel.members.push(memberId);
      squire.groups.push(channelId);
    } else {
      return res.status(400).json({ message: "Member already exists in the channel." });
    }

    // Save the updated channel
    await channel.save();
    await squire.save();

    return res.status(201).json({channel: channel });
  } catch (error) {
    console.error("ERROR", error);
    return res.status(500).send("Internal Server Error");
  }
};

