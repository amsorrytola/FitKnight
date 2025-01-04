import Background from "../../assets/login4.webp";
import Victory from "../../assets/victory.svg";
import Google from "../../assets/GoogleLogo.png";
import Channeli from "../../assets/Channelilogo.svg";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setfile] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  //File
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setfile(selectedFile);
    }
  };

  //Login
  const handleLogin = async () => {};
  const handleLoginwithGoogle = async () => {};
  const handleLoginwithChanneli = async () => {};

  //Signup
  const handleSignup = async () => {};
  const handleSignupwithGoogle = async () => {};
  const handleSignupwithChanneli = async () => {};

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
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
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
                <hr />
                <button
                  className="rounded-full border-2 p-2 flex items-center justify-center"
                  onClick={handleLoginwithChanneli}
                >
                  <img src={Channeli} alt="" className="h-[30px]" />
                  <p className="pl-4">Login with Channeli</p>
                </button>

                <button
                  className="rounded-full border-2 p-1 flex items-center justify-center"
                  onClick={handleLoginwithGoogle}
                >
                  <img src={Google} alt="" className="h-[40px]" />
                  <p className="pl-2">Login with Google</p>
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
                    onChange={handleFileChange}
                  />
                  <Select onValueChange={(value) => setSelectedValue(value)}>
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

                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
                <hr />

                <button
                  className="rounded-full border-2 p-2 flex items-center justify-center"
                  onClick={handleSignupwithChanneli}
                >
                  <img src={Channeli} alt="" className="h-[30px]" />
                  <p className="pl-4">Signup with Channeli</p>
                </button>

                <button
                  className="rounded-full border-2 p-1 flex items-center justify-center"
                  onClick={handleSignupwithGoogle}
                >
                  <img src={Google} alt="" className="h-[40px]" />
                  <p className="pl-2">Signup with Google</p>
                </button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="background login"
            className="h-[650px] w-[90%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
