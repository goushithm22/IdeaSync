
import React from "react";
import { Users, Lightbulb, DollarSign, ArrowRight } from "lucide-react";

const AnimatedSvg = () => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <svg 
        width="100%" 
        height="300" 
        viewBox="0 0 500 300" 
        className="max-w-full"
      >
        {/* Background */}
        <rect width="500" height="300" fill="white" rx="12" ry="12" />
        
        {/* Main Circle */}
        <circle cx="250" cy="150" r="120" fill="#f9f9f9" stroke="#ff4141" strokeWidth="1.5" strokeDasharray="4,2" />
        
        {/* Central Platform */}
        <circle cx="250" cy="150" r="35" fill="#ff4141" />
        <text x="250" y="155" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">ideasync</text>
        
        {/* Nodes - Clean simplified style */}
        <circle cx="160" cy="150" r="25" fill="white" stroke="#ff4141" strokeWidth="1.5" />
        <circle cx="340" cy="150" r="25" fill="white" stroke="#ff4141" strokeWidth="1.5" />
        <circle cx="250" cy="60" r="25" fill="white" stroke="#ff4141" strokeWidth="1.5" />
        <circle cx="250" cy="240" r="25" fill="white" stroke="#ff4141" strokeWidth="1.5" />
        
        {/* Connecting Lines - Thinner, cleaner */}
        <path d="M 185,150 L 215,150" stroke="#ff4141" strokeWidth="1.5" />
        <path d="M 285,150 L 315,150" stroke="#ff4141" strokeWidth="1.5" />
        <path d="M 250,85 L 250,115" stroke="#ff4141" strokeWidth="1.5" />
        <path d="M 250,185 L 250,215" stroke="#ff4141" strokeWidth="1.5" />
        
        {/* Direction indicators - Small circles */}
        <circle cx="205" cy="150" r="3" fill="#ff4141" />
        <circle cx="295" cy="150" r="3" fill="#ff4141" />
        <circle cx="250" cy="105" r="3" fill="#ff4141" />
        <circle cx="250" cy="195" r="3" fill="#ff4141" />
        
        {/* Icons - Clean and minimal */}
        <svg x="147" y="137" width="26" height="26">
          <Users size={26} stroke="#555" strokeWidth={1.5} />
        </svg>
        
        <svg x="327" y="137" width="26" height="26">
          <Users size={26} stroke="#555" strokeWidth={1.5} />
        </svg>
        
        <svg x="237" y="47" width="26" height="26">
          <Lightbulb size={26} stroke="#555" strokeWidth={1.5} />
        </svg>
        
        <svg x="237" y="227" width="26" height="26">
          <DollarSign size={26} stroke="#555" strokeWidth={1.5} />
        </svg>
        
        {/* Labels - Smaller, cleaner font */}
        <text x="160" y="190" fontSize="11" fill="#555" textAnchor="middle">Founders</text>
        <text x="340" y="190" fontSize="11" fill="#555" textAnchor="middle">Investors</text>
        <text x="250" y="35" fontSize="11" fill="#555" textAnchor="middle">Ideas</text>
        <text x="250" y="275" fontSize="11" fill="#555" textAnchor="middle">Investment</text>
      </svg>
    </div>
  );
};

export default AnimatedSvg;
