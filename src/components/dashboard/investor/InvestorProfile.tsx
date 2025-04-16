
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, Check, X, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

// Schema for investor profile form validation
const investorProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot exceed 500 characters." }),
  linkedIn: z
    .string()
    .url({ message: "Please enter a valid LinkedIn URL." })
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.includes("linkedin.com/in/"),
      { message: "LinkedIn URL must be in format: linkedin.com/in/username" }
    ),
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
  const [isVerifyingLinkedIn, setIsVerifyingLinkedIn] = useState(false);
  const [linkedInVerified, setLinkedInVerified] = useState(false);
  
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
      
      // Check if LinkedIn was previously verified
      if (localStorage.getItem("linkedin_verified") === "true") {
        setLinkedInVerified(true);
      }
    }
  }, [form]);

  // Handle form submit
  const onSubmit = (data: InvestorProfileFormValues) => {
    // Save to localStorage (in a real app, would save to database)
    localStorage.setItem("investor_profile", JSON.stringify(data));
    setProfileSaved(true);
    toast("Profile saved successfully!");
  };
  
  // Handle LinkedIn verification
  const verifyLinkedIn = async () => {
    const linkedInUrl = form.getValues("linkedIn");
    
    if (!linkedInUrl) {
      toast("Please enter a LinkedIn URL first");
      return;
    }
    
    setIsVerifyingLinkedIn(true);
    
    try {
      // Simulate verification process - in a real app this would check the URL
      // through a backend service that validates the user owns the profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation - check if URL is properly formatted
      if (linkedInUrl.includes("linkedin.com/in/")) {
        setLinkedInVerified(true);
        localStorage.setItem("linkedin_verified", "true");
        toast("LinkedIn profile verified successfully!");
      } else {
        toast("Invalid LinkedIn URL format. Must be linkedin.com/in/username", {
          style: { backgroundColor: "#fecaca", color: "#7f1d1d" }
        });
      }
    } catch (error) {
      console.error("LinkedIn verification error:", error);
      toast("Failed to verify LinkedIn profile. Please try again.");
    } finally {
      setIsVerifyingLinkedIn(false);
    }
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
                  <FormLabel className="flex items-center gap-2">
                    LinkedIn URL
                    {linkedInVerified && 
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verified
                      </Badge>
                    }
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="https://linkedin.com/in/yourprofile" 
                        {...field} 
                        className={linkedInVerified ? "border-green-500 focus-visible:ring-green-500" : ""}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={verifyLinkedIn}
                      disabled={isVerifyingLinkedIn || !field.value}
                      className={linkedInVerified ? "border-green-500 text-green-700" : ""}
                    >
                      {isVerifyingLinkedIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : linkedInVerified ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Verify your LinkedIn profile to build trust with founders
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
