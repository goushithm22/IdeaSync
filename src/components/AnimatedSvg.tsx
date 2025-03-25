
import React, { useEffect, useRef } from "react";

const AnimatedSvg = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Add animation logic here
    const icons = svg.querySelectorAll('.icon');
    
    icons.forEach((icon, index) => {
      // Create animation
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0.8;1;0.8');
      animateOpacity.setAttribute('dur', '3s');
      animateOpacity.setAttribute('begin', `${index * 0.5}s`);
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      icon.appendChild(animateOpacity);
      
      // Add hover effect handler
      icon.addEventListener('mouseenter', () => {
        icon.setAttribute('opacity', '1');
        icon.setAttribute('transform', 'scale(1.1)');
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.setAttribute('opacity', '0.8');
        icon.setAttribute('transform', 'scale(1)');
      });
    });
    
  }, []);
  
  return (
    <svg 
      ref={svgRef}
      width="500" 
      height="500" 
      viewBox="0 0 500 500" 
      className="w-full max-w-md mx-auto"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {/* Center circle with "IS" */}
      <circle cx="250" cy="250" r="50" fill="#fff0f0" />
      <circle cx="250" cy="250" r="40" fill="#ffdddd" />
      <circle cx="250" cy="250" r="30" fill="#ff4141" opacity="0.6" />
      <text x="250" y="258" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">IS</text>
      
      {/* Outer circle */}
      <circle cx="250" cy="250" r="180" fill="none" stroke="#f0f0f0" strokeWidth="1" />
      
      {/* Small decorative circles */}
      <circle cx="300" cy="150" r="3" fill="#e0e0e0" />
      <circle cx="350" cy="320" r="4" fill="#e0e0e0" />
      <circle cx="150" cy="350" r="3" fill="#e0e0e0" />
      <circle cx="200" cy="100" r="2" fill="#e0e0e0" />
      <circle cx="400" cy="250" r="2" fill="#e0e0e0" />
      
      {/* User icon (top) */}
      <g className="icon" opacity="0.8" transform="translate(250, 100)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <path d="M-8,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0" fill="#333" />
        <path d="M8,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0" fill="#333" />
      </g>
      
      {/* Heart icon (left) */}
      <g className="icon" opacity="0.8" transform="translate(120, 190)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <path d="M0,10 L-14,-6 Q-20,-12 -14,-18 T0,-6 L0,-6 L0,-6 Q6,-12 12,-6 T0,10" fill="#333" />
      </g>
      
      {/* Money icon (bottom left) */}
      <g className="icon" opacity="0.8" transform="translate(120, 310)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <text x="0" y="8" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">$</text>
      </g>
      
      {/* Target icon (bottom) */}
      <g className="icon" opacity="0.8" transform="translate(250, 400)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <circle cx="0" cy="0" r="20" fill="none" stroke="#333" strokeWidth="2" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="#333" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="#333" />
      </g>
      
      {/* Rocket icon (bottom right) */}
      <g className="icon" opacity="0.8" transform="translate(380, 310)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <path d="M-5,-15 L0,-20 L5,-15 L5,5 L-5,5 Z" fill="#333" />
        <path d="M-8,5 L-5,15 L0,10 L5,15 L8,5 Z" fill="#333" />
      </g>
      
      {/* Graph icon (right) */}
      <g className="icon" opacity="0.8" transform="translate(380, 190)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <path d="M-15,10 L-5,-5 L5,5 L15,-10" fill="none" stroke="#333" strokeWidth="2" />
      </g>
      
      {/* Briefcase icon (top right) */}
      <g className="icon" opacity="0.8" transform="translate(370, 120)" style={{ transition: "all 0.3s ease" }}>
        <circle cx="0" cy="0" r="30" fill="#f8f8f8" />
        <path d="M-12,-5 L-12,15 L12,15 L12,-5 Z" fill="none" stroke="#333" strokeWidth="2" />
        <path d="M-5,-5 L-5,-10 L5,-10 L5,-5" fill="none" stroke="#333" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default AnimatedSvg;
