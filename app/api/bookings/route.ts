import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { assignTechnician } from "@/lib/assignment";
import { bookingSchema } from "@/lib/validations";

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  const bookings = await prisma.booking.findMany({
    where: { userId: user!.userId },
    include: { technician: true, customer: true },
    orderBy: { date: "asc" }
  });

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const bookingDate = new Date(parsed.data.date);

  const customer = await prisma.customer.upsert({
    where: {
      userId_email: {
        userId: user!.userId,
        email: parsed.data.email
      }
    },
    update: {
      name: parsed.data.customerName,
      phone: parsed.data.phone,
      address: parsed.data.address
    },
    create: {
      userId: user!.userId,
      name: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address
    }
  });

  let technicianId = parsed.data.technicianId;

  if (!technicianId) {
    const technicians = await prisma.technician.findMany({
      where: { userId: user!.userId },
      include: {
        bookings: {
          where: {
            date: bookingDate
          }
        }
      }
    });

    technicianId = assignTechnician(technicians, parsed.data.serviceArea, parsed.data.serviceType, bookingDate) ?? undefined;
  }

  if (!technicianId) {
    return NextResponse.json(
      { error: "No technician available for requested area, skill, and time" },
      { status: 409 }
    );
  }

  const technician = await prisma.technician.findFirst({
    where: { id: technicianId, userId: user!.userId }
  });

  if (!technician) {
    return NextResponse.json({ error: "Assigned technician not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user!.userId,
      customerId: customer.id,
      technicianId,
      serviceType: parsed.data.serviceType,
      date: bookingDate,
      notes: parsed.data.notes
    },
    include: {
      technician: true,
      customer: true
    }
  });

  return NextResponse.json(booking, { status: 201 });
}
