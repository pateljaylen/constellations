// app/me/ClientActions.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function ClientActions() {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button
        variant="default"
        className="text-sm"
        onClick={() => {
          alert("Reflection composer coming next ✨");
        }}
      >
        Write a reflection
      </Button>

      <Button
        variant="outline"
        className="text-sm"
        onClick={() => {
          alert("Group creation flow coming next 🌌");
        }}
      >
        Create a group
      </Button>

      <Button
        variant="outline"
        className="text-xs"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Switch account
      </Button>
    </div>
  );
}
