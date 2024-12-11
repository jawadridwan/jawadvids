import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";

export const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[900px] h-[600px] relative overflow-hidden rounded-xl"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] to-[#1a1a1a] rounded-xl" />
        
        <div className="relative h-full flex">
          {/* Content container */}
          <motion.div 
            initial={false}
            animate={{ x: isLogin ? 0 : '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex min-w-[200%]"
          >
            {/* Login section */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isLogin ? 1 : 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                <p className="text-blue-400 mb-8">Welcome back!</p>
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

            {/* Sign up section */}
            <div className="w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-[#0066ff]/10 to-[#00ccff]/20">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: !isLogin ? 1 : 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
                <p className="text-blue-400 mb-8">Create your account</p>
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
          </motion.div>

          {/* Switch button */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="absolute top-4 right-4 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      </motion.div>

      <style>{`
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
      `}</style>
    </div>
  );
};