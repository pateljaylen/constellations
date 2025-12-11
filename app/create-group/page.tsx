"use client";

import { useState } from "react";
import { createGroup } from "./actions";

export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createGroup({ name, description });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-3xl font-semibold mb-6">Create Your Constellation</h1>

      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
        <input
          className="border p-3 rounded-md"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-3 rounded-md"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="bg-black text-white p-3 rounded-md">
          Create Group
        </button>
      </form>
    </div>
  );
}
