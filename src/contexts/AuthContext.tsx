
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
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Session refresh error:", error);
        toast("Session error: " + error.message);
        return;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully");
        setSession(data.session);
        setUser(formatUserFromSession(data.session));
      }
    } catch (error) {
      console.error("Session refresh exception:", error);
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
          toast("Signed in successfully");
        } else if (event === 'SIGNED_OUT') {
          toast("Signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed automatically");
        } else if (event === 'USER_UPDATED') {
          toast("User profile updated");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      if (error) throw error;
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
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
