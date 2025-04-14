
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Schema for investor profile form validation
const investorProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot exceed 500 characters." }),
  linkedIn: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
  investmentFocus: z.string().min(5, { message: "Investment focus must be at least 5 characters." }),
  minimumInvestment: z.coerce.number().positive({ message: "Minimum investment must be a positive number." }),
  maximumInvestment: z.coerce.number().positive({ message: "Maximum investment must be a positive number." }),
});

export type InvestorProfileFormValues = z.infer<typeof investorProfileSchema>;

interface InvestorProfileProps {
  userName: string | undefined;
}

const InvestorProfile: React.FC<InvestorProfileProps> = ({ userName }) => {
  const [profileSaved, setProfileSaved] = useState(false);
  
  // Default form values - could be loaded from localStorage or API
  const defaultValues: Partial<InvestorProfileFormValues> = {
    fullName: userName || "",
    bio: "",
    linkedIn: "",
    investmentFocus: "",
    minimumInvestment: 10000,
    maximumInvestment: 100000,
  };

  // Initialize the form
  const form = useForm<InvestorProfileFormValues>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues,
  });

  // Load profile data if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem("investor_profile");
    if (savedProfile) {
      setProfileSaved(true);
      const profileData = JSON.parse(savedProfile);
      form.reset(profileData);
    }
  }, [form]);

  // Handle form submit
  const onSubmit = (data: InvestorProfileFormValues) => {
    // Save to localStorage (in a real app, would save to database)
    localStorage.setItem("investor_profile", JSON.stringify(data));
    setProfileSaved(true);
    toast("Profile saved successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Investor Profile</h2>
        <p className="text-gray-600 mb-6">
          Complete your investor profile to help startups understand your investment preferences.
          {profileSaved && " Your profile has been saved."}
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description about yourself as an investor" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Share information about your background and expertise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: Share your professional profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investmentFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Focus</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What industries, technologies, or stages do you focus on?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your investment interests and criteria
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minimumInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Investment ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maximumInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Investment ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvestorProfile;
