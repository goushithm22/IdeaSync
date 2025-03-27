
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
        
        {/* Connecting Line */}
        <path 
          d="M 120,150 L 380,150" 
          stroke="#ff4141" 
          strokeWidth="3" 
          strokeDasharray="10,5" 
        />
        
        {/* Founder Circle */}
        <circle cx="120" cy="150" r="60" fill="#f8f8f8" stroke="#ff4141" strokeWidth="2" />
        
        {/* Investor Circle */}
        <circle cx="380" cy="150" r="60" fill="#f8f8f8" stroke="#ff4141" strokeWidth="2" />
        
        {/* Center Platform */}
        <circle cx="250" cy="150" r="40" fill="#ff4141" />
        <text x="250" y="155" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">ideasync</text>
        
        {/* Icons */}
        <svg x="95" y="125" width="50" height="50">
          <rect width="50" height="50" fill="none" />
          <path d="M17 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2m1 10.25a11 11 0 1 0-14 0M14 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" 
            stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        
        <svg x="355" y="125" width="50" height="50">
          <rect width="50" height="50" fill="none" />
          <path d="M12 8a4 4 0 0 1 8 0M18 16a4 4 0 0 0-8 0m-.7 7 8.7 3.3 8.7-3.3M12 16c-2.76 0-5 2.24-5 5v2h10v-2c0-2.76-2.24-5-5-5Z" 
            stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        
        <svg x="230" y="100" width="40" height="40">
          <rect width="40" height="40" fill="none" />
          <path d="M12 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M6 12H3v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8h-3" 
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        
        {/* Labels */}
        <text x="120" y="230" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle">Founders</text>
        <text x="380" y="230" fontSize="14" fontWeight="bold" fill="#333" textAnchor="middle">Investors</text>
        
        {/* Arrows */}
        <path d="M 180,150 L 210,150" stroke="#ff4141" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <path d="M 290,150 L 320,150" stroke="#ff4141" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Arrow Marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff4141" />
          </marker>
        </defs>
        
        {/* Ideas & Investment */}
        <text x="90" y="100" fontSize="12" fill="#333" textAnchor="middle">Ideas</text>
        <text x="410" y="100" fontSize="12" fill="#333" textAnchor="middle">Investment</text>
        
        <svg x="75" y="70" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" 
            stroke="#ff4141" strokeWidth="2" fill="#fff" />
          <path d="M10 22v-1h4v1m-2-7v3" stroke="#ff4141" strokeWidth="2" fill="none" />
        </svg>
        
        <svg x="395" y="70" width="30" height="30">
          <rect width="30" height="30" fill="none" />
          <path d="M12 2v20m4-16 4-4-4 4-4-4 4 4Z" stroke="#ff4141" strokeWidth="2" fill="none" />
        </svg>
      </svg>
    </div>
  );
};

export default AnimatedSvg;
