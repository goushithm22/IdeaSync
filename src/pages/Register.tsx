
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, UserPlus, Building, Briefcase } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg border-[#ff4141]/10 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            <span className="text-[#ff4141]">Create</span> Your Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Join ideasync to connect with investors and founders
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                <User className="h-4 w-4 text-[#ff4141]" /> Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-200 focus:border-[#ff4141] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-[#ff4141]" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 focus:border-[#ff4141] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-[#ff4141]" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-200 focus:border-[#ff4141] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-[#ff4141]" /> Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-gray-200 focus:border-[#ff4141] transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <User className="h-4 w-4 text-[#ff4141]" /> I am a
              </Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer transition-all duration-300 hover:border-[#ff4141]"
                     onClick={() => setRole("founder")}
                     style={{ borderColor: role === "founder" ? "#ff4141" : "" }}>
                  <input
                    type="radio"
                    id="founder"
                    name="role"
                    checked={role === "founder"}
                    onChange={() => setRole("founder")}
                    className="h-4 w-4 text-[#ff4141] focus:ring-[#ff4141]"
                  />
                  <label htmlFor="founder" className="ml-2 text-sm text-gray-700 flex items-center gap-1 cursor-pointer">
                    <Building className="h-4 w-4 text-[#ff4141]" /> Founder
                  </label>
                </div>
                
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer transition-all duration-300 hover:border-[#ff4141]"
                     onClick={() => setRole("investor")}
                     style={{ borderColor: role === "investor" ? "#ff4141" : "" }}>
                  <input
                    type="radio"
                    id="investor"
                    name="role"
                    checked={role === "investor"}
                    onChange={() => setRole("investor")}
                    className="h-4 w-4 text-[#ff4141] focus:ring-[#ff4141]"
                  />
                  <label htmlFor="investor" className="ml-2 text-sm text-gray-700 flex items-center gap-1 cursor-pointer">
                    <Briefcase className="h-4 w-4 text-[#ff4141]" /> Investor
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Register
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a 
              href="/signin" 
              className="font-medium text-[#ff4141] hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
