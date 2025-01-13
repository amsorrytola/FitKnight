import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "../assets/lottie-json.json" 

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#7124c457] text-[#ff006e] border-[1px] border-[#ff006a]",
  "bg-[#ff006a2a] text-[#ff006a] border-[1px] border-[#ff006a0b]",
  "bg-[#0066aa2a] text-[#0066aa] border-[1px] border-[#0066aa0b]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};

export const animationDefaultOptionns = {
  loop: true,
  autoplay: true,
  animationData,
}
