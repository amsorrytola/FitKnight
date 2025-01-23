import Background from "../../assets/login4.webp";
import Logo from "../../assets/Gotham_Knights_Logo.svg.png";
import Google from "../../assets/GoogleLogo.png";
import Channeli from "../../assets/Channelilogo.svg";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button.jsx";
import LocationPicker from "../../components/ui/LocationPicker.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import CreatableSelect from "react-select/creatable";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { predefinedOptions } from "../../utils/constants/predefinedOptions.js";
import { useState } from "react";
import { toast } from "sonner";
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTES,
  ADD_PROFILE_IMAGE_ROUTE,
} from "../../utils/constants.js";
import { apiClient } from "../../lib/api-client.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/store.js";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setfile] = useState(null);
  const [role, setrole] = useState("");
  const [FitnessGoals, setFitnessGoals] = useState([]);
  const [Preferences, setPreferences] = useState([]);
  const [activityType, setactivityType] = useState([]);
  const [availability, setavailability] = useState([]);
  const [schedule, setschedule] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const {
    setUserInfo,
    userInfo,
    setSquireInfo,
    setKnightInfo,
    setChannelInfo,
    addChannel,
  } = useAppStore();

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    console.log("Selected Location:", newLocation);
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    console.log("Selected Address:", newAddress);
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and ConfirmPassword should be the same");
      return false;
    }
    if (!role) {
      toast.error("Role is required.");
      return false;
    }

    return true;
  };

  //File

  //Login
  const handleLogin = async () => {
    if (!validateLogin()) {
      return; // Stop execution if validation fails
    }

    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      // Check if user exists in the response
      if (response.data?.user?.id) {
        setUserInfo(response.data.user);
        if (response.data.user.role == "Squire") {
          setSquireInfo(response.data.squire);
        } else {
          setKnightInfo(response.data.knight);
          setChannelInfo(response.data.channels);
        }
        console.log(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      // Handle different error cases based on server response
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          toast.error(
            "User does not exist. Please check your email or sign up."
          );
        } else if (status === 401) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error(
            data?.message ||
              "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        console.error("Error during login:", error);
        alert(
          "Unable to connect to the server. Please check your internet connection."
        );
      }
    }
  };

  const handleLoginwithGoogle = async () => {};
  const handleLoginwithChanneli = async () => {};

  //Signup

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const payload =
          role === "Squire"
            ? { email, password, role, FitnessGoals, Preferences, availability }
            : {
                email,
                password,
                role,
                activityType,
                schedule,
                location,
                address,
              };

        console.log("Signup Payload:", payload); // Log payload to verify data

        const response = await apiClient.post(SIGNUP_ROUTES, payload, {
          withCredentials: true,
        });

        let responseImage;
        if (file) {
          const formData = new FormData();
          formData.append("profile-image", file);
          responseImage = await apiClient.post(
            ADD_PROFILE_IMAGE_ROUTE,
            formData,
            {
              withCredentials: true,
            }
          );
          if (responseImage.status === 200 && responseImage.data.image) {
            toast.success("Image updated successfully");
          }
        }

        console.log("Signup Response:", response);

        alert("Signup successful!");

        // Set user info in Zustand store
        if(responseImage ){
          setUserInfo({...response.data.user,image: responseImage.data.image});
        }else if (response){
          setUserInfo(response.data.user);
        }

        // Set role-specific data
        if (response.data.user.role === "Squire") {
          setSquireInfo(response.data.squire);
        } else {
          setKnightInfo(response.data.knight);
          setChannelInfo(response.data.channels);
          addChannel(response.data.channels[0]);

        }

        
          navigate("/profile");
        

      
          window.location.reload();
    

      } catch (error) {
        console.error("Error during signup:", error.response || error);
        alert(error.response?.data?.message || "Something went wrong!");
      }
    }
  };

  const handleSignupwithGoogle = async () => {};
  const handleSignupwithChanneli = async () => {};

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#1b1c24] ">
      <div className="h-[95vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Logo} alt="logo" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Join the crusade—find your fitness ally today!
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="signup" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105    p-2"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <hr />
                <button
                  className="flex items-center justify-center w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
                  onClick={handleLoginwithChanneli}
                >
                  <img src={Channeli} alt="" className="h-[30px]" />
                  <p className="pl-4 text-sm font-semibold">
                    Login with Channeli
                  </p>
                </button>

                <button
                  className="flex items-center justify-center w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
                  onClick={handleLoginwithGoogle}
                >
                  <img src={Google} alt="" className="h-[40px]" />
                  <p className="pl-2 text-sm font-semibold">
                    Login with Google
                  </p>
                </button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex justify-between">
                  <Input
                    type="file"
                    className="rounded-full  w-[45%]"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setfile(selectedFile);
                      }
                    }}
                  />
                  <Select onValueChange={(value) => setrole(value)}>
                    <SelectTrigger className="w-[50%] rounded-full ">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Squire">
                        Fitness Squire (for users finding a workout buddy)
                      </SelectItem>
                      <SelectItem value="Knight">
                        Fitness Knight (for users creating or managing a fitness
                        group)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === "Squire" && (
                  <div className="flex flex-col justify-between space-y-3">
                    {/* Fitness Goals */}

                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.fitnessGoals}
                      value={FitnessGoals}
                      onChange={(newValue) => setFitnessGoals(newValue)}
                      placeholder="Select or add your fitness goals"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Fully rounded corners
                          padding: "4px",
                          border: "1px solid #ccc", // Optional: Customize border style
                          boxShadow: "none", // Remove default focus shadow if needed
                          "&:hover": {
                            borderColor: "#888", // Optional: Change border on hover
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Rounded tags for selected items
                          backgroundColor: "#e2e8f0", // Optional: Customize tag background color
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#333", // Optional: Customize tag text color
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          borderRadius: "9999px",
                          "&:hover": {
                            backgroundColor: "#f87171", // Optional: Customize remove button hover color
                            color: "white",
                          },
                        }),
                      }}
                    />

                    {/* Workout Preferences */}

                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.workoutPreferences}
                      value={Preferences}
                      onChange={(newValue) => {
                        setPreferences(newValue);
                      }}
                      placeholder="Select or add your workout preferences"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Fully rounded corners
                          padding: "4px",
                          border: "1px solid #ccc", // Optional: Customize border style
                          boxShadow: "none", // Remove default focus shadow if needed
                          "&:hover": {
                            borderColor: "#888", // Optional: Change border on hover
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Rounded tags for selected items
                          backgroundColor: "#e2e8f0", // Optional: Customize tag background color
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#333", // Optional: Customize tag text color
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          borderRadius: "9999px",
                          "&:hover": {
                            backgroundColor: "#f87171", // Optional: Customize remove button hover color
                            color: "white",
                          },
                        }),
                      }}
                    />

                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.availability}
                      value={availability}
                      onChange={(newValue) => {
                        setavailability(newValue);
                      }}
                      placeholder="Select or add your availability"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Fully rounded corners
                          padding: "4px",
                          border: "1px solid #ccc", // Optional: Customize border style
                          boxShadow: "none", // Remove default focus shadow if needed
                          "&:hover": {
                            borderColor: "#888", // Optional: Change border on hover
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Rounded tags for selected items
                          backgroundColor: "#e2e8f0", // Optional: Customize tag background color
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#333", // Optional: Customize tag text color
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          borderRadius: "9999px",
                          "&:hover": {
                            backgroundColor: "#f87171", // Optional: Customize remove button hover color
                            color: "white",
                          },
                        }),
                      }}
                    />
                  </div>
                )}
                {role === "Knight" && (
                  <div className="flex flex-col justify-between space-y-3">
                    {/* activity type */}

                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.activityType}
                      value={activityType}
                      onChange={(newValue) => setactivityType(newValue)}
                      placeholder="Select or add your activityType"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Fully rounded corners
                          padding: "4px",
                          border: "1px solid #ccc", // Optional: Customize border style
                          boxShadow: "none", // Remove default focus shadow if needed
                          "&:hover": {
                            borderColor: "#888", // Optional: Change border on hover
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Rounded tags for selected items
                          backgroundColor: "#e2e8f0", // Optional: Customize tag background color
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#333", // Optional: Customize tag text color
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          borderRadius: "9999px",
                          "&:hover": {
                            backgroundColor: "#f87171", // Optional: Customize remove button hover color
                            color: "white",
                          },
                        }),
                      }}
                    />

                    {/* schedule */}

                    <CreatableSelect
                      isMulti
                      options={predefinedOptions.schedule}
                      value={schedule}
                      onChange={(newValue) => {
                        setschedule(newValue);
                      }}
                      placeholder="Select or add schedule"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Fully rounded corners
                          padding: "4px",
                          border: "1px solid #ccc", // Optional: Customize border style
                          boxShadow: "none", // Remove default focus shadow if needed
                          "&:hover": {
                            borderColor: "#888", // Optional: Change border on hover
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "9999px", // Rounded tags for selected items
                          backgroundColor: "#e2e8f0", // Optional: Customize tag background color
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#333", // Optional: Customize tag text color
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          borderRadius: "9999px",
                          "&:hover": {
                            backgroundColor: "#f87171", // Optional: Customize remove button hover color
                            color: "white",
                          },
                        }),
                      }}
                    />

                    <div className="flex justify-between w-[100%] border-gray-300 border-2 rounded-full  h-[50px]">
                      <input
                        type="text"
                        placeholder="Set Your Location "
                        value={address}
                        readOnly
                        className="w-[70%] m-2"
                      />
                      <div className="w-[25%] h-fit">
                        <LocationPicker
                          onLocationChange={handleLocationChange}
                          onAddressChange={handleAddressChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105    p-2"
                  onClick={handleSignup}
                >
                  Signup
                </Button>

                <hr />

                <Button
                  className="flex items-center justify-center w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 p-6"
                  onClick={handleSignupwithChanneli}
                >
                  <img src={Channeli} alt="" className="h-[30px]" />
                  <p className="pl-3 text-[14px] font-semibold text-gray-700">
                    Signup with Channeli
                  </p>
                </Button>

                <Button
                  className="flex items-center justify-center w-full rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 p-6"
                  onClick={handleSignupwithGoogle}
                >
                  <img src={Google} alt="Google Icon" className="h-10 w-10" />
                  <p className="pl-3  text-[14px] font-semibold text-gray-700">
                    Signup with Google
                  </p>
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="background login"
            className="h-[80%] w-[95%] rounded-[100%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
