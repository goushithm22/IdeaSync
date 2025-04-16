
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";

const ConfirmEmail = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Current URL:", window.location.href);
        console.log("Location state:", location);
        console.log("Hash:", window.location.hash);
        console.log("Search params:", location.search);
        
        // Check if we have error information in the URL query params
        const searchParams = new URLSearchParams(location.search);
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        // If there's an error in the URL params, handle it
        if (error) {
          console.log("Error found in URL params:", error, errorDescription);
          setIsSuccess(false);
          setErrorMessage(errorDescription || error);
          setIsVerifying(false);
          toast(`Verification failed: ${errorDescription || error}`, {
            style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
          });
          return;
        }
        
        // Special handling for "redirect path is invalid" error
        if (window.location.href.includes("error=requested_path_is_invalid") || 
            window.location.href.includes("redirect_path_is_invalid") ||
            window.location.href.includes("wbwwpvwydfunhsdeulgj.supabase.co")) {
          console.log("Detected redirect path invalid error");
          setIsSuccess(false);
          setErrorMessage("Redirect URL configuration issue detected. This is a common Supabase configuration error.");
          setIsVerifying(false);
          toast("Authentication redirect error. Please try signing in directly.", {
            style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
          });
          return;
        }
        
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        console.log("Hash params:", Object.fromEntries(params.entries()));
        
        // If we have a type=recovery token, it's a password reset, not email confirmation
        if (params.get("type") === "recovery") {
          console.log("Password reset detected");
          navigate("/reset-password");
          return;
        }
        
        // Check for access_token which indicates successful verification
        const accessToken = params.get("access_token");
        
        if (accessToken) {
          console.log("Access token found:", accessToken.substring(0, 10) + "...");
          // If we have an access token, the email was successfully confirmed
          setIsSuccess(true);
          toast("Email successfully verified!");
          
          try {
            // Set the session with the access token
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: params.get("refresh_token") || "",
            });
            
            if (error) {
              console.error("Error setting session:", error);
              throw error;
            }
          } catch (sessionError) {
            console.error("Session setting error:", sessionError);
            // Even if session setting fails, still show success as the email was verified
          }
        } else {
          console.log("No access token found in URL");
          // Try to get the current session as a fallback
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            console.log("Found existing session");
            setIsSuccess(true);
            toast("You're already signed in!");
          } else {
            console.log("No session found either");
            // No access token and no session - likely an invalid URL
            setIsSuccess(false);
            setErrorMessage("Verification link appears to be invalid or expired.");
            toast("Verification failed. Please request a new verification email.", {
              style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
            });
          }
        }
      } catch (error) {
        console.error("Error handling email confirmation:", error);
        setIsSuccess(false);
        setErrorMessage("An unexpected error occurred during verification.");
        toast("Failed to verify email. Please try again or contact support.", {
          style: { backgroundColor: "#fecaca", color: "#7f1d1d" },
        });
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate, location]);

  const goToDashboard = () => {
    navigate("/signin");
  };

  const tryManualSignIn = () => {
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
              {errorMessage && errorMessage.includes("Redirect URL configuration") ? (
                <>
                  <Info className="w-16 h-16 mx-auto text-blue-500" />
                  <h2 className="text-2xl font-semibold text-gray-800">Redirect Error</h2>
                  <p className="text-gray-600">
                    There was a problem with the authentication redirect. This happens when your Supabase URL configuration isn't properly set up.
                  </p>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-blue-800 text-sm">
                    <p>Your account may still be verified. Please try signing in directly.</p>
                  </div>
                  <Button 
                    onClick={tryManualSignIn} 
                    className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white"
                  >
                    Go to Sign In
                  </Button>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-16 h-16 mx-auto text-amber-500" />
                  <h2 className="text-2xl font-semibold text-gray-800">Verification Failed</h2>
                  <p className="text-gray-600">
                    {errorMessage || "We couldn't verify your email. This might be because the link has expired or is invalid."}
                  </p>
                  <Button 
                    onClick={() => navigate("/register")} 
                    className="w-full bg-[#ff4141] hover:bg-[#ff4141]/90 text-white"
                  >
                    Try Registering Again
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
