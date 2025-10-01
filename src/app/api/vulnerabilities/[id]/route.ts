import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET one vulnerability
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await prisma.vulnerability.findUnique({
    where: { id },
    include: { tags: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PATCH update vulnerability (replace tags)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { title, description, severity, status, tags } = body;

  // delete existing tags first (simple approach)
  await prisma.tag.deleteMany({ where: { vulnerabilityId: id } });

  const updated = await prisma.vulnerability.update({
    where: { id },
    data: {
      title,
      description,
      severity,
      status,
      tags: {
        create: (tags || []).map((t: string) => ({ name: t })),
      },
    },
    include: { tags: true },
  });

  return NextResponse.json(updated);
}

// DELETE vulnerability
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  await prisma.tag.deleteMany({ where: { vulnerabilityId: id } });
  await prisma.vulnerability.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
