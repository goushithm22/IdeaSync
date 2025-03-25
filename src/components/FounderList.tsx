
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Founder {
  id: string;
  name: string;
  company: string;
  sector: string;
}

interface FounderListProps {
  founders: Founder[];
}

const FounderList: React.FC<FounderListProps> = ({ founders }) => {
  const { toast } = useToast();
  
  const handleConnect = (name: string) => {
    toast({
      title: "Connect Request",
      description: `Feature coming soon! This will request to connect with ${name}.`,
    });
  };

  if (founders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No founders found in this sector</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {founders.map((founder) => (
        <div 
          key={founder.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div>
            <h3 className="font-medium text-gray-900">{founder.name}</h3>
            <p className="text-sm text-gray-600">{founder.company} • {founder.sector}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConnect(founder.name)}
          >
            Connect
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FounderList;
