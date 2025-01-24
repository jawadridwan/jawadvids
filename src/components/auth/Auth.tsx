import { useState } from "react";
import { LoginSection } from "./LoginSection";
import { SignupSection } from "./SignupSection";
import { motion } from "framer-motion";

export const AuthComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <motion.div 
        className={`relative w-[400px] h-[500px] bg-black shadow-[0_0_50px_#0ef] rounded-[20px] p-10 overflow-hidden group hover:animate-hue-rotate ${isSignUp ? 'active' : ''}`}
        animate={{ scale: 1 }}
        initial={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`transition-transform duration-1000 ease-in-out ${isSignUp ? '-translate-y-[450px]' : ''}`}>
          <LoginSection onSignUpClick={() => setIsSignUp(true)} />
        </div>
        <div className={`absolute top-[450px] left-0 w-full transition-transform duration-1000 ease-in-out ${isSignUp ? '-translate-y-[450px]' : ''}`}>
          <SignupSection onSignInClick={() => setIsSignUp(false)} />
        </div>
      </motion.div>
    </div>
  );
};