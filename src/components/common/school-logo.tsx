"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface SchoolLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
  variant?: "emblem" | "crest";
}

const sizeMap = {
  xs: { box: "h-7 w-7", img: 28 },
  sm: { box: "h-9 w-9", img: 36 },
  md: { box: "h-11 w-11", img: 44 },
  lg: { box: "h-14 w-14", img: 56 },
  xl: { box: "h-20 w-20", img: 80 },
};

export function SchoolLogo({
  size = "md",
  className,
  showText = false,
  textClassName,
  subtitleClassName,
}: SchoolLogoProps) {
  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <div
        className={cn(
          "relative shrink-0 rounded-full overflow-hidden shadow-xs ring-1 ring-amber-500/30 bg-[#1b365d] flex items-center justify-center transition-transform hover:scale-105",
          currentSize.box
        )}
      >
        <Image
          src="/logos/samrong-ponley-logo.svg"
          alt="វិទ្យាល័យ សំរោងពន្លៃ - Samrong Ponley High School"
          width={currentSize.img}
          height={currentSize.img}
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "font-bold text-sm tracking-tight text-foreground truncate font-khmer",
              textClassName
            )}
          >
            វិទ្យាល័យ សំរោងពន្លៃ
          </span>
          <span
            className={cn(
              "text-[10.5px] font-medium text-muted-foreground truncate",
              subtitleClassName
            )}
          >
            Samrong Ponley High School
          </span>
        </div>
      )}
    </div>
  );
}
