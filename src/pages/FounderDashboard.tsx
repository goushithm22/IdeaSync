
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CompanyCard from "@/components/CompanyCard";
import FounderList from "@/components/FounderList";
import Header from "@/components/Header";
import { Company } from "@/types";

const FounderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [founders, setFounders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("companies");

  // Mock data loading
  useEffect(() => {
    // Mock companies data
    const mockCompanies: Company[] = [
      {
        id: "1",
        name: "TechNova Solutions",
        description: "AI-powered software solutions for enterprise businesses",
        sector: "Technology",
        founderId: user?.id || "",
        fundingGoal: 500000,
      },
    ];
    
    // Mock founders data in the same sector
    const mockFounders = [
      {
        id: "f1",
        name: "Alex Johnson",
        company: "DataMinds",
        sector: "Technology",
      },
      {
        id: "f2",
        name: "Sophia Chang",
        company: "CloudScale",
        sector: "Technology",
      },
      {
        id: "f3",
        name: "Michael Wei",
        company: "SecureNet",
        sector: "Technology",
      },
    ];
    
    setCompanies(mockCompanies);
    setFounders(mockFounders);
  }, [user]);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.role !== "founder") {
      navigate("/investor-dashboard");
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        
        <div className="flex flex-1">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <div className="p-2">
                <h2 className="text-lg font-semibold">Founder Dashboard</h2>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "companies"}
                    onClick={() => setActiveTab("companies")}
                    tooltip="My Companies"
                  >
                    <Building />
                    <span>My Companies</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "founders"}
                    onClick={() => setActiveTab("founders")}
                    tooltip="Other Founders"
                  >
                    <Users />
                    <span>Other Founders</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    tooltip="Logout"
                  >
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "companies" ? "My Companies" : "Other Founders"}
              </h1>
              
              {activeTab === "companies" && (
                <Button
                  onClick={() => navigate("/founder-dashboard/new-company")}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Company
                </Button>
              )}
            </div>
            
            {activeTab === "companies" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                    <p className="text-gray-600 mb-6">Add your first company to get started</p>
                    <Button
                      onClick={() => navigate("/founder-dashboard/new-company")}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Company
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <FounderList founders={founders} />
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FounderDashboard;
