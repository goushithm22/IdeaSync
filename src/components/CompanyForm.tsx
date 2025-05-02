
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Company } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CompanyFormProps {
  onSave: (company: Omit<Company, "id" | "founderId">) => void;
  isLoading?: boolean;
  initialData?: Company;
  isEditing?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  onSave, 
  isLoading = false,
  initialData,
  isEditing = false
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sector, setSector] = useState(initialData?.sector || "");
  const [fundingGoal, setFundingGoal] = useState<number | undefined>(initialData?.fundingGoal);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();

  // Update form fields if initialData changes (e.g., when data is loaded)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setSector(initialData.sector || "");
      setFundingGoal(initialData.fundingGoal);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a company",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !description || !sector) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    // Create the company object
    const companyData = {
      name,
      description,
      sector,
      funding_goal: fundingGoal,
      founder_id: user.id
    };
    
    try {
      if (isEditing && initialData) {
        // Update existing company
        const { data, error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', initialData.id)
          .select();
        
        if (error) {
          throw error;
        }
        
        toast.success("Company updated successfully");
      } else {
        // Insert new company
        const { data, error } = await supabase
          .from('companies')
          .insert(companyData)
          .select();
        
        if (error) {
          throw error;
        }
        
        toast.success("Company saved successfully");
      }
      
      // Call the onSave prop to maintain compatibility
      onSave({
        name,
        description,
        sector,
        fundingGoal,
      });
      
      navigate("/founder-dashboard");
    } catch (error: any) {
      console.error("Error saving company:", error);
      toast.error(error.message || "Failed to save company");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sector">Sector *</Label>
        <select
          id="sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select a sector</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Real Estate">Real Estate</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
        <Input
          id="fundingGoal"
          type="number"
          min="0"
          value={fundingGoal || ""}
          onChange={(e) => setFundingGoal(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          className="bg-gray-900 hover:bg-gray-800 text-white" 
          disabled={isLoading || submitting}
        >
          {submitting ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Company" : "Save Company")}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/founder-dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
