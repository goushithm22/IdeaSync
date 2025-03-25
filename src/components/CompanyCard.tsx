
import React from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CompanyCardProps {
  company: Company;
  showContactButton?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, showContactButton = false }) => {
  const { toast } = useToast();
  
  const handleGetContact = () => {
    toast({
      title: "Contact Details",
      description: "Feature coming soon! This will require payment to unlock contact details.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
      <div className="flex items-center mb-3">
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
          {company.sector}
        </span>
        {company.fundingGoal && (
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 ml-2">
            ${company.fundingGoal.toLocaleString()} funding goal
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-4">{company.description}</p>
      
      {showContactButton && (
        <Button 
          onClick={handleGetContact}
          className="w-full text-white"
          style={{ backgroundColor: "#ff4141" }}
        >
          Get Contact Details
        </Button>
      )}
    </div>
  );
};

export default CompanyCard;
