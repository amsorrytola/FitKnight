import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response, next) => {
  try {
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
    } = request.body;
    if (!email || !password || !role) {
      return response.status(400).send("Email, Password and Role required");
    }

    let user;
    if (role === "Squire") {
      user = await User.create({
        email,
        password,
        role,
        FitnessGoals,
        Preferences,
        availability,
      });
    }
    if (role === "Knight") {
      user = await User.create({
        email,
        password,
        role,
        activityType,
        schedule,
        location,
        address,
      });
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        role: user.role,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password");
    }
    const user = await User.findOne({ email });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
        role: user.role,
        fitnessGoals: user.fitnessGoals,
        workoutPreferences: user.workoutPreferences,
        availability: user.availability,
        location: user.location,
        groups: user.groups,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if(!userData){
      return response.status(404).send("User with the given id not found");
    }
    return response.status(200).json({
      
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        color: userData.color,
        image: userData.image,
        role: userData.role,
        FitnessGoals: userData.FitnessGoals,
        Preferences: userData.Preferences,
        availability: userData.availability,
        location: userData.location,
        address: userData.address,
        groups: userData.groups,
      
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const {userId} = request;
    const {firstName, lastName, color} = request.body;

    if(!firstName || !lastName) {
      return response.status(400).send("First lastname and color is required.");
    }

    const userData = await User.findByIdAndUpdate(userId,{
      firstName,
      lastName,
      color,
      profileSetup: true,
    }, {new:true, runValidators: true});

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color
    })
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
}

export const addProfileImage = async (request, response, next) => {
  try {
    if(!request.file){
      return response.status(400).send("File is required.");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;

    renameSync(request.file.path, fileName);


    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      {image : fileName},
      {new: true, runValidators: true}
    );
    return response.status(200).json({
      image: updatedUser.image,
    })
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
}

export const removeProfileImage = async (request, response, next) => {
  try {
    const {userId} = request;
    const user = await User.findById(userId);

    if (!user){
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return response.status(200).send("Profile image removed successfully");
    
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
}