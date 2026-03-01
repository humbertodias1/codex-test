import { startOfDay, endOfDay } from "date-fns";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();
  const [totalBookings, bookingsToday, upcomingBookings, techPerformance] = await Promise.all([
    prisma.booking.count({ where: { userId: user.userId } }),
    prisma.booking.count({
      where: {
        userId: user.userId,
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now)
        }
      }
    }),
    prisma.booking.findMany({
      where: {
        userId: user.userId,
        date: { gte: now }
      },
      include: { technician: true, customer: true },
      orderBy: { date: "asc" },
      take: 5
    }),
    prisma.technician.findMany({
      where: { userId: user.userId },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    })
  ]);

  return (
    <DashboardShell>
      <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">Total bookings: {totalBookings}</div>
        <div className="rounded bg-white p-4 shadow">Bookings today: {bookingsToday}</div>
        <div className="rounded bg-white p-4 shadow">Upcoming bookings: {upcomingBookings.length}</div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Upcoming Bookings</h2>
        <div className="rounded bg-white p-4 shadow">
          <ul className="space-y-2 text-sm">
            {upcomingBookings.map((booking) => (
              <li key={booking.id}>
                {booking.date.toLocaleString()} — {booking.customer.name} with {booking.technician.name} ({booking.serviceType})
              </li>
            ))}
            {upcomingBookings.length === 0 && <li>No upcoming bookings</li>}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Technician Performance</h2>
        <div className="rounded bg-white p-4 shadow">
          <ul className="space-y-2 text-sm">
            {techPerformance.map((tech) => (
              <li key={tech.id}>
                {tech.name}: {tech._count.bookings} booking(s)
              </li>
            ))}
            {techPerformance.length === 0 && <li>No technicians yet</li>}
          </ul>
        </div>
      </section>
    </DashboardShell>
  );
}
