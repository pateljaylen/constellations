"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InviteSectionProps {
  groupId: string;
  inviteToken: string | null;
  isCreator: boolean;
}

export function InviteSection({ groupId, inviteToken, isCreator }: InviteSectionProps) {
  const [copied, setCopied] = useState(false);

  if (!inviteToken) return null;

  const inviteUrl = `${window.location.origin}/invite/${inviteToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <h3 className="font-semibold mb-2">Invite Others</h3>
      <p className="text-sm text-zinc-600 mb-3">
        Share this link to invite people to join your group:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inviteUrl}
          readOnly
          className="flex-1 px-3 py-2 text-sm border rounded bg-white"
        />
        <Button onClick={handleCopy} size="sm" variant="outline">
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </Card>
  );
}

