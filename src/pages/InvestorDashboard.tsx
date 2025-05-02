
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Search, Star, Settings, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Company } from "@/types";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import the components
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CompanyDiscovery from "@/components/dashboard/investor/CompanyDiscovery";
import SavedCompanies from "@/components/dashboard/investor/SavedCompanies";
import InvestorProfile from "@/components/dashboard/investor/InvestorProfile";
import MessageInbox from "@/components/dashboard/MessageInbox";

const InvestorDashboard = () => {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define sidebar items
  const sidebarItems = [
    {
      id: "discover",
      label: "Discover Startups",
      icon: <Search />,
      tooltip: "Discover Startups"
    },
    {
      id: "saved",
      label: "Saved Startups",
      icon: <Star />,
      tooltip: "Saved Startups"
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle />,
      tooltip: "Messages"
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings />,
      tooltip: "Settings"
    }
  ];
  
  // Fetch companies from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching companies for user:", user.id);
        
        const { data, error } = await supabase
          .from('companies')
          .select('*');
        
        if (error) {
          // If unauthorized, try refreshing the session
          if (error.code === '401' || error.message.includes('JWT')) {
            console.log("Auth error, refreshing session...");
            await refreshSession();
            throw new Error("Session refreshed. Please try again.");
          }
          throw error;
        }
        
        console.log("Fetched companies:", data ? data.length : 0);
        
        // Transform database columns to match our frontend Company type
        const transformedCompanies: Company[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          sector: item.sector || "",
          founderId: item.founder_id,
          fundingGoal: item.funding_goal,
          pitchDeck: item.pitch_deck,
          contactDetails: item.contact_details
        }));
        
        setCompanies(transformedCompanies);
      } catch (error: any) {
        console.error("Error fetching companies:", error);
        setError(`Error loading companies: ${error.message}`);
        toast.error(`Error loading companies: ${error.message}`);
        
        // If it's a security error, we might need to redirect to login
        if (error.message?.includes('security') || error.code === '401') {
          toast.error("Please sign in again to continue");
          setTimeout(() => navigate('/signin'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, [user, refreshSession, navigate]);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.role !== "investor") {
      navigate("/founder-dashboard");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse p-8 text-center">
          <div className="w-12 h-12 border-4 border-t-[#ff4141] border-r-[#ff4141]/60 border-b-[#ff4141]/40 border-l-[#ff4141]/20 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        
        <div className="flex flex-1">
          <DashboardSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userName={user.name}
            userRole={user.role}
            sidebarItems={sidebarItems}
          />
          
          <SidebarInset className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {activeTab === "discover" && (
              <CompanyDiscovery companies={companies} isLoading={isLoading} />
            )}
            
            {activeTab === "saved" && (
              <SavedCompanies />
            )}
            
            {activeTab === "messages" && (
              <MessageInbox />
            )}
            
            {activeTab === "settings" && (
              <InvestorProfile userName={user.name} />
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InvestorDashboard;
