import React from 'react';

export const NavkarMarquee: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mantra = "🌸 णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्वसाहूणं • एसोपंचणमोक्कारो सव्वपावप्पणासणो • मंगलाणं च सव्वेसिं पढमं हवइ मंगलं 🌸";

  return (
    <div className={`overflow-hidden whitespace-nowrap bg-black/15 backdrop-blur-xs py-1 text-[11px] sm:text-xs text-jain-yellow-soft font-medium tracking-wide border-y border-white/10 select-none ${className}`}>
      <div className="animate-marquee flex gap-8 items-center">
        <span>{mantra}</span>
        <span>{mantra}</span>
        <span>{mantra}</span>
        <span>{mantra}</span>
      </div>
    </div>
  );
};
