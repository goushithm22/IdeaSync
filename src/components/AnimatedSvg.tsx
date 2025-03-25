
import React, { useEffect, useRef } from "react";

const AnimatedSvg = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Add animation logic here
    const nodes = svg.querySelectorAll('.node');
    const links = svg.querySelectorAll('.link');
    
    // Animate nodes
    nodes.forEach((node, index) => {
      // Create animation for nodes
      const animatePulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animatePulse.setAttribute('attributeName', 'r');
      animatePulse.setAttribute('values', '6;8;6');
      animatePulse.setAttribute('dur', '3s');
      animatePulse.setAttribute('begin', `${index * 0.5}s`);
      animatePulse.setAttribute('repeatCount', 'indefinite');
      
      node.appendChild(animatePulse);
      
      // Add hover effect handler
      node.addEventListener('mouseenter', () => {
        node.setAttribute('r', '10');
        node.setAttribute('fill', '#ff4141');
      });
      
      node.addEventListener('mouseleave', () => {
        node.setAttribute('r', '6');
        node.setAttribute('fill', '#666');
      });
    });
    
    // Animate links
    links.forEach((link, index) => {
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0.2;0.5;0.2');
      animateOpacity.setAttribute('dur', '4s');
      animateOpacity.setAttribute('begin', `${index * 0.3}s`);
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      link.appendChild(animateOpacity);
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
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#eee" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Central Circle - ideasync */}
      <circle cx="250" cy="250" r="30" fill="#ff4141" className="node" />
      <text x="250" y="255" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">IS</text>
      
      {/* Surrounding small circles */}
      <circle cx="150" cy="150" r="10" fill="#666" className="node" />
      <circle cx="350" cy="150" r="10" fill="#666" className="node" />
      <circle cx="150" cy="350" r="10" fill="#666" className="node" />
      <circle cx="350" cy="350" r="10" fill="#666" className="node" />
      <circle cx="100" cy="250" r="10" fill="#666" className="node" />
      <circle cx="400" cy="250" r="10" fill="#666" className="node" />
      
      {/* Text labels */}
      <text x="150" y="135" fontSize="10" fill="#666" textAnchor="middle">Investor</text>
      <text x="350" y="135" fontSize="10" fill="#666" textAnchor="middle">Founder</text>
      <text x="150" y="370" fontSize="10" fill="#666" textAnchor="middle">Investor</text>
      <text x="350" y="370" fontSize="10" fill="#666" textAnchor="middle">Founder</text>
      <text x="85" y="235" fontSize="10" fill="#666" textAnchor="middle">Investor</text>
      <text x="415" y="235" fontSize="10" fill="#666" textAnchor="middle">Founder</text>
      
      {/* Connecting lines to center */}
      <line x1="150" y1="150" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      <line x1="350" y1="150" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      <line x1="150" y1="350" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      <line x1="350" y1="350" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      <line x1="100" y1="250" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      <line x1="400" y1="250" x2="250" y2="250" stroke="#ccc" strokeWidth="1" opacity="0.7" className="link" />
      
      {/* Connecting lines between investors and founders */}
      <line x1="150" y1="150" x2="350" y2="150" stroke="#ff4141" strokeWidth="1" strokeDasharray="5 3" opacity="0.5" className="link" />
      <line x1="150" y1="350" x2="350" y2="350" stroke="#ff4141" strokeWidth="1" strokeDasharray="5 3" opacity="0.5" className="link" />
      <line x1="100" y1="250" x2="400" y2="250" stroke="#ff4141" strokeWidth="1" strokeDasharray="5 3" opacity="0.5" className="link" />
      
      {/* Dollar symbols near connecting lines */}
      <text x="250" y="145" fontSize="12" fill="#ff4141" textAnchor="middle">$</text>
      <text x="250" y="355" fontSize="12" fill="#ff4141" textAnchor="middle">$</text>
      <text x="250" y="235" fontSize="12" fill="#ff4141" textAnchor="middle">$</text>
    </svg>
  );
};

export default AnimatedSvg;
