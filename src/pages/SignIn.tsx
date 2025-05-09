
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success("Login successful");
      
      // After successful login, let's redirect based on user role
      // The actual redirect will be handled by useEffect below
    } catch (error: any) {
      console.error("Login error:", error);
      uiToast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      console.log("Current user:", user);
      
      if (user) {
        const redirectPath = user.role === "founder" ? "/founder-dashboard" : "/investor-dashboard";
        console.log(`Redirecting to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      }
    };
    
    checkAndRedirect();
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg border-[#ff4141]/10 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            <span className="text-[#ff4141]">Welcome</span> Back
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Sign in to your ideasync account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex justify-between">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <Lock className="h-4 w-4 text-[#ff4141]" /> Password
                </Label>
                <a href="#" className="text-xs text-[#ff4141] hover:underline">
                  Forgot password?
                </a>
              </div>
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
            
            <Button 
              type="submit" 
              className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Sign in
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a 
              href="/register" 
              className="font-medium text-[#ff4141] hover:underline"
            >
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
