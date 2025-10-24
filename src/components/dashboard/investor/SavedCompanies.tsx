
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types";
import CompanyCard from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SavedCompanies: React.FC = () => {
  const [savedCompanies, setSavedCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSavedCompanies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching saved companies for user:", user.id);
        
        // First get the saved company IDs for this investor
        const { data: savedData, error: savedError } = await supabase
          .from('investments')
          .select('company_id')
          .eq('investor_id', user.id)
          .eq('status', 'saved');
        
        if (savedError) {
          console.error("Error fetching saved investments:", savedError);
          
          // If unauthorized, try refreshing the session
          if (savedError.code === '401' || savedError.message.includes('JWT')) {
            await refreshSession();
            throw new Error("Session refreshed. Please try again.");
          }
          
          throw savedError;
        }
        
        if (savedData && savedData.length > 0) {
          const companyIds = savedData.map(saved => saved.company_id);
          
          console.log("Found saved company IDs:", companyIds);
          
          const { data: companiesData, error: companiesError } = await supabase
            .from('companies')
            .select('*')
            .in('id', companyIds);
          
          if (companiesError) {
            console.error("Error fetching companies data:", companiesError);
            throw companiesError;
          }
          
          console.log("Fetched companies data:", companiesData ? companiesData.length : 0);
          
          // Transform database columns to match our frontend Company type
          const transformedCompanies: Company[] = (companiesData || []).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            sector: item.sector || "",
            founderId: item.founder_id,
            fundingGoal: item.funding_goal
          }));
          
          setSavedCompanies(transformedCompanies);
        } else {
          console.log("No saved companies found");
          setSavedCompanies([]);
        }
      } catch (error: any) {
        console.error("Error in fetchSavedCompanies:", error);
        setError(error.message);
        toast.error(`Error loading saved companies: ${error.message}`);
        
        // If it's a security error, we might need to redirect to login
        if (error.message?.includes('security') || error.code === '401') {
          toast.error("Please sign in again to continue");
          setTimeout(() => navigate('/signin'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedCompanies();
  }, [user, refreshSession, navigate]);

  const handleRemoveSaved = async (companyId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('company_id', companyId)
        .eq('investor_id', user.id)
        .eq('status', 'saved');
      
      if (error) throw error;
      
      toast("Company removed from saved list");
      setSavedCompanies(prev => prev.filter(company => company.id !== companyId));
    } catch (error: any) {
      console.error("Error removing saved company:", error);
      
      // Try to refresh the session if it's an auth error
      if (error.code === '401' || error.message.includes('JWT')) {
        await refreshSession();
        toast.error("Please try again");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Startups</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((placeholder) => (
            <div key={placeholder} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Startups</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Error loading saved companies</p>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Startups</h1>
      
      {savedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCompanies.map((company) => (
            <div key={company.id} className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 z-10 bg-white/90 hover:bg-white text-[#ff4141] hover:text-red-600"
                onClick={() => handleRemoveSaved(company.id)}
                title="Remove from saved"
              >
                <Star className="h-4 w-4 fill-current" />
              </Button>
              <CompanyCard company={company} showContactButton={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't saved any startups yet</p>
          <p className="text-gray-500 mt-2">Browse the Discover section to find and save interesting startups</p>
        </div>
      )}
    </div>
  );
};

export default SavedCompanies;
