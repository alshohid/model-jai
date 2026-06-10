"use client";

const BigBossChallengeOffers = () => {
  return (
    <div style={{ width: "100%", borderRadius: "16px", padding: ".875rem", overflow: "hidden", textAlign: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&display=swap');
        .bbc-styled-text {
          font-family: 'Dancing Script', cursive;
          font-weight: 700;
          font-size: 66px;
          user-select: none;
        }
      `}</style>

      <svg width="100%" viewBox="0 0 760 140" xmlns="http://www.w3.org/2000/svg">
        {/* Main text with stroke */}
        <text
          x="380"
          y="100"
          textAnchor="middle"
          className="bbc-styled-text"
          fill="#d6ff3f"        // neon green inside
          stroke="#ff33e0"      // bright pink stroke
          strokeWidth={8}        // thicker stroke
          paintOrder="stroke fill"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"   // glow effect
        >
          Big boss challenge offers
        </text>

        {/* Glow filter */}
        <defs>
          <filter id="glow" height="150%" width="150%" x="-25%" y="-25%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff33e0" floodOpacity="0.7" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default BigBossChallengeOffers;