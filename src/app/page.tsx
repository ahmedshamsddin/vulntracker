"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type Tag = {
  id: number;
  name: string;
};

type Vulnerability = {
  id: number;
  title: string;
  severity: Severity;
  status: Status;
  createdAt: string;
  tags: Tag[];
  user?: { name?: string | null };
};


export default function Home() {
  const [data, setData] = useState<Vulnerability[]>([]);
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (severity) params.set("severity", severity);
    if (status) params.set("status", status);

    const res = await fetch(`/api/vulnerabilities?${params.toString()}`);
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vulnerability Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  <Card label="Open" count={data.filter(v => v.status === "OPEN").length} />
  <Card label="In Progress" count={data.filter(v => v.status === "IN_PROGRESS").length} />
  <Card label="Resolved" count={data.filter(v => v.status === "RESOLVED").length} />
  <Card label="Closed" count={data.filter(v => v.status === "CLOSED").length} />
</div>
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title/description"
          className="border rounded px-3 py-2"
        />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All severities</option>
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All status</option>
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="sm:col-span-3 bg-black text-white rounded px-3 py-2"
        >
          Apply Filters
        </button>
      </div>

      {/* Vulnerability list */}
      <ul className="space-y-3">
        {data.map((v) => (
          <li
            key={v.id}
            className="bg-white rounded-xl p-4 border flex items-start justify-between"
          >
            <div>
              <Link
                href={`/vulns/${v.id}`}
                className="font-semibold hover:underline"
              >
                {v.title}
              </Link>
              <div className="text-sm text-slate-600">
                {new Date(v.createdAt).toLocaleString()}
              </div>
              <div className="mt-1 space-x-1">
                {v.tags?.map((t) => (
                  <span
                    key={t.id}
                    className="inline-block bg-slate-200 text-slate-800 rounded px-2 py-0.5 text-xs"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600">
  Reported by {v.user?.name || "Unknown"}
</p>
            </div>
            <div className="space-x-2">
              <span className={`badge ${sevClass(v.severity)}`}>
                {v.severity}
              </span>
              <span className="badge badge-status">{v.status}</span>
            </div>
          </li>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-slate-600">No results.</p>
        )}
      </ul>
    </div>
  );
}

function sevClass(s: Severity) {
  if (s === "LOW") return "badge-low";
  if (s === "MEDIUM") return "badge-medium";
  if (s === "HIGH") return "badge-high";
  return "badge-critical";
}

function Card({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
      <div className="text-xl font-bold">{count}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
