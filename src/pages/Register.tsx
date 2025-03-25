
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("founder");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(email, password, name, role);
      
      toast({
        title: "Success",
        description: "Registration successful",
      });
      
      // Redirect based on user role
      navigate(role === "founder" ? "/founder-dashboard" : "/investor-dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-sm rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Join ideasync to connect with investors and founders
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="founder"
                  name="role"
                  checked={role === "founder"}
                  onChange={() => setRole("founder")}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                />
                <label htmlFor="founder" className="ml-2 text-sm text-gray-700">
                  Founder
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="investor"
                  name="role"
                  checked={role === "investor"}
                  onChange={() => setRole("investor")}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                />
                <label htmlFor="investor" className="ml-2 text-sm text-gray-700">
                  Investor
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a 
              href="/signin" 
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
