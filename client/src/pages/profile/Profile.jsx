import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/store";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { getColor } from "../../lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { colors } from "../../lib/utils";
import { Button } from "../../components/ui/button";

import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utils/constants";
import { useRef } from "react";
import { predefinedOptions } from "../../utils/constants/predefinedOptions";
import { toast } from "sonner";
import Logo from "../../assets/Gotham_Knights_Logo.svg.png";
import hide from "../../assets/hide.png";
import eye from "../../assets/eye.png";
import CreatableSelect from "react-select/creatable";
import LocationPicker from "../../components/ui/LocationPicker.jsx";

import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

function Profile() {
  const navigate = useNavigate();
  const {
    userInfo,
    setUserInfo,
    squireInfo,
    knightInfo,
    setSquireInfo,
    setKnightInfo,
  } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setimage] = useState("");
  const [hovered, sethovered] = useState("");
  const [color, setcolor] = useState(0);
  const fileInputRef = useRef(null);
  const [fitnessLevel, setFitnessLevel] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedBuddyTypes, setSelectedBuddyTypes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [qualifications,setQualifications] = useState([]);
  const [newQualifications, setNewQualifications] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [selectedAge, setSelectedAge] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [FitnessGoals, setFitnessGoals] = useState([]);
  const [Preferences, setPreferences] = useState([]);
  const [availability, setavailability] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQDialogOpen, setIsQDialogOpen] = useState(false);
  const [group, setgroup] = useState(null);
  const [reels, setreels] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEmailPrivate, setIsEmailPrivate] = useState(true);
  const [isPhoneNumberPrivate, setIsPhoneNumberPrivate] = useState(true);

  useEffect(() => {
    console.log("USEEFFECTWALA", userInfo);
    console.log("USEEFFECTWALA SQUIRE", squireInfo);
    console.log("USEEFFECT WALA KNIGHT", knightInfo);
    if (squireInfo?.FitnessGoals) {
      setFitnessGoals(squireInfo.FitnessGoals);
    }
    if (squireInfo?.Preferences) {
      setPreferences(squireInfo.Preferences);
    }
    if (squireInfo?.availability) {
      setavailability(squireInfo.availability);
    }
    if (userInfo?.image) {
      setimage(userInfo.image ? `${HOST}/${userInfo.image}` : "");
    }

    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName);
      setlastName(userInfo.lastName);
      setcolor(userInfo.color);
      
      setimage(userInfo.image ? `${HOST}/${userInfo.image}` : "");
      setSelectedAge(userInfo.age);
      setGender(userInfo.gender);
      setShortDescription(userInfo.shortDescription);
      setPhoneNumber(userInfo.phoneNumber);
      setIsEmailPrivate(userInfo.privacySettings.emailVisible);
      setIsPhoneNumberPrivate(userInfo.privacySettings.phoneVisible);

      if (userInfo.role === "Squire" && squireInfo) {
        setFitnessLevel(squireInfo.fitnessLevel);
        setSelectedDays(squireInfo.availableDays);
        setSelectedBuddyTypes(squireInfo.buddyType);
        setFitnessGoals(squireInfo.FitnessGoals);
        setPreferences(squireInfo.Preferences);
        setavailability(squireInfo.availability);
        setLocation(squireInfo.location);
        setAddress(squireInfo.address);
        setAchievements(squireInfo.achievements);
      } else if (userInfo.role === "Knight" && knightInfo) {
        setAchievements(knightInfo.achievements);
        setQualifications(knightInfo.qualifications);
        setgroup(knightInfo.groups);
        setreels(knightInfo.reels);
      }
    }
  }, [userInfo, squireInfo, knightInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const getMimeType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "avif":
        return "image/avif";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream"; // Fallback for unknown types
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const privacySettings = {
          emailVisible: isEmailPrivate,
          phoneVisible: isPhoneNumberPrivate,
        };

        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
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
            phoneNumber,
            privacySettings,
            qualifications,
          },
          { withCredentials: true }
        );
        console.log("USER DATA AFETR SAVE", response.data.user);
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data.user });
          if (userInfo.role === "Squire") {
            console.log("LOO", response.data.squire);
            setSquireInfo({ ...response.data.squire });
          } else if (userInfo.role === "Knight") {
            setKnightInfo({ ...response.data.knight });
          }
          toast.success("Profile updated successfully.");
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/dashboard");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      console.log("formdata",formData);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setimage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onAchievementsChange = (updatedAchievements) => {
    setAchievements(updatedAchievements);
    console.log("Achievements updated:", updatedAchievements);
    console.log(achievements);
  };

  const onQualificationsChange = (updatedQualifications) => {
    setQualifications(updatedQualifications);
    console.log("Qualification updated:", updatedQualifications);
    console.log(qualifications);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({ ...newAchievement, [name]: value });
  };

  const handleQualificationInputChange = (e) => {
    const { name, value } = e.target;
    setNewQualifications({ ...newQualifications, [name]: value });
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

  const handleAddQualification = () => {
    if (
      newQualifications.title &&
      newQualifications.date &&
      newQualifications.description
    ) {
      const updatedQualifications = [...qualifications, newQualifications];
      setQualifications(updatedQualifications);
      setNewAchievement({ title: "", date: "", description: "" });

      // Notify parent component if handler is provided
      if (typeof onQualificationsChange === "function") {
        onQualificationsChange(updatedQualifications);
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

  const handleRemoveQualification = (index) => {
    const updatedQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(updatedQualifications);

    // Notify parent component if handler is provided
    if (typeof onQualificationsChange === "function") {
      onQualificationsChange(updatedQualifications);
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    console.log("Selected Location:", newLocation);
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    console.log("Selected Address:", newAddress);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "15px", // Fully rounded corners
      padding: "6px", // Adds padding for better spacing
      border: "1px solid #ccc", // Default border color
      boxShadow: "none", // Removes default focus shadow
      backgroundColor: "#2c2e3b",
      "&:hover": {
        borderColor: "#888", // Changes border color on hover
      },
      "&:focus": {
        outline: "none",
        ring: "4px",
        ringColor: "purple-500",
        borderColor: "transparent",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "white", // White text for placeholder
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: "9999px", // Rounded tags for selected items
      backgroundColor: "#e2e8f0", // Light gray background for tags
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#333", // Text color for tags
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: "9999px", // Rounded remove button
      "&:hover": {
        backgroundColor: "#f87171", // Red background on hover
        color: "white",
      },
    }),
  };

  return (
    <div className="bg-[#1b1c24] w-[100%] h-screen flex items-center justify-center ">
      <div className="w-[100%] lg:w-[50%] md:w-[70%]  h-[88%] rounded-3xl border-white border-2 bg-[#1b1c24] p-3">
        <div className="pb-6 flex justify-between" onClick={handleNavigate}>
          <IoArrowBack className="mt-3 ml-2 text-2xl lg:text-4xl text-white cursor-pointer" />
          <img src={Logo} alt="logo" className="h-[100px]" />
        </div>
        <div className="flex flex-col lg:flex lg:flex-row space-x-20 ">
          <div>
            <div
              className="h-full w-64 md:w-96 md:h-96 relative flex flex-col items-center justify-center  ml-20 "
              onMouseEnter={() => sethovered(true)}
              onMouseLeave={() => sethovered(false)}
            >
              <Avatar className="h-64 w-64 md:w-96 md:h-96 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-64 w-64 md:w-96 md:h-96 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      color
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-100 rounded-full"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                name="profile-image"
                accept=".png, .jpg, .jpeg, .svg, .webg"
              />
            </div>
            <textarea
              name="description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short Description"
              className="w-[84%] border border-gray-300 text-white  focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-lg p-2 bg-[#2c2e3b] ml-20 mt-5 min-h-10 max-h-20 "
            ></textarea>
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white item-center justify-center">
            <div className="w-full flex space-x-3">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
              {isEmailPrivate ? (
                <img
                  src={hide}
                  alt=""
                  className="absolute top-[215px] right-[39%] h-[25px] w-[25px] hover:outline-none hover:ring-2 hover:ring-purple-500 hover:border-transparent rounded-full"
                  onClick={() => {
                    setIsEmailPrivate((prev) => !prev);
                    toast.message("Other Users can see your Email Now");
                  }}
                />
              ) : (
                <img
                  src={eye}
                  alt=""
                  className="absolute top-[215px] right-[39%] h-[25px] w-[25px] hover:outline-none hover:ring-2 hover:ring-purple-500 hover:border-transparent rounded-full"
                  onClick={() => {
                    setIsEmailPrivate((prev) => !prev);
                    toast.message("Other Users can't see your Email Now");
                  }}
                />
              )}
              <Input
                placeholder="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    // Allow only digits (0-9)
                    setPhoneNumber(input);
                  } else {
                    toast.error("Input must be a number");
                  }
                }}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
              {isPhoneNumberPrivate ? (
                <img
                  src={hide}
                  alt=""
                  className="absolute top-[215px] right-[26%] h-[25px] w-[25px] hover:outline-none hover:ring-2 hover:ring-purple-500 hover:border-transparent rounded-full"
                  onClick={() => {
                    setIsPhoneNumberPrivate((prev) => !prev);
                    toast.message("Other Users can see your Phone Number Now");
                  }}
                />
              ) : (
                <img
                  src={eye}
                  alt=""
                  className="absolute top-[215px] right-[26%] h-[25px] w-[25px] hover:outline-none hover:ring-2 hover:ring-purple-500 hover:border-transparent rounded-full"
                  onClick={() => {
                    setIsPhoneNumberPrivate((prev) => !prev);
                    toast.message(
                      "Other Users can't see your Phone Number Now"
                    );
                  }}
                />
              )}
            </div>
            <div className="w-full flex space-x-4">
              <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                className="w-full border border-gray-300 text-white  focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-lg p-2 bg-[#2c2e3b] "
              />
              <input
                placeholder="Second Name"
                type="text"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="w-full border border-gray-300 text-white  focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-lg p-2 bg-[#2c2e3b] "
              />
            </div>
            <div className="w-full flex space-x-4">
              <select
                id="age"
                value={selectedAge}
                onChange={(e) => {
                  const age = e.target.value;
                  setSelectedAge(age);
                }}
                className="w-full border border-gray-300 text-white focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-lg p-3.5 bg-[#2c2e3b]"
              >
                <option value="" disabled>
                  Choose your age
                </option>
                {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>

              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-gray-300 text-white focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-lg p-3.5 bg-[#2c2e3b]"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>

            <div className="flex flex-col items-start w-full"></div>
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {predefinedOptions.characters.map((character, index) => (
                    <CarouselItem
                      key={index}
                      className="flex items-center justify-center "
                    >
                      <Card className="h-[100%] w-[70%] bg-white shadow-lg rounded-3xl ">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-[220px]  object-cover rounded-t-3xl"
                          onClick={async () => {
                            await handleDeleteImage();
                            const response = await fetch(character.image);
                            const blob = await response.blob();
                            const mimeType = getMimeType(character.image);

                            const file = new File(
                              [blob],
                              character.image.split("/").pop(),
                              { type: mimeType }
                            );

                            if (file) {
                              const formData = new FormData();
                              formData.append("profile-image", file);
                              const response = await apiClient.post(
                                ADD_PROFILE_IMAGE_ROUTE,
                                formData,
                                {
                                  withCredentials: true,
                                }
                              );
                              if (
                                response.status === 200 &&
                                response.data.image
                              ) {
                                setUserInfo({
                                  ...userInfo,
                                  image: response.data.image,
                                });
                                toast.success("Image updated successfully");
                              }
                            }
                          }}
                        />
                        <CardContent className="rounded-b-3xl h-[30px] border-black border-2 text-center bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
                          <p className="text-xl font-bold">{character.name}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Controls */}
                <CarouselPrevious className="ml-12 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-600 " />
                <CarouselNext className="mr-12 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-600 " />
              </Carousel>
            </div>

            {/* <div className="flex space-x-3 w-full">
              <Button
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105    p-2"
              >
                Select Character
              </Button>
              <Button
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105    p-2"
              >
                Let Ai Select For You
              </Button>
            </div> */}
          </div>
        </div>
        {userInfo.role === "Squire" ? (
          <>
            <div className="space-y-6 mt-10">
              <div className="space-y-6">
                {/* Row 1: Fitness Level and Available Days */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.fitnessLevels}
                      value={fitnessLevel}
                      onChange={(newValue) => setFitnessLevel(newValue)}
                      placeholder="Select or add you fitness level"
                      styles={selectStyles}
                    />
                  </div>
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.daysOfWeek}
                      value={selectedDays}
                      onChange={(newValue) => {
                        console.log("DAYS", newValue);

                        setSelectedDays(newValue);
                        console.log("selectedDAYS", selectedDays);
                      }}
                      placeholder="Select or add available days"
                      styles={selectStyles}
                    />
                  </div>
                </div>

                {/* Row 2: Buddy Types and Fitness Goals */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.buddyTypes}
                      value={selectedBuddyTypes}
                      onChange={(newValue) => setSelectedBuddyTypes(newValue)}
                      placeholder="Select or add the type of buddy you are"
                      styles={selectStyles}
                    />
                  </div>
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.fitnessGoals}
                      value={FitnessGoals}
                      onChange={(newValue) => setFitnessGoals(newValue)}
                      placeholder="Select or add your fitness goals"
                      styles={selectStyles}
                    />
                  </div>
                </div>

                {/* Row 3: Workout Preferences and Availability */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.workoutPreferences}
                      value={Preferences}
                      onChange={(newValue) => setPreferences(newValue)}
                      placeholder="Select or add your workout preferences"
                      styles={selectStyles}
                    />
                  </div>
                  <div className="flex-1">
                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.availability}
                      value={availability}
                      onChange={(newValue) => setavailability(newValue)}
                      placeholder="Select or add your availability"
                      styles={selectStyles}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between w-[100%] border-gray-300  rounded-full  h-[50px] space-x-5">
                <div className="w-[50%] flex  text-white  focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-lg transition duration-200 rounded-full  bg-[#2c2e3b]">
                  <input
                    type="text"
                    placeholder="Set Your Location "
                    value={address}
                    readOnly
                    className="w-[100%] m-2 bg-[#2c2e3b]"
                  />
                  <div className="w-[70%] h-fit">
                    <LocationPicker
                      onLocationChange={handleLocationChange}
                      onAddressChange={handleAddressChange}
                    />
                  </div>
                </div>

                <div className="w-[50%] flex justify-center">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 p-2"
                    >
                      Open To Add Achievements
                    </DialogTrigger>
                    <DialogContent>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                          Achievements
                        </h2>

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
                                    {new Date(
                                      achievement.date
                                    ).toLocaleDateString()}
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
                            <p className="text-sm text-gray-500">
                              No achievements added yet.
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setAchievements(achievements);
                              setIsDialogOpen(false);
                            }}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                          >
                            Submit Achievements
                          </button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex space-x-6 mt-5 ">
              <div className="w-[50%] flex justify-center">
                <Dialog open={isQDialogOpen} onOpenChange={setIsQDialogOpen}>
                  <DialogTrigger
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 p-2"
                  >
                    Open To Add Qualifications
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Qualifications
                      </h2>

                      {/* Input Fields for Adding New Achievement */}
                      <div className="flex flex-col space-y-4 mb-4">
                        <input
                          type="text"
                          name="title"
                          value={newQualifications.title}
                          onChange={handleQualificationInputChange}
                          placeholder="Qualification Title"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        <input
                          type="date"
                          name="date"
                          value={newQualifications.date}
                          onChange={handleQualificationInputChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        <textarea
                          name="description"
                          value={newQualifications.description}
                          onChange={handleQualificationInputChange}
                          placeholder="Qualification Description"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        ></textarea>
                        <button
                          onClick={handleAddQualification}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                        >
                          Add Qualification
                        </button>
                      </div>

                      {/* Display List of Qualifications */}
                      <div className="space-y-4">
                        {qualifications?.length > 0 ? (
                          qualifications.map((qualification, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center"
                            >
                              <div>
                                <h3 className="text-sm font-semibold text-gray-700">
                                  {qualification.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    qualification.date
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {qualification.description}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveQualification(index)}
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition duration-200"
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No Qualifications added yet.
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setQualifications(qualifications);
                            setIsQDialogOpen(false);
                          }}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                        >
                          Submit Qualifications
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="w-[50%] flex justify-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 p-2"
                  >
                    Open To Add Achievements
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Achievements
                      </h2>

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
                                  {new Date(
                                    achievement.date
                                  ).toLocaleDateString()}
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
                          <p className="text-sm text-gray-500">
                            No achievements added yet.
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setAchievements(achievements);
                            setIsDialogOpen(false);
                          }}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                        >
                          Submit Achievements
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <hr className="mt-5" />
            <div className="font-sans text-lg text-white flex justify-center items-center h-[20%]">
              IMPLEMENT REELS
            </div>
          </>
        )}
        <div className="w-full flex justify-center mt-12">
          <Button
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-[50%] h-[60px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 p-2 "
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
