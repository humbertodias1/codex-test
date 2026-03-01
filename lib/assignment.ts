import { Booking, Technician } from "@prisma/client";

type AvailabilitySlot = {
  start: string;
  end: string;
};

type AvailabilityDay = {
  day: number;
  slots: AvailabilitySlot[];
};

function isWithinSlot(targetTime: string, slot: AvailabilitySlot): boolean {
  return targetTime >= slot.start && targetTime < slot.end;
}

function hasAvailability(availability: unknown, bookingDate: Date): boolean {
  const days = availability as AvailabilityDay[];
  const day = bookingDate.getUTCDay();
  const time = bookingDate.toISOString().slice(11, 16);
  const config = days.find((d) => d.day === day);
  if (!config) return false;
  return config.slots.some((slot) => isWithinSlot(time, slot));
}

function hasNoConflict(existingBookings: Booking[], bookingDate: Date): boolean {
  return !existingBookings.some((booking) => booking.date.toISOString() === bookingDate.toISOString());
}

export function assignTechnician(
  technicians: Array<Technician & { bookings: Booking[] }>,
  serviceArea: string,
  serviceType: string,
  bookingDate: Date
): string | null {
  const normalizedArea = serviceArea.toLowerCase();
  const normalizedSkill = serviceType.toLowerCase();

  const match = technicians.find((tech) => {
    const areaMatch = tech.serviceArea.toLowerCase() === normalizedArea;
    const skillMatch = tech.skills.map((skill) => skill.toLowerCase()).includes(normalizedSkill);
    const available = hasAvailability(tech.calendarAvailability, bookingDate);
    const conflictFree = hasNoConflict(tech.bookings, bookingDate);

    return areaMatch && skillMatch && available && conflictFree;
  });

  return match?.id ?? null;
}
