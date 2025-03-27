
import React from "react";
import { Users, Lightbulb, DollarSign, ArrowRight } from "lucide-react";

const AnimatedSvg = () => {
  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-center">
      <svg 
        width="100%" 
        height="300" 
        viewBox="0 0 500 300" 
        className="max-w-full"
      >
        {/* Background */}
        <rect width="500" height="300" fill="white" rx="8" ry="8" />
        
        {/* Main Circle */}
        <circle cx="250" cy="150" r="120" fill="#f8f8f8" stroke="#ff4141" strokeWidth="2" strokeDasharray="4,2" />
        
        {/* Central Platform */}
        <circle cx="250" cy="150" r="40" fill="#ff4141" />
        <text x="250" y="155" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">ideasync</text>
        
        {/* Founders Node */}
        <circle cx="160" cy="150" r="30" fill="white" stroke="#ff4141" strokeWidth="2" />
        
        {/* Investors Node */}
        <circle cx="340" cy="150" r="30" fill="white" stroke="#ff4141" strokeWidth="2" />
        
        {/* Ideas Node */}
        <circle cx="250" cy="60" r="30" fill="white" stroke="#ff4141" strokeWidth="2" />
        
        {/* Investment Node */}
        <circle cx="250" cy="240" r="30" fill="white" stroke="#ff4141" strokeWidth="2" />
        
        {/* Connecting Lines */}
        <path d="M 190,150 L 210,150" stroke="#ff4141" strokeWidth="2" />
        <path d="M 290,150 L 310,150" stroke="#ff4141" strokeWidth="2" />
        <path d="M 250,90 L 250,110" stroke="#ff4141" strokeWidth="2" />
        <path d="M 250,190 L 250,210" stroke="#ff4141" strokeWidth="2" />
        
        {/* Arrows on Lines */}
        <circle cx="205" cy="150" r="3" fill="#ff4141" />
        <circle cx="295" cy="150" r="3" fill="#ff4141" />
        <circle cx="250" cy="105" r="3" fill="#ff4141" />
        <circle cx="250" cy="195" r="3" fill="#ff4141" />
        
        {/* Icons */}
        <svg x="145" y="135" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M17 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2m1 10.25a11 11 0 1 0-14 0M14 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" 
            stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        
        <svg x="325" y="135" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M12 8a4 4 0 0 1 8 0M18 16a4 4 0 0 0-8 0m-.7 7 8.7 3.3 8.7-3.3M12 16c-2.76 0-5 2.24-5 5v2h10v-2c0-2.76-2.24-5-5-5Z" 
            stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        
        <svg x="235" y="45" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" 
            stroke="#333" strokeWidth="2" fill="none" />
          <path d="M10 22v-1h4v1m-2-7v3" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
        
        <svg x="235" y="225" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M12 2v20m4-16 4-4-4 4-4-4 4 4Z" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
        
        {/* Labels */}
        <text x="160" y="195" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">Founders</text>
        <text x="340" y="195" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">Investors</text>
        <text x="250" y="30" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">Ideas</text>
        <text x="250" y="280" fontSize="12" fontWeight="bold" fill="#333" textAnchor="middle">Investment</text>
      </svg>
    </div>
  );
};

export default AnimatedSvg;
