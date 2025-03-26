
import React, { useEffect, useRef } from "react";

const AnimatedSvg = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Add animation logic for interactive elements
    const founderNodes = svg.querySelectorAll('.founder-node');
    const investorNodes = svg.querySelectorAll('.investor-node');
    const connectionLines = svg.querySelectorAll('.connection-line');
    const ideaElements = svg.querySelectorAll('.idea-element');
    const dollarElements = svg.querySelectorAll('.dollar-element');
    
    // Animate founders and investors
    [...founderNodes, ...investorNodes].forEach((node, index) => {
      // Create floating animation
      const animateFloat = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateFloat.setAttribute('attributeName', 'cy');
      animateFloat.setAttribute('values', `${node.getAttribute('cy')};${Number(node.getAttribute('cy')) - 10};${node.getAttribute('cy')}`);
      animateFloat.setAttribute('dur', '3s');
      animateFloat.setAttribute('begin', `${index * 0.5}s`);
      animateFloat.setAttribute('repeatCount', 'indefinite');
      
      // Create pulse animation
      const animatePulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animatePulse.setAttribute('attributeName', 'r');
      animatePulse.setAttribute('values', '8;10;8');
      animatePulse.setAttribute('dur', '2s');
      animatePulse.setAttribute('begin', `${index * 0.3}s`);
      animatePulse.setAttribute('repeatCount', 'indefinite');
      
      node.appendChild(animateFloat);
      node.appendChild(animatePulse);
    });
    
    // Animate connecting lines
    connectionLines.forEach((line, index) => {
      const animateDash = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateDash.setAttribute('attributeName', 'stroke-dashoffset');
      animateDash.setAttribute('values', '30;0;30');
      animateDash.setAttribute('dur', '4s');
      animateDash.setAttribute('begin', `${index * 0.2}s`);
      animateDash.setAttribute('repeatCount', 'indefinite');
      
      line.appendChild(animateDash);
    });
    
    // Animate idea elements (lightbulbs)
    ideaElements.forEach((idea, index) => {
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0.7;1;0.7');
      animateOpacity.setAttribute('dur', '2s');
      animateOpacity.setAttribute('begin', `${index * 0.5}s`);
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      idea.appendChild(animateOpacity);
    });
    
    // Animate dollar elements
    dollarElements.forEach((dollar, index) => {
      const animateScale = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateScale.setAttribute('attributeName', 'fontSize');
      animateScale.setAttribute('values', '14;16;14');
      animateScale.setAttribute('dur', '2s');
      animateScale.setAttribute('begin', `${index * 0.3}s`);
      animateScale.setAttribute('repeatCount', 'indefinite');
      
      dollar.appendChild(animateScale);
    });
    
  }, []);
  
  return (
    <svg 
      ref={svgRef}
      width="500" 
      height="400" 
      viewBox="0 0 500 400" 
      className="w-full max-w-lg mx-auto"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {/* Background pattern */}
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f2f2f2" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="ideaGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4141" />
          <stop offset="100%" stopColor="#ff7a41" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Central circle - ideasync */}
      <circle cx="250" cy="200" r="50" fill="url(#ideaGlow)" filter="url(#glow)" />
      <text x="250" y="205" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">ideasync</text>
      
      {/* Founders - right side */}
      <circle cx="380" cy="130" r="8" fill="#ff4141" className="founder-node" />
      <circle cx="400" cy="200" r="8" fill="#ff4141" className="founder-node" />
      <circle cx="370" cy="270" r="8" fill="#ff4141" className="founder-node" />
      
      {/* Investors - left side */}
      <circle cx="120" cy="130" r="8" fill="#333" className="investor-node" />
      <circle cx="100" cy="200" r="8" fill="#333" className="investor-node" />
      <circle cx="130" cy="270" r="8" fill="#333" className="investor-node" />
      
      {/* Connecting lines */}
      <line x1="250" y1="200" x2="380" y2="130" stroke="#ff4141" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      <line x1="250" y1="200" x2="400" y2="200" stroke="#ff4141" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      <line x1="250" y1="200" x2="370" y2="270" stroke="#ff4141" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      
      <line x1="250" y1="200" x2="120" y2="130" stroke="#666" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      <line x1="250" y1="200" x2="100" y2="200" stroke="#666" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      <line x1="250" y1="200" x2="130" y2="270" stroke="#666" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
      
      {/* Direct connections between founders and investors */}
      <line x1="120" y1="130" x2="380" y2="130" stroke="#ff7a41" strokeWidth="1" strokeDasharray="3,3" className="connection-line" />
      <line x1="100" y1="200" x2="400" y2="200" stroke="#ff7a41" strokeWidth="1" strokeDasharray="3,3" className="connection-line" />
      <line x1="130" y1="270" x2="370" y2="270" stroke="#ff7a41" strokeWidth="1" strokeDasharray="3,3" className="connection-line" />
      
      {/* Idea elements (lightbulbs) */}
      <g className="idea-element" transform="translate(350, 100) scale(0.7)">
        <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.5" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      <g className="idea-element" transform="translate(380, 170) scale(0.7)">
        <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.5" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      <g className="idea-element" transform="translate(340, 240) scale(0.7)">
        <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.5" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Dollar signs (represent investment) */}
      <text x="250" y="130" fontSize="14" fill="#ff4141" textAnchor="middle" className="dollar-element">$</text>
      <text x="250" y="190" fontSize="14" fill="#ff4141" textAnchor="middle" className="dollar-element">$</text>
      <text x="250" y="250" fontSize="14" fill="#ff4141" textAnchor="middle" className="dollar-element">$</text>
      
      {/* Labels */}
      <text x="380" y="115" fontSize="12" fill="#333" textAnchor="middle">Founder</text>
      <text x="400" y="185" fontSize="12" fill="#333" textAnchor="middle">Founder</text>
      <text x="370" y="290" fontSize="12" fill="#333" textAnchor="middle">Founder</text>
      
      <text x="120" y="115" fontSize="12" fill="#333" textAnchor="middle">Investor</text>
      <text x="100" y="185" fontSize="12" fill="#333" textAnchor="middle">Investor</text>
      <text x="130" y="290" fontSize="12" fill="#333" textAnchor="middle">Investor</text>
    </svg>
  );
};

export default AnimatedSvg;
