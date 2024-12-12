import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface SignupSectionProps {
  isActive: boolean;
  onSignInClick: () => void;
}

export const SignupSection = ({ isActive, onSignInClick }: SignupSectionProps) => {
  return (
    <div className="min-h-[500px] p-10 flex flex-col">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
        <div className="space-y-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0ef',
                    brandAccent: '#0df',
                    inputBackground: 'transparent',
                    inputText: 'white',
                    inputPlaceholder: '#666666',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full h-10 bg-[#0ef] shadow-[0_0_10px_#0ef] text-black font-medium rounded-full',
                input: 'w-full h-10 bg-transparent border-b-2 border-white text-white placeholder-white/50 focus:border-[#0ef] transition-colors',
                label: 'text-white',
              }
            }}
            theme="dark"
            providers={[]}
          />
        </div>
        <div className="text-center text-sm">
          <p className="text-white">
            Already have an account?{' '}
            <button 
              onClick={onSignInClick}
              className="text-[#0ef] hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};