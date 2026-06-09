"use client";

const BigBossChallengeOffers = () => {
  return (
    <div
      style={{
        width: "100%",
        // background: "#111",
        borderRadius: "16px",
        padding: ".875rem",
        overflow: "hidden",
        // border: "1px solid #222",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&display=swap');
        .bbc-styled-text {
          font-family: 'Dancing Script', cursive;
          font-weight: 700;
          paint-order: stroke fill;
          letter-spacing: 1px;
          user-select: none;
        }
      `}</style>
      <svg
        width="100%"
        viewBox="0 0 760 140"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="380"
          y="100"
          textAnchor="middle"
          className="bbc-styled-text"
          fontSize={66}
          fill="#8fff1f"
          stroke="#c13de6"
          strokeWidth={7.5}
        >
          Big boss challenge offers
        </text>
      </svg>
    </div>
  );
};

export default BigBossChallengeOffers;
