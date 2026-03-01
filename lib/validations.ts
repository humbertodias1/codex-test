import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const technicianSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  serviceArea: z.string().min(2),
  skills: z.array(z.string().min(1)).min(1),
  calendarAvailability: z.array(
    z.object({
      day: z.number().min(0).max(6),
      slots: z.array(
        z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
          end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        })
      )
    })
  )
});

export const bookingSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  address: z.string().min(5),
  serviceType: z.string().min(2),
  serviceArea: z.string().min(2),
  date: z.string().datetime(),
  notes: z.string().optional(),
  technicianId: z.string().optional()
});
