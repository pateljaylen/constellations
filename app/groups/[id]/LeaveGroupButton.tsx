"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LeaveGroupButtonProps {
  groupId: string;
}

export function LeaveGroupButton({ groupId }: LeaveGroupButtonProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLeave = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsLeaving(true);

    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/groups";
      } else {
        alert("Failed to leave group");
        setIsLeaving(false);
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave group");
      setIsLeaving(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => setShowConfirm(false)}
          variant="outline"
          size="sm"
          disabled={isLeaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLeave}
          variant="destructive"
          size="sm"
          disabled={isLeaving}
        >
          {isLeaving ? "Leaving..." : "Confirm Leave"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLeave}
      variant="outline"
      size="sm"
      disabled={isLeaving}
    >
      Leave Group
    </Button>
  );
}

