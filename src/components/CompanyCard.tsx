
import React from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Star, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CompanyCardProps {
  company: Company;
  showContactButton?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, showContactButton = false }) => {
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user || user.role !== "investor") return;
    
    const checkIfSaved = async () => {
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('company_id', company.id)
          .eq('investor_id', user.id)
          .eq('status', 'saved')
          .maybeSingle();
        
        if (error) throw error;
        setIsSaved(!!data);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    
    checkIfSaved();
  }, [company.id, user]);
  
  const handleGetContact = () => {
    uiToast({
      title: "Contact Details",
      description: "Feature coming soon! This will require payment to unlock contact details.",
    });
  };
  
  const handleSaveToggle = async () => {
    if (!user) {
      toast("Please sign in to save companies");
      return;
    }
    
    if (user.role !== "investor") {
      toast("Only investors can save companies");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('investments')
          .delete()
          .eq('company_id', company.id)
          .eq('investor_id', user.id)
          .eq('status', 'saved');
        
        if (error) throw error;
        toast("Company removed from saved list");
        setIsSaved(false);
      } else {
        // Add to saved
        const { error } = await supabase
          .from('investments')
          .insert({
            company_id: company.id,
            investor_id: user.id,
            amount: 0, // No investment amount yet
            status: 'saved' // Just saved, not invested yet
          });
        
        if (error) throw error;
        toast("Company saved to your list");
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error("Error saving company:", error);
      toast(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/founder-dashboard/edit-company/${company.id}`);
  };

  const isOwner = user && user.id === company.founderId;

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
        
        {user && user.role === "investor" && (
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-3 text-xs ${isSaved ? 'text-[#ff4141] border-[#ff4141]/30' : 'text-gray-500'}`}
            onClick={handleSaveToggle}
            disabled={isLoading}
          >
            <Star className={`h-3 w-3 mr-1 ${isSaved ? 'fill-[#ff4141]' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        )}

        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs text-gray-700 hover:text-[#ff4141]"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
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
