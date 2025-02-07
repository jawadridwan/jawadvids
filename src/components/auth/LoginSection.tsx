
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginSectionProps {
  onSignUpClick: () => void;
}

export const LoginSection = ({ onSignUpClick }: LoginSectionProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-sm mx-auto px-4">      
      <div className="relative w-full mb-6 border-b-2 border-white group">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 text-base md:text-lg text-white bg-transparent border-none outline-none px-2"
        />
        <label className={`absolute left-2 ${email ? 'top-[-5px] text-sm' : 'top-1/2'} transform ${email ? 'translate-y-0' : '-translate-y-1/2'} text-white pointer-events-none transition-all duration-500`}>
          Email
        </label>
      </div>

      <div className="relative w-full mb-6 border-b-2 border-white group">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 text-base md:text-lg text-white bg-transparent border-none outline-none px-2"
        />
        <label className={`absolute left-2 ${password ? 'top-[-5px] text-sm' : 'top-1/2'} transform ${password ? 'translate-y-0' : '-translate-y-1/2'} text-white pointer-events-none transition-all duration-500`}>
          Password
        </label>
      </div>

      <div className="flex items-center mb-6 text-white w-full">
        <input type="checkbox" className="mr-3 w-4 h-4 accent-[#0ef]" />
        <label className="text-sm md:text-base">Remember me</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-[#0ef] shadow-[0_0_10px_#0ef] text-black font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 text-base md:text-lg"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-white text-sm md:text-base">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-[#0ef] font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
};
