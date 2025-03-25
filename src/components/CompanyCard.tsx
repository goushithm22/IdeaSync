
import React from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] hover:border-[#ff4141]/20">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
      <div className="flex items-center mb-3">
        <span className="inline-block bg-[#ff4141]/10 rounded-full px-3 py-1 text-xs font-semibold text-[#ff4141]">
          {company.sector}
        </span>
        {company.fundingGoal && (
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 ml-2 flex items-center">
            <DollarSign className="h-3 w-3 mr-1 text-[#ff4141]" /> {company.fundingGoal.toLocaleString()} funding goal
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-4">{company.description}</p>
      
      {showContactButton && (
        <Button 
          onClick={handleGetContact}
          className="w-full text-white transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: "#ff4141" }}
        >
          Get Contact Details <DollarSign className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CompanyCard;
