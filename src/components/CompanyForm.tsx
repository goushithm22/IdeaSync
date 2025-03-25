
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Company } from "@/types";

interface CompanyFormProps {
  onSave: (company: Omit<Company, "id" | "founderId">) => void;
  isLoading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSave, isLoading = false }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [fundingGoal, setFundingGoal] = useState<number | undefined>(undefined);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !sector) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      name,
      description,
      sector,
      fundingGoal,
    });
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
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Company"}
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
