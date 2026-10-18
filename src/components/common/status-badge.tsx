import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "ACTIVE":
    case "APPROVED":
    case "PRESENT":
    case "ENROLLED":
      return (
        <Badge variant="success" className={className}>
          {status}
        </Badge>
      );
    case "PENDING":
    case "LATE":
    case "UPCOMING":
      return (
        <Badge variant="warning" className={className}>
          {status}
        </Badge>
      );
    case "INACTIVE":
    case "REJECTED":
    case "ABSENT":
    case "CLOSED":
      return (
        <Badge variant="destructive" className={className}>
          {status}
        </Badge>
      );
    case "EXCUSED":
    case "COMPLETED":
      return (
        <Badge variant="info" className={className}>
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
}
