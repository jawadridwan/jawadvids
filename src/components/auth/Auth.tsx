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
        className="w-full max-w-[400px] h-[500px] relative overflow-hidden rounded-2xl bg-black shadow-[0_0_50px_#0ef] hover:animate-hue-rotate"
      >
        <div className="relative h-full flex">
          <motion.div 
            initial={false}
            animate={{ y: isLogin ? 0 : '-100%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="flex flex-col min-h-[200%]"
          >
            <LoginSection isActive={isLogin} onSignUpClick={() => setIsLogin(false)} />
            <SignupSection isActive={!isLogin} onSignInClick={() => setIsLogin(true)} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};