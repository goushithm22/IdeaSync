
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-100">
      <Link 
        to="/" 
        className="text-xl font-semibold tracking-tighter text-gray-900"
      >
        <span className="text-[#ff4141]">idea</span>sync
      </Link>
      
      <div className="flex gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 self-center mr-2">
              {user.name} <span className="text-[#ff4141]">({user.role})</span>
            </span>
            <Button 
              variant="outline" 
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="border-[#ff4141] text-[#ff4141] hover:bg-[#ff4141]/10"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/signin")}
              className="border-[#ff4141] text-[#ff4141] hover:bg-[#ff4141]/10"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-[#ff4141] hover:bg-[#ff4141]/90 text-white"
            >
              Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
