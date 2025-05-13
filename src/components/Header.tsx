
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-100 shadow-sm sticky top-0 bg-white z-10 animate-fade-in">
      <Link 
        to="/" 
        className="text-xl font-semibold tracking-tighter text-gray-900 transform transition-all duration-300 hover:scale-110"
      >
        <span className="text-[#ff4141] font-bold animate-pulse">idea</span>
        <span className="text-black font-bold">sync</span>
      </Link>
      
      <div className="flex gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 self-center mr-2 animate-fade-in">
              {user.name} <span className="text-[#ff4141] font-medium">({user.role})</span>
            </span>
            <Button 
              variant="outline" 
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="border-[#ff4141] text-[#ff4141] hover:bg-[#ff4141]/20 transform transition-all duration-300 hover:scale-110 hover:shadow-md"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/signin")}
              className="border-[#ff4141] text-[#ff4141] hover:bg-[#ff4141]/20 transform transition-all duration-300 hover:scale-110 hover:shadow-md flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-[#ff4141] hover:bg-[#ff4141]/90 text-white transform transition-all duration-300 hover:scale-110 hover:shadow-md flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
