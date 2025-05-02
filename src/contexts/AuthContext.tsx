
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  checkAuthSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to format user data from session
  const formatUserFromSession = (currentSession: Session | null): User | null => {
    if (!currentSession?.user) return null;
    
    return {
      id: currentSession.user.id,
      email: currentSession.user.email || "",
      name: currentSession.user.user_metadata.name || currentSession.user.email?.split("@")[0] || "",
      role: (currentSession.user.user_metadata.role as UserRole) || "founder",
    };
  };

  // Refresh the session (useful after token expiration)
  const refreshSession = async () => {
    try {
      console.log("Refreshing session...");
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Session refresh error:", error);
        toast.error("Session error: " + error.message);
        
        // If refresh fails, try to get the current session
        const { data: currentSession } = await supabase.auth.getSession();
        if (currentSession?.session) {
          console.log("Got existing session after refresh failure");
          setSession(currentSession.session);
          setUser(formatUserFromSession(currentSession.session));
          return;
        }
        
        throw error;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully");
        setSession(data.session);
        setUser(formatUserFromSession(data.session));
      } else {
        console.log("No session after refresh attempt");
        // Clear the session and user if no session was returned
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Session refresh exception:", error);
      // Clear the session and user on refresh errors to prevent stale data
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check Supabase auth settings
  const checkAuthSettings = async (): Promise<void> => {
    try {
      console.log("Checking Supabase auth settings...");
      
      // Instead of trying the admin API which requires special permissions,
      // let's focus on checking capabilities that don't require admin access
      
      // Check if we can get basic auth capabilities
      const { data: gotSession } = await supabase.auth.getSession();
      console.log("Auth getSession capability:", !!gotSession);
      
      // Check if we can do a password recovery (won't send actual email but tests the API)
      const recoveryEmail = "test@example.com"; // Using a test email
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: window.location.origin + "/reset-password",
      });
      
      console.log("Password recovery API check:", recoveryError ? 
        `Error: ${recoveryError.message}` : 
        "Password recovery API seems accessible"
      );
      
      toast.info("Auth settings check complete. See console for details.");
    } catch (error: any) {
      console.error("Auth settings check exception:", error);
      toast.error("Error checking auth settings");
      throw error;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(formatUserFromSession(currentSession));
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully");
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed automatically");
        } else if (event === 'USER_UPDATED') {
          toast.success("User profile updated");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got existing session:", currentSession ? "yes" : "no");
      setSession(currentSession);
      setUser(formatUserFromSession(currentSession));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log("Starting registration for:", email);
      
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (checkError) {
        console.warn("Error checking existing users:", checkError);
        // Continue with registration attempt despite the error
      } else if (existingUsers && existingUsers.length > 0) {
        console.log("Email already exists:", email);
        throw new Error("Email already exists. Please use a different email address.");
      }

      console.log("Registering with details:", { email, name, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: `${window.location.origin}/confirm-email`,
        },
      });
      
      if (error) {
        console.error("Registration API error:", error);
        throw error;
      }
      
      console.log("Registration response:", data);
      
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        console.log("Email confirmation details:", {
          identityConfirmed: data.user.identities?.[0]?.identity_data?.email_verified,
          confirmationSent: data.user.confirmation_sent_at,
          confirmationNeed: !!data.user.confirmation_sent_at && !data.user.confirmed_at
        });
        
        // Show specific message about email confirmation
        if (data.user.confirmation_sent_at && !data.user.confirmed_at) {
          toast.success(`Registration successful! Please check your email (${email}) to confirm your account.`);
        } else {
          toast.success("Registration successful!");
        }
      } else {
        console.warn("User created but no user data returned");
        toast.warning("Registration processed but encountered an issue. Please try signing in.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      login, 
      register, 
      logout,
      refreshSession,
      checkAuthSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};
