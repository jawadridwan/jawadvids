import { motion } from "framer-motion";
import { useState } from "react";
import { LoginSection } from "./LoginSection";
import { SignupSection } from "./SignupSection";

export const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[900px] h-[600px] relative overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] to-[#1a1a1a] rounded-xl" />
        
        <div className="relative h-full flex">
          <motion.div 
            initial={false}
            animate={{ x: isLogin ? 0 : '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex min-w-[200%]"
          >
            <LoginSection isActive={isLogin} />
            <SignupSection isActive={!isLogin} />
          </motion.div>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="absolute top-4 right-4 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};