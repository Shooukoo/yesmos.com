export function GeometricPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {/* Hexagon grid pattern */}
        <defs>
          <pattern
            id="hexagons"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Hexagon outline */}
            <polygon
              points="30,0 60,15 60,45 30,60 0,45 0,15"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.12"
            />
            {/* Horizontal line */}
            <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="1" opacity="0.08" />
          </pattern>
        </defs>

        {/* Fill with pattern */}
        <rect width="400" height="300" fill="url(#hexagons)" />

        {/* Subtle accent lines (angular, motion-like) */}
        <line x1="100" y1="20" x2="200" y2="80" stroke="white" strokeWidth="2" opacity="0.1" />
        <line x1="250" y1="30" x2="350" y2="120" stroke="white" strokeWidth="2" opacity="0.08" />
        <line x1="50" y1="150" x2="300" y2="220" stroke="white" strokeWidth="2" opacity="0.09" />
      </svg>
    </div>
  )
}
