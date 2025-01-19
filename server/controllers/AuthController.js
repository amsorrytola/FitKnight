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
    let channel = null;

    // Role-specific logic
    if (role === "Squire") {
      const squire = await Squire.create({
        user: user.id,
        FitnessGoals,
        Preferences,
        availability,
      });
      roleData = {
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
      };
    } else if (role === "Knight") {
      const knight = await Knight.create({ user: user.id });
      channel = await Channel.create({
        admin: knight.id,
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
      ...(role === "Squire" ? { squire: roleData } : (channel ? { channel } : {})),
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
      return res.status(400).json({ message: "Email and Password are required." });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password. Please try again." });
    }

    let roleData = null;
    let channel = null;

    // Handle role-specific data
    if (user.role === "Squire") {
      const squire = await Squire.findOne({ user: user.id });
      if (!squire) {
        return res.status(500).json({ message: "Squire data not found." });
      }
      roleData = {
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
      };
    } else if (user.role === "Knight") {
      const knight = await Knight.findOne({ user: user.id });
      if (!knight) {
        return res.status(500).json({ message: "Knight data not found." });
      }
      channel = await Channel.findOne({ admin: knight.id });
      roleData = {
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
      },
      ...(user.role === "Squire" ? { squire: roleData } : { knight: roleData }),
      ...(channel ? { channel } : {}),
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User with the given ID not found.");
    }

    // Base user information
    const userResponse = {
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      role: userData.role,
      age: userData.age,
      shortDescription: userData.shortDescription,
      gender: userData.gender,
    };

    let roleData = null;

    if (userData.role === "Squire") {
      const squireData = await Squire.findOne({ user: userData.id });
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
        };
      }
    } else if (userData.role === "Knight") {
      const knightData = await Knight.findOne({ user: userData.id });
      if (knightData) {
        roleData = {
          achievements: knightData.achievements,
          groups: knightData.groups,
          reels: knightData.reels,
        };
      }
    }

    return response.status(200).json({
      user: userResponse,
      ...(userData.role === "Squire" ? { squire: roleData } : { knight: roleData }),
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
    } = request.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return response.status(400).json({ message: "First and last name are required." });
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
    await user.save();

    let squireData = null;

    // Check if the user is a Squire and update their Squire data
    if (user.role === "Squire") {
      squireData = await Squire.findOne({ user: userId });

      if (!squireData) {
        return response.status(404).json({ message: "Squire profile not found." });
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
        shortDescription: user.shortDescription,
        profileSetup: user.profileSetup,
      },
      squire: squireData
        ? {
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
          }
        : null,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBuddyToSquire = async (req, res) => {
  try {
    const { squireId, buddyId } = req.body;

    // Validate the input
    if (!squireId || !buddyId) {
      return res.status(400).json({ message: "Squire ID and Buddy ID are required." });
    }

    // Check if the buddy exists
    const buddyExists = await User.findById(buddyId);
    if (!buddyExists) {
      return res.status(404).json({ message: "Buddy not found." });
    }

    // Find the squire
    const squire = await Squire.findById(squireId);
    if (!squire) {
      return res.status(404).json({ message: "Squire not found." });
    }

    // Check if the buddy is already in the list
    if (squire.buddies.includes(buddyId)) {
      return res.status(400).json({ message: "Buddy is already added." });
    }

    // Add the buddy to the list
    squire.buddies.push(buddyId);

    // Save the squire document
    await squire.save();

    return res.status(200).json({
      buddies: squire.buddies,
    });
  } catch (error) {
    console.error("Error adding buddy:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required.");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;

    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      image: updatedUser.image,
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

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successful");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
