"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type Tag = { id: number; name: string };

type Vulnerability = {
  id: number;
  title: string;
  severity: Severity;
  status: Status;
  createdAt: string;
  tags: Tag[];
  description: string;
  user?: { name?: string | null };
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [v, setV] = useState<Vulnerability | null>(null);
  const router = useRouter();

    const load = useCallback(async () => {
    const res = await fetch(`/api/vulnerabilities/${id}`);
    if (res.ok) setV(await res.json());
    }, [id]);


  useEffect(() => {
    load();
  }, [load]);

  async function update(patch: Partial<Vulnerability> & { tags?: { name: string }[] }) {
    const res = await fetch(`/api/vulnerabilities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      await load();
      toast.success("✅ Updated");
    } else {
      toast.error("❌ Update failed");
    }
  }

  async function del() {
    if (!confirm("Delete this vulnerability?")) return;
    const res = await fetch(`/api/vulnerabilities/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("🗑️ Deleted");
      router.push("/");
    } else {
      toast.error("❌ Delete failed");
    }
  }

  if (!v) return <p>Loading…</p>;

  return (
    <div className="space-y-4 max-w-2xl bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold">{v.title}</h1>
      <p className="whitespace-pre-wrap text-slate-700">{v.description}</p>

    <div className="text-sm text-slate-600">
  {new Date(v.createdAt).toLocaleString()} • Reported by {v.user?.name || "Unknown"}
</div>
      {/* Severity + Status */}
      <div className="flex gap-3 items-center">
        <label className="text-sm text-slate-600">Severity:</label>
        <select
          value={v.severity}
          onChange={(e) => update({ severity: e.target.value as Severity })}
          className="border rounded px-2 py-1"
        >
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label className="text-sm text-slate-600 ml-4">Status:</label>
        <select
          value={v.status}
          onChange={(e) => update({ status: e.target.value as Status })}
          className="border rounded px-2 py-1"
        >
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-slate-600 mb-1">Tags:</label>
        <input
          className="border rounded px-3 py-2 w-full"
          defaultValue={v.tags.map((t) => t.name).join(", ")}
          onBlur={(e) =>
            update({
              tags: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((name) => ({ id: 0, name })), // PATCH route handles deletion + recreate
            })
          }
        />
        <p className="text-xs text-slate-500 mt-1">
          (Edit tags as comma-separated, press outside input to save)
        </p>
      </div>

      {/* Actions */}
      <div className="pt-4 flex gap-2">
        <button
          onClick={() => load()}
          className="border rounded px-3 py-2"
        >
          Refresh
        </button>
        <button
          onClick={del}
          className="bg-red-600 text-white rounded px-3 py-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
