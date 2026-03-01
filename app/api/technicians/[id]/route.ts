import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { technicianSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await req.json();
  const parsed = technicianSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const technician = await prisma.technician.findFirst({
    where: { id: params.id, userId: user!.userId }
  });

  if (!technician) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 });
  }

  const updated = await prisma.technician.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const technician = await prisma.technician.findFirst({
    where: { id: params.id, userId: user!.userId }
  });

  if (!technician) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 });
  }

  await prisma.technician.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
