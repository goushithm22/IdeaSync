
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import AnimatedSvg from "@/components/AnimatedSvg";
import { ArrowRight, Star, DollarSign, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between">
          {/* Left column - Text content */}
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              <span className="text-[#ff4141]">idea</span>sync
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-lg">
              Connecting innovative founders with visionary investors.
            </p>
            <p className="text-lg text-gray-600 max-w-lg">
              Find the perfect match to bring your ideas to life or discover the next big opportunity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-[#ff4141] hover:bg-[#ff4141]/90 text-white transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex gap-2"
                onClick={() => navigate("/register")}
              >
                Get Started <ArrowRight className="animate-pulse" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#ff4141] text-[#ff4141] hover:bg-[#ff4141]/10 transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>
          
          {/* Right column - SVG Animation */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center animate-fade-in">
            <AnimatedSvg />
          </div>
        </div>
      </main>
      
      {/* Feature section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How <span className="text-[#ff4141]">idea</span>sync Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-[#ff4141]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff4141]">
                <Star className="animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up as a founder or investor and build your professional profile.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-[#ff4141]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff4141]">
                <Zap className="animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Discover potential matches based on your interests and expertise.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-[#ff4141]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff4141]">
                <DollarSign className="animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Exchange contact details and turn ideas into successful ventures.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial section with the accent color */}
      <section className="py-16 bg-gradient-to-r from-white to-[#ff4141]/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Success Stories</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:border-[#ff4141]/20">
              <p className="text-xl text-gray-600 italic mb-6">
                "ideasync helped me find the perfect investor who not only funded my startup but also brought invaluable industry expertise."
              </p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-[#ff4141]/80 rounded-full"></div>
                <div className="ml-4 text-left">
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-[#ff4141]">Founder, TechNova</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-8 border-none text-white transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg" 
              style={{ backgroundColor: "#ff4141" }}
              onClick={() => navigate("/register")}
            >
              Join ideasync Today
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">© 2023 <span className="text-[#ff4141]">idea</span>sync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
