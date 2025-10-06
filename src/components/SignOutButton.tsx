import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

const SignOutButton: React.FC = () => {
  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/login";
  };
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center px-6 py-3 rounded-lg bg-cyber-dark text-white hover:bg-cyber-blue/20 border border-cyber-blue/40 text-lg font-semibold shadow-lg transition-all"
      style={{ minWidth: 180 }}
    >
      <LogOut className="mr-2" size={22} />
      Sign Out
    </button>
  );
};

export default SignOutButton;
