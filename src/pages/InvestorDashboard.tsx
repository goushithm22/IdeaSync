
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Search, Star, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Company } from "@/types";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import the new components
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CompanyDiscovery from "@/components/dashboard/investor/CompanyDiscovery";
import SavedCompanies from "@/components/dashboard/investor/SavedCompanies";
import InvestorProfile from "@/components/dashboard/investor/InvestorProfile";

const InvestorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isLoading, setIsLoading] = useState(true);

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
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform database columns to match our frontend Company type
        const transformedCompanies: Company[] = data.map(item => ({
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
        toast(`Error loading companies: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, [user]);

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
            {activeTab === "discover" && (
              <CompanyDiscovery companies={companies} isLoading={isLoading} />
            )}
            
            {activeTab === "saved" && (
              <SavedCompanies />
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
