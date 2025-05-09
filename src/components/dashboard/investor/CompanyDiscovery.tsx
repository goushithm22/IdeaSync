
import React, { useState } from "react";
import { Company } from "@/types";
import { Input } from "@/components/ui/input";
import CompanyCard from "@/components/CompanyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyDiscoveryProps {
  companies: Company[];
  isLoading: boolean;
}

const CompanyDiscovery: React.FC<CompanyDiscoveryProps> = ({ companies, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");

  const sectors = [...new Set(companies.map(company => company.sector))].filter(Boolean);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      company.description?.toLowerCase().includes(searchTerm.toLowerCase() || "");
    const matchesSector = selectedSector === "all" ? true : company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
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
        
        <Select
          value={selectedSector}
          onValueChange={setSelectedSector}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((sector) => (
              sector && <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <div key={placeholder} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </>
  );
};

export default CompanyDiscovery;
