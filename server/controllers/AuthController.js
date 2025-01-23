import User from "../models/UserModel.js";
import Squire from "../models/SquireModel.js";
import Knight from "../models/KnightModel.js";
import Channel from "../models/ChannelModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res) => {
  const {
    email,
    password,
    role,
    FitnessGoals,
    Preferences,
    activityType,
    availability,
    schedule,
    location,
    address,
  } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, Password, and Role are required." });
  }

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Create the user
    const user = await User.create({ email, password, role });

    let roleData = null;
    let channels = null;
    let knight = null;

    // Role-specific logic
    if (role === "Squire") {
      const squire = await Squire.create({
        user: user.id,
        FitnessGoals,
        Preferences,
        availability,
      });
      roleData = {
        squireId: squire._id,
        FitnessGoals: squire.FitnessGoals.map(({ value, label }) => ({
          value,
          label,
        })),
        Preferences: squire.Preferences.map(({ value, label }) => ({
          value,
          label,
        })),
        availability: squire.availability.map(({ value, label }) => ({
          value,
          label,
        })),
        buddies: squire.buddies,
        groups: squire.groups,
      };
    } else if (role === "Knight") {
      knight = await Knight.create({ user: user.id });
      channels = await Channel.create({
        admin: user.id,
        name: "Fitness Group",
        image: "",
        activityType,
        schedule,
        location,
        address,
      });
    }

    // Create and set JWT
    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
      httpOnly: true, // More secure by preventing access to the cookie via JavaScript
    });

    // Respond with user and role-specific info
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        role: user.role,
      },
      ...(role === "Squire"
        ? { squire: roleData }
        : { knight: knight, channels:  channels  }),
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password. Please try again." });
    }

    let roleData = null;
    let channels = null;

    // Handle role-specific data
    if (user.role === "Squire") {
      const squire = await Squire.findOne({ user: user.id });
      if (!squire) {
        return res.status(500).json({ message: "Squire data not found." });
      }
      roleData = {
        squireId: squire._id,
        fitnessLevel: squire.fitnessLevel.map(({ value, label }) => ({
          value,
          label,
        })),
        availableDays: squire.availableDays.map(({ value, label }) => ({
          value,
          label,
        })),
        buddyType: squire.buddyType.map(({ value, label }) => ({
          value,
          label,
        })),
        FitnessGoals: squire.FitnessGoals.map(({ value, label }) => ({
          value,
          label,
        })),
        Preferences: squire.Preferences.map(({ value, label }) => ({
          value,
          label,
        })),
        location: squire.location,
        address: squire.address,
        achievements: squire.achievements,
        buddies: squire.buddies,
        groups: squire.groups,
      };
    } else if (user.role === "Knight") {
      const knight = await Knight.findOne({ user: user.id });
      if (!knight) {
        return res.status(500).json({ message: "Knight data not found." });
      }
      channels = await Channel.find({ admin: user._id });
      roleData = {
        knightId: knight._id,
        achievements: knight.achievements,
        qualifications: knight.qualifications,
        groups: knight.groups,
      };
    }

    // Create and set JWT
    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    // Respond with user and role-specific info
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
        role: user.role,
        age: user.age,
        shortDescription: user.shortDescription,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        privacySettings: user.privacySettings,
      },
      ...(user.role === "Squire"
        ? { squire: roleData }
        : { knight: roleData, channels:  channels  }),
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    let userData = null;

    // Check request query instead of request body for GET request
    const { memberId } = request.query;

    if (memberId) {
      console.log("Member ID from query:", memberId);
      userData = await User.findById(memberId);
    } else {
      userData = await User.findById(request.userId);
    }

    if (!userData) {
      return response.status(404).send("User with the given ID not found.");
    }

    // Base user information
    const userResponse = {
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      role: userData.role,
      age: userData.age,
      shortDescription: userData.shortDescription,
      gender: userData.gender,
      phoneNumber: userData.phoneNumber,
      privacySettings: userData.privacySettings,
    };

    let roleData = null;
    let channels = null;

    if (userData.role === "Squire") {
      const squireData = await Squire.findOne({ user: userData._id });
      if (squireData) {
        roleData = {
          squireId: squireData.id,
          fitnessLevel: squireData.fitnessLevel.map(({ value, label }) => ({
            value,
            label,
          })),
          availableDays: squireData.availableDays.map(({ value, label }) => ({
            value,
            label,
          })),
          buddyType: squireData.buddyType.map(({ value, label }) => ({
            value,
            label,
          })),
          FitnessGoals: squireData.FitnessGoals.map(({ value, label }) => ({
            value,
            label,
          })),
          Preferences: squireData.Preferences.map(({ value, label }) => ({
            value,
            label,
          })),
          availability: squireData.availability.map(({ value, label }) => ({
            value,
            label,
          })),
          location: squireData.location,
          address: squireData.address,
          achievements: squireData.achievements,
          buddies: squireData.buddies,
          groups: squireData.groups,
        };
      }
    } else if (userData.role === "Knight") {
      const knightData = await Knight.findOne({ user: userData.id });
      channels = await Channel.find({ admin: userData._id });
      if (knightData) {
        roleData = {
          knightId: knightData._id,
          achievements: knightData.achievements,
          qualifications: knightData.qualifications,
          groups: knightData.groups,
          reels: knightData.reels,
        };
      }
    }

    return response.status(200).json({
      user: userResponse,
      ...(userData.role === "Squire"
        ? { squire: roleData }
        : { knight: roleData, channels:  channels  }),
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response) => {
  try {
    const { userId } = request; // User ID from token middleware
    const {
      firstName,
      lastName,
      selectedAge,
      gender,
      shortDescription,
      fitnessLevel,
      selectedDays,
      selectedBuddyTypes,
      FitnessGoals,
      Preferences,
      availability,
      location,
      address,
      achievements,
      qualifications,
      phoneNumber,
      privacySettings,
    } = request.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return response
        .status(400)
        .json({ message: "First and last name are required." });
    }

    // Update User Data
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.age = selectedAge;
    user.gender = gender;
    user.shortDescription = shortDescription;
    user.profileSetup = true; // Mark profile as set up
    user.privacySettings = privacySettings;
    user.phoneNumber = phoneNumber;

    await user.save();

    let squireData = null;
    let knightData = null;

    // Check if the user is a Squire and update their Squire data
    if (user.role === "Squire") {
      squireData = await Squire.findOne({ user: userId });

      if (!squireData) {
        return response
          .status(404)
          .json({ message: "Squire profile not found." });
      }

      squireData.fitnessLevel = fitnessLevel;
      squireData.availableDays = selectedDays;
      squireData.buddyType = selectedBuddyTypes;
      squireData.FitnessGoals = FitnessGoals;
      squireData.Preferences = Preferences;
      squireData.location = location;
      squireData.address = address;
      squireData.availability = availability;
      squireData.achievements = achievements;

      await squireData.save();
    } else if (user.role === "Knight") {
      knightData = await Knight.findOne({ user: userId });

      if (!knightData) {
        return response
          .status(404)
          .json({ message: "Knight profile not found." });
      }

      knightData.achievements = achievements;
      knightData.qualifications = qualifications;

      await knightData.save();
    }
    // Response
    return response.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        age: user.age,
        role: user.role,
        shortDescription: user.shortDescription,
        profileSetup: user.profileSetup,
        phoneNumber: user.phoneNumber,
        privacySettings: user.privacySettings,
        image: user.image,
      },
      squire: squireData
        ? {
            squireId: squireData._id,
            fitnessLevel: squireData.fitnessLevel?.map(({ value, label }) => ({
              value,
              label,
            })),
            availableDays: squireData.availableDays?.map(
              ({ value, label }) => ({
                value,
                label,
              })
            ),
            buddyType: squireData.buddyType?.map(({ value, label }) => ({
              value,
              label,
            })),
            FitnessGoals: squireData.FitnessGoals?.map(({ value, label }) => ({
              value,
              label,
            })),
            Preferences: squireData.Preferences?.map(({ value, label }) => ({
              value,
              label,
            })),
            availability: squireData.availability?.map(({ value, label }) => ({
              value,
              label,
            })),

            location: squireData.location,
            address: squireData.address,
            achievements: squireData.achievements,
            buddies: squireData.buddies,
            groups: squireData.groups,
          }
        : null,
      knight: knightData
        ? {
            knightId: knightData._id,
            achievements: knightData.achievements,
            qualifications: knightData.qualifications,
            groups: knightData.groups,
          }
        : null,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGroupInfo = async (req, res) => {
  try {
    const { group } = req.body;

    if (!group || !group._id) {
      return res.status(400).json({ message: "Invalid group data provided." });
    }

    const channel = await Channel.findById(group._id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Update the channel properties
    channel.activityType = group.activityType;
    channel.address = group.address;
    channel.description = group.description;
    channel.image = group.image;
    channel.name = group.name;
    channel.schedule = group.schedule;

    // Save updated channel to the database
    await channel.save();

    return res.status(200).json({ message: "Group updated successfully." });
  } catch (error) {
    console.error("ERROR", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBuddyToSquire = async (req, res) => {
  try {
    const { squireId, buddyId } = req.body;

    // Ensure both IDs are provided
    if (!squireId || !buddyId) {
      return res.status(400).json({ message: "Squire ID and Buddy ID are required." });
    }

    // Check if buddy exists
    const buddyExists = await User.findById(buddyId);
    if (!buddyExists) {
      return res.status(404).json({ message: "Buddy not found." });
    }

    // Find the squire and update
    const squire = await Squire.findById(squireId);
    if (!squire) {
      return res.status(404).json({ message: "Squire not found." });
    }

    if (squire.buddies.includes(buddyId)) {
      return res.status(400).json({ message: "Buddy is already added." });
    }

    squire.buddies.push(buddyId);
    await squire.save();

    return res.status(200).json({
      message: "Buddy added successfully.",
      buddies: squire.buddies,
    });

  } catch (error) {
    console.error("Error adding buddy:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const addGroupProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const { channelId } = req.body;
    if (!channelId) {
      return res.status(400).send("Channel ID is required.");
    }

    // Construct the new filename and move the file
    const date = Date.now();
    let fileName = `uploads/profiles/${date}-${req.file.originalname}`;

    renameSync(req.file.path, fileName);

    // Save the image path to the database
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    if (!updatedChannel) {
      return res.status(404).send("Channel not found.");
    }

    res.status(200).json({
      image: updatedChannel.image,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Internal Server Error");
  }}


export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required.");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;

    renameSync(request.file.path, fileName);

    const updatedChannel = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      image: updatedChannel.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const removeGroupProfileImage = async (request, response, next) => {
  try {
    const { channelId } = request.body;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      unlinkSync(channel.image);
    }

    channel.image = null;
    await channel.save();

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successful");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
