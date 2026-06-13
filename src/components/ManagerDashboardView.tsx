import React, { useMemo, useState } from "react";
import { Booking } from "../types";
import { Landmark, TrendingUp, Calendar, Inbox, Trash2, CheckCircle, Clock } from "lucide-react";

interface ManagerDashboardViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onUpdateStatus?: (bookingId: string, status: "confirmed" | "cancelled" | "pending") => void;
}

export default function ManagerDashboardView({
  bookings,
  onCancelBooking,
  onUpdateStatus,
}: ManagerDashboardViewProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "cancelled" | "pending">("all");

  const analytics = useMemo(() => {
    const totalRevenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const pendingRevenue = bookings
      .filter((b) => b.status === "pending")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const occupancyRate = bookings.length > 0 ? Math.min(Math.round((bookings.filter(b=>b.status==='confirmed').length / 20) * 100), 100) : 0;

    return {
      totalRevenue,
      pendingRevenue,
      occupancyRate,
      activeCount: bookings.filter((b) => b.status === "confirmed").length,
      pendingCount: bookings.filter((b) => b.status === "pending").length,
      cancelledCount: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "all") return bookings;
    return bookings.filter((b) => b.status === filterStatus);
  }, [bookings, filterStatus]);

  return (
    <div className="space-y-10 text-left pb-16">
      {/* Dashboard Headline */}
      <div className="border-b border-slate-100 dark:border-white/5 pb-4">
        <span className="font-heading font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          StayLux Partner Cockpit
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-0.5">
          Manager Portal Console
        </h1>
        <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
          Monitor enterprise occupancy status, manage verified stays, and view real-time reservation metrics.
        </p>
      </div>

      {/* Analytical Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total revenue item */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs space-y-2">
          <div className="flex justify-between items-start text-emerald-600">
            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Approved Revenue
            </span>
            <TrendingUp size={16} />
          </div>
          <p className="font-heading font-black text-2xl text-slate-900 dark:text-white leading-none">
            ${analytics.totalRevenue}
          </p>
          <span className="font-sans text-[10px] text-slate-400 block font-semibold">
            From {analytics.activeCount} locked reservations
          </span>
        </div>

        {/* Pending revenue item */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs space-y-2">
          <div className="flex justify-between items-start text-amber-500">
            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Pending Revenue
            </span>
            <Clock size={16} />
          </div>
          <p className="font-heading font-black text-2xl text-slate-900 dark:text-white leading-none">
            ${analytics.pendingRevenue}
          </p>
          <span className="font-sans text-[10px] text-slate-400 block font-semibold">
            Awaiting credit verification
          </span>
        </div>

        {/* Occupancy tier list */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs space-y-2">
          <div className="flex justify-between items-start text-indigo-500">
            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Chamber Occupancy
            </span>
            <Landmark size={16} />
          </div>
          <p className="font-heading font-black text-2xl text-slate-900 dark:text-white leading-none">
            {analytics.occupancyRate}%
          </p>
          <span className="font-sans text-[10px] text-slate-400 block font-semibold">
            Based on 20 premium suites capacity
          </span>
        </div>

        {/* Registry booking items count */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs space-y-2">
          <div className="flex justify-between items-start text-slate-500">
            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Stays Ledger
            </span>
            <Calendar size={16} />
          </div>
          <div className="flex gap-4 text-xs font-heading font-extrabold pt-1 text-slate-800 dark:text-slate-200">
            <div>
              <span className="block text-[10px] text-slate-400 font-sans leading-none uppercase">CONF</span>
              <span className="text-emerald-500 font-black text-lg">{analytics.activeCount}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="block text-[10px] text-slate-400 font-sans leading-none uppercase">PEND</span>
              <span className="text-amber-500 font-black text-lg">{analytics.pendingCount}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="block text-[10px] text-slate-400 font-sans leading-none uppercase">CANC</span>
              <span className="text-rose-500 font-black text-lg">{analytics.cancelledCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Database list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-950 dark:text-white leading-tight">
              Stays Database Records
            </h3>
            <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              {filteredBookings.length} bookings indexed matching criteria
            </span>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-850 p-1 rounded-xl border border-slate-150 dark:border-slate-800 text-[10px]">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-sans font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  filterStatus === status
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                id={`admin-filter-btn-${status}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Database Grid Table */}
        <div className="overflow-x-auto">
          {filteredBookings.length > 0 ? (
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">
                  <th className="px-6 py-4.5">Code / Created</th>
                  <th className="px-6 py-4.5">Property / Category</th>
                  <th className="px-6 py-4.5">Traveler Credentials</th>
                  <th className="px-6 py-4.5">Stay Slots</th>
                  <th className="px-6 py-4.5 text-right">Audit Charge</th>
                  <th className="px-6 py-4.5 text-right">Registry Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-5 space-y-1 align-top">
                      <span className="font-heading font-extrabold text-[10px] text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200/50 dark:border-white/5">
                        {booking.id}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium pt-1">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Property details */}
                    <td className="px-6 py-5 align-top">
                      <p className="font-heading font-bold text-slate-900 dark:text-white leading-tight">
                        {booking.hotelName}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block pt-0.5">
                        {booking.roomName}
                      </span>
                    </td>

                    {/* Traveler */}
                    <td className="px-6 py-5 align-top">
                      <p className="font-heading font-semibold text-slate-800 dark:text-slate-200">
                        {booking.guestName}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {booking.guestEmail} • {booking.guestPhone}
                      </span>
                    </td>

                    {/* Stay segment */}
                    <td className="px-6 py-5 align-top">
                      <p className="font-semibold text-slate-700 dark:text-slate-350 leading-none">
                        {booking.checkIn} — {booking.checkOut}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block pt-1.5">
                        {booking.nights} nights • {booking.guestsCount} guest{booking.guestsCount > 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Pricing total charge */}
                    <td className="px-6 py-5 text-right font-heading font-black text-slate-900 dark:text-white align-top text-sm">
                      ${booking.totalPrice}
                    </td>

                    {/* Admin Actions */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve pending stays */}
                        {booking.status === "pending" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, "confirmed")}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg hover:text-emerald-800 cursor-pointer transition-colors"
                            title="Verify and Approve Stay"
                            id={`admin-approve-btn-${booking.id}`}
                          >
                            <CheckCircle size={13} />
                          </button>
                        )}

                        {/* Erase held entries */}
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg hover:text-rose-700 cursor-pointer transition-colors"
                          title="Erase reservation from active Ledger"
                          id={`admin-delete-btn-${booking.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center space-y-4" id="admin-empty-bookings-view">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/5 flex items-center justify-center text-slate-400">
                <Inbox size={22} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  No Reservation Entries Recorded
                </h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed font-light py-1 max-w-[240px] mx-auto">
                  Stays secured on the custom portal reservation forms will be synchronized into this table.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
