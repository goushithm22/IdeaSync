
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Search, Building, Star, Settings, LogOut, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import CompanyCard from "@/components/CompanyCard";
import Header from "@/components/Header";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Schema for investor profile form validation
const investorProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot exceed 500 characters." }),
  linkedIn: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
  investmentFocus: z.string().min(5, { message: "Investment focus must be at least 5 characters." }),
  minimumInvestment: z.coerce.number().positive({ message: "Minimum investment must be a positive number." }),
  maximumInvestment: z.coerce.number().positive({ message: "Maximum investment must be a positive number." }),
});

type InvestorProfileFormValues = z.infer<typeof investorProfileSchema>;

const InvestorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [activeTab, setActiveTab] = useState("discover");
  const [profileSaved, setProfileSaved] = useState(false);
  
  // Default form values - could be loaded from localStorage or API
  const defaultValues: Partial<InvestorProfileFormValues> = {
    fullName: user?.name || "",
    bio: "",
    linkedIn: "",
    investmentFocus: "",
    minimumInvestment: 10000,
    maximumInvestment: 100000,
  };

  // Load profile data if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem("investor_profile");
    if (savedProfile) {
      setProfileSaved(true);
      const profileData = JSON.parse(savedProfile);
      form.reset(profileData);
    }
  }, []);

  // Initialize the form
  const form = useForm<InvestorProfileFormValues>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues,
  });

  // Handle form submit
  const onSubmit = (data: InvestorProfileFormValues) => {
    // Save to localStorage (in a real app, would save to database)
    localStorage.setItem("investor_profile", JSON.stringify(data));
    setProfileSaved(true);
    toast("Profile saved successfully!");
  };
  
  // Mock data loading
  useEffect(() => {
    // Mock companies data
    const mockCompanies: Company[] = [
      {
        id: "1",
        name: "TechNova Solutions",
        description: "AI-powered software solutions for enterprise businesses",
        sector: "Technology",
        founderId: "founder1",
        fundingGoal: 500000,
      },
      {
        id: "2",
        name: "MediSync",
        description: "Healthcare platform connecting patients with specialists",
        sector: "Healthcare",
        founderId: "founder2",
        fundingGoal: 750000,
      },
      {
        id: "3",
        name: "EduLearn",
        description: "Online learning platform for K-12 students",
        sector: "Education",
        founderId: "founder3",
        fundingGoal: 300000,
      },
      {
        id: "4",
        name: "FinTrack",
        description: "Financial tracking and budgeting app for small businesses",
        sector: "Finance",
        founderId: "founder4",
        fundingGoal: 400000,
      },
      {
        id: "5",
        name: "ShopSquare",
        description: "E-commerce platform for small retail businesses",
        sector: "E-commerce",
        founderId: "founder5",
        fundingGoal: 600000,
      },
    ];
    
    setCompanies(mockCompanies);
  }, []);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.role !== "investor") {
      navigate("/founder-dashboard");
    }
  }, [user, navigate]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector ? company.sector === selectedSector : true;
    return matchesSearch && matchesSector;
  });

  const sectors = [...new Set(companies.map(company => company.sector))];

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
                <h2 className="text-lg font-semibold">Investor Dashboard</h2>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "discover"}
                    onClick={() => setActiveTab("discover")}
                    tooltip="Discover Startups"
                  >
                    <Search />
                    <span>Discover Startups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "saved"}
                    onClick={() => setActiveTab("saved")}
                    tooltip="Saved Startups"
                  >
                    <Star />
                    <span>Saved Startups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                    tooltip="Settings"
                  >
                    <Settings />
                    <span>Settings</span>
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
            {activeTab === "discover" && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Discover Startups</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="md:col-span-3">
                    <Input
                      placeholder="Search companies by name or description"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <CompanyCard 
                      key={company.id} 
                      company={company} 
                      showContactButton={true} 
                    />
                  ))}
                  
                  {filteredCompanies.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === "saved" && (
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Startups</h1>
                <p className="text-gray-600">You haven't saved any startups yet</p>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-lg font-medium mb-4">Investor Profile</h2>
                  <p className="text-gray-600 mb-6">
                    Complete your investor profile to help startups understand your investment preferences.
                    {profileSaved && " Your profile has been saved."}
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description about yourself as an investor" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Share information about your background and expertise.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="linkedIn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Share your professional profile
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="investmentFocus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Focus</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What industries, technologies, or stages do you focus on?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Describe your investment interests and criteria
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minimumInvestment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Investment ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="maximumInvestment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Investment ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="mt-4">
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InvestorDashboard;

