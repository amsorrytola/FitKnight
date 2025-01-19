import User from "../models/UserModel.js";
import Squire from "../models/SquireModel.js";
import { getDistance } from "../utils/locationUtils.js";

export const getRecommendedBuddies = async (req, res) => {
    try {
      const { userId } = req; // Assume userId is attached via authentication middleware
      const { page = 1, limit = 10 } = req.query; // Pagination params
  
      // Fetch the current user and their details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Fetch the user's Squire data
      const squireData = await Squire.findOne({ user: userId });
  
      // Define weights for commonality fields
      const fieldWeights = {
        fitnessLevel: 4,
        buddyType: 3,
        FitnessGoals: 3,
        Preferences: 3,
        availableDays: 2,
        availability: 2,
        location: 5,
        gender: 1, // Optional match
      };
  
      // Fetch all users, except the requesting user
      const allUsers = await Squire.find({ user: { $ne: userId } }).populate("user");
  
      // Compute recommendations with similarity scoring
      const recommendations = allUsers
        .map((buddy) => {
          let score = 0;
  
          // Compare fitness level
          if (
            squireData.fitnessLevel.some((item) =>
              buddy.fitnessLevel.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.fitnessLevel;
          }
  
          // Compare buddy type
          if (
            squireData.buddyType.some((item) =>
              buddy.buddyType.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.buddyType;
          }
  
          // Compare fitness goals
          if (
            squireData.FitnessGoals.some((item) =>
              buddy.FitnessGoals.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.FitnessGoals;
          }
  
          // Compare workout preferences
          if (
            squireData.Preferences.some((item) =>
              buddy.Preferences.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.Preferences;
          }
  
          // Compare available days
          if (
            squireData.availableDays.some((item) =>
              buddy.availableDays.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.availableDays;
          }
  
          // Compare availability
          if (
            squireData.availability.some((item) =>
              buddy.availability.find((bItem) => bItem.value === item.value)
            )
          ) {
            score += fieldWeights.availability;
          }
  
          // Compare gender (optional)
          if (user.gender === buddy.user.gender) {
            score += fieldWeights.gender;
          }
  
          // Compare location proximity (use a utility to calculate distance)
          const distance = getDistance(
            squireData.location.lat,
            squireData.location.lng,
            buddy.location.lat,
            buddy.location.lng
          );
          if (distance <= 20) {
            score += fieldWeights.location; // Boost score for nearby users
          }
  
          return { ...buddy.toObject(), score, distance };
        })
        .sort((a, b) => b.score - a.score); // Sort by score descending
  
      // Paginate the results
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedResults = recommendations.slice(startIndex, endIndex);
  
      res.status(200).json(paginatedResults);
    } catch (error) {
      console.error("Error fetching buddies:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };