"use client"

import React from "react"

interface RabbitAvatarProps {
  color: string
  size?: number
}

export const RABBIT_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B739", // Orange
  "#52BE80", // Green
  "#EC7063", // Coral
  "#5DADE2", // Light Blue
  "#F1948A", // Pink
  "#82E0AA", // Light Green
  "#F5B041", // Amber
  "#A569BD", // Violet
  "#5DADE2", // Cyan
  "#F39C12", // Dark Orange
  "#E74C3C", // Dark Red
  "#27AE60", // Dark Green
]

export const RabbitAvatar: React.FC<RabbitAvatarProps> = ({ color, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      {/* Head - Hexagonal */}
      <polygon points="50,15 75,30 75,55 50,70 25,55 25,30" fill={color} />

      {/* Left Ear - Triangular */}
      <polygon points="30,10 20,5 30,25" fill={color} />
      <polygon points="28,12 22,8 28,22" fill={`${color}80`} />

      {/* Right Ear - Triangular */}
      <polygon points="70,10 80,5 70,25" fill={color} />
      <polygon points="72,12 78,8 72,22" fill={`${color}80`} />

      {/* Left Eye - Diamond */}
      <polygon points="40,45 45,50 40,55 35,50" fill="#1a1a1a" />
      <polygon points="42,48 43,49 42,50 41,49" fill="#ffffff" />

      {/* Right Eye - Diamond */}
      <polygon points="60,45 65,50 60,55 55,50" fill="#1a1a1a" />
      <polygon points="62,48 63,49 62,50 61,49" fill="#ffffff" />

      {/* Nose - Diamond */}
      <polygon points="50,58 52,60 50,62 48,60" fill="#1a1a1a" />

      {/* Mouth - Angular */}
      <polygon points="50,63 45,68 40,65 42,63" fill="#1a1a1a" />
      <polygon points="50,63 55,68 60,65 58,63" fill="#1a1a1a" />

      {/* Cheeks - Diamonds */}
      <polygon points="35,65 40,68 35,71 30,68" fill={`${color}40`} />
      <polygon points="65,65 70,68 65,71 60,68" fill={`${color}40`} />
    </svg>
  )
}

export default RabbitAvatar


