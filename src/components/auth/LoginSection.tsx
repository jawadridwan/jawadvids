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
    <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
      <h2 className="text-3xl text-white text-center mb-8">Login</h2>
      
      <div className="relative w-full mb-8 border-b-2 border-white group">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 text-base text-white bg-transparent border-none outline-none px-1"
        />
        <label className={`absolute left-1 ${email ? 'top-[-5px] text-sm' : 'top-1/2'} transform ${email ? 'translate-y-0' : '-translate-y-1/2'} text-white pointer-events-none transition-all duration-500`}>
          Email
        </label>
      </div>

      <div className="relative w-full mb-8 border-b-2 border-white group">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 text-base text-white bg-transparent border-none outline-none px-1"
        />
        <label className={`absolute left-1 ${password ? 'top-[-5px] text-sm' : 'top-1/2'} transform ${password ? 'translate-y-0' : '-translate-y-1/2'} text-white pointer-events-none transition-all duration-500`}>
          Password
        </label>
      </div>

      <div className="flex items-center mb-4 text-white w-full">
        <input type="checkbox" className="mr-2 accent-[#0ef]" />
        <label className="text-sm">Remember me</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-[#0ef] shadow-[0_0_10px_#0ef] text-black font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <div className="mt-4 text-center">
        <p className="text-white text-sm">
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