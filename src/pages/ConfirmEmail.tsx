
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";

const ConfirmEmail = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // If we have a type=recovery token, it's a password reset, not email confirmation
        if (params.get("type") === "recovery") {
          navigate("/reset-password");
          return;
        }
        
        // Check for access_token which indicates successful verification
        const accessToken = params.get("access_token");
        
        if (accessToken) {
          // If we have an access token, the email was successfully confirmed
          setIsSuccess(true);
          toast("Email successfully verified!");
          
          // Set the session with the access token
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: params.get("refresh_token") || "",
          });
          
          if (error) throw error;
        } else {
          // If no access token but we have an error, show error message
          const errorDescription = params.get("error_description");
          if (errorDescription) {
            setIsSuccess(false);
            toast(`Verification failed: ${errorDescription}`, {
              style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
            });
          }
        }
      } catch (error) {
        console.error("Error handling email confirmation:", error);
        setIsSuccess(false);
        toast("Failed to verify email. Please try again or contact support.", {
          style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
        });
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  const goToDashboard = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-md w-full text-center">
          {isVerifying ? (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-t-[#ff4141] border-r-[#ff4141]/60 border-b-[#ff4141]/40 border-l-[#ff4141]/20 rounded-full animate-spin mx-auto"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we confirm your email address.</p>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Email Verified!</h2>
              <p className="text-gray-600">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <Button 
                onClick={goToDashboard} 
                className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white"
              >
                Continue to Sign In
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <AlertTriangle className="w-16 h-16 mx-auto text-amber-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Verification Failed</h2>
              <p className="text-gray-600">
                We couldn't verify your email. This might be because the link has expired or is invalid.
              </p>
              <Button 
                onClick={() => navigate("/register")} 
                className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white"
              >
                Try Registering Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
