
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignupSectionProps {
  onSignInClick: () => void;
}

export const SignupSection = ({ onSignInClick }: SignupSectionProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms & conditions");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Check your email to confirm your account!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col items-center w-full">
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
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2 accent-[#0ef]"
        />
        <label className="text-sm">I agree to the terms & conditions</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-[#0ef] shadow-[0_0_10px_#0ef] text-black font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>

      <div className="mt-4 text-center">
        <p className="text-white text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-[#0ef] font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};
