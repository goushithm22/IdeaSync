
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";
import { Company } from "@/types";

const NewCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.role !== "founder") {
      navigate("/investor-dashboard");
    }
  }, [user, navigate]);

  const handleSaveCompany = (companyData: Omit<Company, "id" | "founderId">) => {
    setIsSubmitting(true);
    
    // Mock saving the company
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Company saved successfully",
      });
      setIsSubmitting(false);
      navigate("/founder-dashboard");
    }, 1000);
  };

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Company</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <CompanyForm onSave={handleSaveCompany} isLoading={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCompany;
