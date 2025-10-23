import React from "react";
import { Box } from "@mui/material";

const RecordingWaves: React.FC = () => (
  <Box
    sx={{
      width: 120,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      viewBox="0 0 120 40"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="wave-group" fill="currentColor">
        {[...Array(9)].map((_, i) => {
          const x = 4 + i * 12;
          return (
            <rect
              key={i}
              x={x}
              y={10}
              width={6}
              height={10}
              rx={3}
              className={`wave-bar wave-bar-${i}`}
            />
          );
        })}
      </g>
      <style>{`
        .wave-bar {
          animation: waveAnim 1s infinite ease-in-out;
        }
        ${[...Array(9)]
          .map(
            (_, i) => `
          .wave-bar-${i} {
            animation-delay: ${i * 0.1}s;
          }
        `,
          )
          .join("")}
        @keyframes waveAnim {
          0%, 100% { height: 10px; y: 15px; }
          50% { height: 28px; y: 6px; }
        }
      `}</style>
    </svg>
  </Box>
);

export default RecordingWaves;