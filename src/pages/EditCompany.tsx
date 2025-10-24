
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";
import { Company } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EditCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.role !== "founder") {
      navigate("/investor-dashboard");
    }
  }, [user, navigate]);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          toast.error("Company not found");
          navigate("/founder-dashboard");
          return;
        }
        
        // Check if user owns this company
        if (data.founder_id !== user?.id) {
          toast.error("You don't have permission to edit this company");
          navigate("/founder-dashboard");
          return;
        }
        
        // Transform database columns to match our frontend Company type
        setCompany({
          id: data.id,
          name: data.name,
          description: data.description || "",
          sector: data.sector || "",
          founderId: data.founder_id,
          fundingGoal: data.funding_goal
        });
      } catch (error: any) {
        console.error("Error fetching company:", error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, user, navigate]);

  const handleSaveCompany = (companyData: Omit<Company, "id" | "founderId">) => {
    // This function is kept for compatibility with the CompanyForm component
    // The actual save is now handled in the CompanyForm component
    setIsSubmitting(true);
    
    // Mock saving the company
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  if (!user || isLoading) {
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
    <div className="min-h-screen flex flex-col bg-gray-50 animate-fade-in">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate("/founder-dashboard")} 
            className="mb-4 flex items-center text-gray-600 hover:text-[#ff4141] transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
          </button>
          
          <Card className="border-[#ff4141]/10 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <Building className="h-5 w-5 text-[#ff4141]" />
                <span>Edit Company</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {company && (
                <CompanyForm 
                  onSave={handleSaveCompany} 
                  isLoading={isSubmitting}
                  initialData={company}
                  isEditing={true} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;
