import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const AuthComponent = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[500px] relative"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-[#00ccff] rounded-xl blur-[2px]" />
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-black to-[#1a1a1a] rounded-xl overflow-hidden">
          {/* Diagonal design element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-[#0066ff]/10 to-[#00ccff]/20 skew-x-[-20deg] translate-x-20" />
          
          <div className="relative p-8">
            {/* Animated heading */}
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2 text-center"
            >
              Welcome Back!
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-blue-300 text-center mb-8"
            >
              Hope you and your family have a great day
            </motion.p>

            {/* Auth UI with custom styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#0066ff',
                        brandAccent: '#00ccff',
                        inputBackground: 'transparent',
                        inputText: 'white',
                        inputPlaceholder: '#666666',
                      },
                    },
                  },
                  className: {
                    container: 'auth-container',
                    button: 'auth-button',
                    input: 'auth-input',
                    label: 'auth-label',
                  },
                }}
                theme="dark"
                providers={[]}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style>
        {`
          .auth-container {
            width: 100%;
          }
          .auth-button {
            background: linear-gradient(to right, #0066ff, #00ccff) !important;
            color: white !important;
            transition: all 0.3s ease !important;
            border: none !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          .auth-button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
          }
          .auth-input {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: white !important;
            transition: all 0.3s ease !important;
          }
          .auth-input:focus {
            border-color: #0066ff !important;
            box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2) !important;
          }
          .auth-label {
            color: #999999 !important;
            font-size: 0.9rem !important;
            margin-bottom: 0.5rem !important;
          }
        `}
      </style>
    </div>
  );
};