import React, { useState } from "react";

const AchievementsComponent = ({ onAchievementsChange }) => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    date: "",
    description: "",
  });

  // Handle input changes for new achievements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({ ...newAchievement, [name]: value });
  };

  // Add a new achievement to the list
  const handleAddAchievement = () => {
    if (
      newAchievement.title &&
      newAchievement.date &&
      newAchievement.description
    ) {
      const updatedAchievements = [...achievements, newAchievement];
      setAchievements(updatedAchievements);
      setNewAchievement({ title: "", date: "", description: "" });

      // Notify parent component if handler is provided
      if (typeof onAchievementsChange === "function") {
        onAchievementsChange(updatedAchievements);
      }
    } else {
      alert("Please fill out all fields before adding an achievement.");
    }
  };

  // Remove an achievement by index
  const handleRemoveAchievement = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);

    // Notify parent component if handler is provided
    if (typeof onAchievementsChange === "function") {
      onAchievementsChange(updatedAchievements);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h2>

      {/* Input Fields for Adding New Achievement */}
      <div className="flex flex-col space-y-4 mb-4">
        <input
          type="text"
          name="title"
          value={newAchievement.title}
          onChange={handleInputChange}
          placeholder="Achievement Title"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <input
          type="date"
          name="date"
          value={newAchievement.date}
          onChange={handleInputChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <textarea
          name="description"
          value={newAchievement.description}
          onChange={handleInputChange}
          placeholder="Achievement Description"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        ></textarea>
        <button
          onClick={handleAddAchievement}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
        >
          Add Achievement
        </button>
      </div>

      {/* Display List of Achievements */}
      <div className="space-y-4">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {achievement.description}
                </p>
              </div>
              <button
                onClick={() => handleRemoveAchievement(index)}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No achievements added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AchievementsComponent;
