import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ import here
import type { Status, Severity } from "@prisma/client"; // ✅ import enums

// GET all vulnerabilities (with optional filters)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const severity = searchParams.get("severity") || undefined;
  const status = searchParams.get("status") || undefined;

const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (severity) where.severity = severity;
  if (status) where.status = status;

const items = await prisma.vulnerability.findMany({
  where,
  include: { tags: true, user: true },
  orderBy: { createdAt: "desc" },
});

  return NextResponse.json(items);
}

// POST new vulnerability
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, severity, status, tags } = body;

  if (!title || !description || !severity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // find the current user in DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // create vulnerability linked to user
  const item = await prisma.vulnerability.create({
    data: {
      title,
      description,
      severity: severity as Severity,  // ✅ cast to Prisma enum
      status: (status as Status) || "OPEN", // ✅ default OPEN
      userId: user.id,
      tags: {
        create: (tags || []).map((t: string) => ({ name: t })),
      },
    },
    include: { tags: true, user: true },
  });

  return NextResponse.json(item, { status: 201 });
}
