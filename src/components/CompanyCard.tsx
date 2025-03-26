
import React from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Users } from "lucide-react";

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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-[#ff4141]/30 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
        {company.fundingGoal && (
          <span className="inline-block bg-[#ff4141]/10 rounded-full px-3 py-1 text-xs font-semibold text-[#ff4141] flex items-center animate-pulse">
            <DollarSign className="h-3 w-3 mr-1" /> {company.fundingGoal.toLocaleString()}
          </span>
        )}
      </div>
      
      <div className="flex items-center mb-3 gap-2">
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1 text-[#ff4141]" /> {company.sector}
        </span>
        {company.founders && (
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 flex items-center">
            <Users className="h-3 w-3 mr-1 text-[#ff4141]" /> {company.founders} founders
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{company.description}</p>
      
      {showContactButton && (
        <Button 
          onClick={handleGetContact}
          className="w-full text-white transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff4141] to-[#ff6b41]"
        >
          Get Contact Details <DollarSign className="h-4 w-4 animate-pulse" />
        </Button>
      )}
    </div>
  );
};

export default CompanyCard;
