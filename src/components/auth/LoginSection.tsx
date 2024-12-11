import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface LoginSectionProps {
  isActive: boolean;
}

export const LoginSection = ({ isActive }: LoginSectionProps) => {
  return (
    <div className="w-1/2 p-8 flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
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
          }}
          theme="dark"
          providers={[]}
        />
      </motion.div>
    </div>
  );
};