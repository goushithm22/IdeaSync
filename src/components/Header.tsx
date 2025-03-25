
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
        ideasync
      </Link>
      
      <div className="flex gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 self-center mr-2">
              {user.name} ({user.role})
            </span>
            <Button 
              variant="outline" 
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gray-900 hover:bg-gray-800 text-white"
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
