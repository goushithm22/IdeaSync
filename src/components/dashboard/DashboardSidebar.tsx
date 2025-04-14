
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string | undefined;
  userRole: string | undefined;
  sidebarItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
    tooltip: string;
  }[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  userName, 
  userRole,
  sidebarItems 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-lg font-semibold">{userRole === "investor" ? "Investor" : "Founder"} Dashboard</h2>
          <p className="text-sm text-gray-500">{userName}</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                tooltip={item.tooltip}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {
                logout();
                navigate("/");
              }}
              tooltip="Logout"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
