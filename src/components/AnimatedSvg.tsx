
import React, { useEffect, useRef } from "react";

const AnimatedSvg = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Animate brain nodes
    const brainNodes = svg.querySelectorAll('.brain-node');
    brainNodes.forEach((node, index) => {
      // Pulsing animation
      const animatePulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animatePulse.setAttribute('attributeName', 'r');
      animatePulse.setAttribute('values', '3;5;3');
      animatePulse.setAttribute('dur', '3s');
      animatePulse.setAttribute('begin', `${index * 0.2}s`);
      animatePulse.setAttribute('repeatCount', 'indefinite');
      
      node.appendChild(animatePulse);
    });
    
    // Animate connection lines
    const connectionLines = svg.querySelectorAll('.connection-line');
    connectionLines.forEach((line, index) => {
      const animateDash = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateDash.setAttribute('attributeName', 'stroke-dashoffset');
      animateDash.setAttribute('values', '50;0;-50');
      animateDash.setAttribute('dur', '4s');
      animateDash.setAttribute('begin', `${index * 0.1}s`);
      animateDash.setAttribute('repeatCount', 'indefinite');
      
      line.appendChild(animateDash);
    });
    
    // Animate idea bulbs
    const ideaBulbs = svg.querySelectorAll('.idea-bulb');
    ideaBulbs.forEach((bulb, index) => {
      const animateGlow = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateGlow.setAttribute('attributeName', 'opacity');
      animateGlow.setAttribute('values', '0.5;1;0.5');
      animateGlow.setAttribute('dur', '2s');
      animateGlow.setAttribute('begin', `${index * 0.3}s`);
      animateGlow.setAttribute('repeatCount', 'indefinite');
      
      bulb.appendChild(animateGlow);
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
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4141" />
          <stop offset="100%" stopColor="#ff9e41" />
        </linearGradient>
        <linearGradient id="connectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4141" />
          <stop offset="100%" stopColor="#ff6b41" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f8f8f8" strokeWidth="0.5" />
        </pattern>
      </defs>
      
      {/* Background grid */}
      <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.6" />
      
      {/* Brain network representation */}
      <g className="brain-network">
        {/* Central hub - "ideasync" */}
        <circle cx="250" cy="200" r="40" fill="url(#brainGradient)" filter="url(#glow)" className="animate-pulse" />
        <text x="250" y="205" fontSize="15" fontWeight="bold" fill="#fff" textAnchor="middle">ideasync</text>
        
        {/* Brain nodes */}
        <circle cx="180" cy="120" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="200" cy="90" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="240" cy="70" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="290" cy="80" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="330" cy="110" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="350" cy="150" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="340" cy="240" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="300" cy="280" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="240" cy="300" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="180" cy="270" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="150" cy="220" r="4" fill="#ff4141" className="brain-node" />
        <circle cx="160" cy="170" r="4" fill="#ff4141" className="brain-node" />
        
        {/* Connection lines */}
        <line x1="250" y1="200" x2="180" y2="120" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="200" y2="90" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="240" y2="70" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="290" y2="80" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="330" y2="110" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="350" y2="150" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="340" y2="240" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="300" y2="280" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="240" y2="300" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="180" y2="270" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="150" y2="220" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        <line x1="250" y1="200" x2="160" y2="170" stroke="url(#connectGradient)" strokeWidth="1.5" strokeDasharray="5,3" className="connection-line" />
        
        {/* Cross connections */}
        <line x1="180" y1="120" x2="240" y2="70" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="240" y1="70" x2="290" y2="80" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="290" y1="80" x2="330" y2="110" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="330" y1="110" x2="350" y2="150" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="350" y1="150" x2="340" y2="240" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="340" y1="240" x2="300" y2="280" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="300" y1="280" x2="240" y2="300" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="240" y1="300" x2="180" y2="270" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="180" y1="270" x2="150" y2="220" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="150" y1="220" x2="160" y2="170" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        <line x1="160" y1="170" x2="180" y2="120" stroke="#ff6b41" strokeWidth="0.8" strokeDasharray="2,2" className="connection-line" />
        
        {/* Idea bulbs */}
        <g className="idea-bulb" transform="translate(185, 95) scale(0.6)">
          <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#ff4141" strokeWidth="0.7" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        <g className="idea-bulb" transform="translate(325, 95) scale(0.6)">
          <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#ff4141" strokeWidth="0.7" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        <g className="idea-bulb" transform="translate(325, 255) scale(0.6)">
          <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#ff4141" strokeWidth="0.7" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        <g className="idea-bulb" transform="translate(165, 255) scale(0.6)">
          <path d="M12,2 C8.13,2 5,5.13 5,9 C5,11.38 6.19,13.47 8,14.74 L8,17 C8,17.55 8.45,18 9,18 L15,18 C15.55,18 16,17.55 16,17 L16,14.74 C17.81,13.47 19,11.38 19,9 C19,5.13 15.87,2 12,2 Z" fill="#FFD54F" stroke="#ff4141" strokeWidth="0.7" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Dollar signs and user icons */}
        <text x="210" y="150" fontSize="14" fill="#ff4141" className="animate-pulse">$</text>
        <text x="280" y="150" fontSize="14" fill="#ff4141" className="animate-pulse">$</text>
        <text x="230" y="250" fontSize="14" fill="#ff4141" className="animate-pulse">$</text>
        <text x="270" y="230" fontSize="14" fill="#ff4141" className="animate-pulse">$</text>
        
        {/* People icons for founders/investors */}
        <g transform="translate(150, 180) scale(0.04)">
          <circle cx="256" cy="120" r="100" fill="#ff4141" />
          <path d="M256,256 C150,256 64,342 64,448 L448,448 C448,342 362,256 256,256 Z" fill="#ff4141" />
        </g>
        
        <g transform="translate(350, 180) scale(0.04)">
          <circle cx="256" cy="120" r="100" fill="#ff4141" />
          <path d="M256,256 C150,256 64,342 64,448 L448,448 C448,342 362,256 256,256 Z" fill="#ff4141" />
        </g>
        
        <g transform="translate(200, 300) scale(0.04)">
          <circle cx="256" cy="120" r="100" fill="#ff4141" />
          <path d="M256,256 C150,256 64,342 64,448 L448,448 C448,342 362,256 256,256 Z" fill="#ff4141" />
        </g>
        
        <g transform="translate(300, 300) scale(0.04)">
          <circle cx="256" cy="120" r="100" fill="#ff4141" />
          <path d="M256,256 C150,256 64,342 64,448 L448,448 C448,342 362,256 256,256 Z" fill="#ff4141" />
        </g>
        
        {/* Title and labels */}
        <text x="250" y="365" fontSize="12" textAnchor="middle" fill="#333" fontWeight="bold">
          Connecting ideas with investment
        </text>
      </g>
    </svg>
  );
};

export default AnimatedSvg;
