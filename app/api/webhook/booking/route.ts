import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignTechnician } from "@/lib/assignment";
import { bookingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const webhookSecret = req.headers.get("x-webhook-secret");

  if (!process.env.BOOKING_WEBHOOK_SECRET || webhookSecret !== process.env.BOOKING_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, ...bookingPayload } = body;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(bookingPayload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const bookingDate = new Date(parsed.data.date);

  const customer = await prisma.customer.upsert({
    where: { userId_email: { userId, email: parsed.data.email } },
    update: {
      name: parsed.data.customerName,
      phone: parsed.data.phone,
      address: parsed.data.address
    },
    create: {
      userId,
      name: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address
    }
  });

  const technicians = await prisma.technician.findMany({
    where: { userId },
    include: {
      bookings: {
        where: {
          date: bookingDate
        }
      }
    }
  });

  const technicianId =
    parsed.data.technicianId ??
    assignTechnician(technicians, parsed.data.serviceArea, parsed.data.serviceType, bookingDate);

  if (!technicianId) {
    return NextResponse.json({ error: "No technician available" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      technicianId,
      customerId: customer.id,
      serviceType: parsed.data.serviceType,
      date: bookingDate,
      notes: parsed.data.notes
    }
  });

  return NextResponse.json(booking, { status: 201 });
}
