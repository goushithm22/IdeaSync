
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data including custom fields from profiles and roles tables
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching profile data for user:", userId);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
      }
      
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      
      if (rolesError) {
        console.error("Error fetching roles data:", rolesError);
      }
      
      console.log("Profile data fetched:", profileData);
      console.log("Roles data fetched:", rolesData);
      
      // Get the primary role (first role)
      const primaryRole = rolesData && rolesData.length > 0 ? rolesData[0].role : null;
      
      return {
        profile: profileData,
        role: primaryRole
      };
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return null;
    }
  };

  // Update authentication state when session changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log("Checking current session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        // If we have a session, get the user profile
        if (session?.user) {
          console.log("Session found, user ID:", session.user.id);
          const userData = await fetchUserData(session.user.id);
          
          if (userData && userData.profile) {
            console.log("Setting user data from profile");
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: userData.profile.name || "User",
              role: (userData.role as UserRole) || "founder"
            });
          } else {
            // If no profile data, set minimal user info
            console.log("No profile data found, using metadata");
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || "User",
              role: session.user.user_metadata?.role || "founder"
            });
          }
        } else {
          console.log("No session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (session?.user) {
          console.log("User authenticated:", session.user.id);
          const userData = await fetchUserData(session.user.id);
          
          if (userData && userData.profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: userData.profile.name || "User",
              role: (userData.role as UserRole) || "founder"
            });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || "User",
              role: session.user.user_metadata?.role || "founder"
            });
          }
        } else {
          console.log("No user in session");
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Handle login
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  // Handle registration
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    try {
      console.log("Registering new user:", email, "with role:", role);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            role
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        console.log("Registration successful for user:", data.user.id);
        
        // Create profile entry
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            email: email,
            name: name
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        // Create role entry
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: role
          });
        
        if (roleError) {
          console.error("Error creating role:", roleError);
        }
        
        toast.success(
          "Account created successfully!"
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      console.log("Logging out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      console.log("Refreshing session");
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      // Get the updated session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("Session refreshed for user:", session.user.id);
        const userData = await fetchUserData(session.user.id);
        
        if (userData && userData.profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: userData.profile.name || "User",
            role: (userData.role as UserRole) || "founder"
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
            role: session.user.user_metadata?.role || "founder"
          });
        }
      }
      
      return;
    } catch (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
