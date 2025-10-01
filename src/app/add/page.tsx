"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";


type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export default function Add() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("LOW");
  const [vulnStatus, setVulnStatus] = useState("OPEN");
  const [tags, setTags] = useState("");
  const router = useRouter();


  const { data: session, status } = useSession();
if (status === "loading") return <p>Loading…</p>;
if (!session) return <p>You must be logged in to add vulnerabilities.</p>;


  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/vulnerabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        severity,
        vulnStatus,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    if (!res.ok) {
        toast.error("Failed to add vulnerability");
      return;
    }

    toast.success("Vulnerability added");
    router.push("/");
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 max-w-2xl bg-white p-6 rounded-xl shadow"
    >
      <h1 className="text-2xl font-bold">Add Vulnerability</h1>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded px-3 py-2 min-h-[140px]"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          className="border rounded px-3 py-2"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
        >
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={vulnStatus}
          onChange={(e) => setVulnStatus(e.target.value)}
        >
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button className="bg-black text-white rounded px-3 py-2">
        Save
      </button>
    </form>
  );
}
