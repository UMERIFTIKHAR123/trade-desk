"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TagTradingLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TagTradingLogo({
  className = "",
  showText = true,
  size = "md",
}: TagTradingLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  // Neon yellow-green color that works in both themes
  const logoColor = "#BFFF00";

  return (
    <Link
      href="/dashboard"
      className={`flex items-center gap-2 ${className} group/logo cursor-pointer hover:opacity-90 transition-opacity`}
    >
      <div
        className={`${sizeClasses[size]} relative flex-shrink-0 transition-transform group-hover/logo:scale-105`}
      >
        <Image
          src="/logo.png"
          alt="Tag Trading Logo"
          width={50}
          height={50}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={`font-bold ${textSizeClasses[size]} tracking-tight transition-all duration-200 whitespace-nowrap overflow-hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 select-none`}
          style={{ color: logoColor }}
        >
          MY DRADING
        </span>
      )}
    </Link>
  );
}
