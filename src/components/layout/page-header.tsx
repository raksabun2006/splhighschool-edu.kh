import React from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 mb-4 sm:pb-6 sm:mb-6 border-b border-border/80 min-w-0",
        className
      )}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug break-words">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
