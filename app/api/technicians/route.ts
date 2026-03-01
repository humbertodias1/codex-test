import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { technicianSchema } from "@/lib/validations";

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  const technicians = await prisma.technician.findMany({
    where: { userId: user!.userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(technicians);
}

export async function POST(req: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await req.json();
  const parsed = technicianSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const technician = await prisma.technician.create({
    data: {
      ...parsed.data,
      userId: user!.userId
    }
  });

  return NextResponse.json(technician, { status: 201 });
}
