import React from "react";
import { CheckCircle2, Calendar, MapPin, Printer, ArrowRight, ShieldCheck, Mail, ClipboardCheck, ArrowLeft, Hotel as HotelIcon, Landmark, FileText, Sparkles } from "lucide-react";
import { Booking } from "../types";
import { motion } from "motion/react";

interface ConfirmationViewProps {
  booking: Booking;
  onReturnHome: () => void;
}

export default function ConfirmationView({ booking, onReturnHome }: ConfirmationViewProps) {
  // Copy ref to clipboard mock indicator
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id || "SLX-000000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-10 text-left print:p-0 print:my-0">
      {/* Dynamic Entrance Banner */}
      <div className="text-center space-y-4 pt-4 print:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 155, damping: 12 }}
          className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-800/30 shadow-xs"
        >
          <CheckCircle2 size={44} className="stroke-[2.5]" />
        </motion.div>

        <div className="space-y-1">
          <span className="font-sans text-[10px] font-extrabold text-emerald-650 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45 px-3.5 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-850 uppercase tracking-widest inline-block">
            Elite Reservation Confirmed
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight pt-2">
            Escape Secured, {booking.guestName}!
          </h1>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your private suite has been held successfully in the StayLux system registry. An electronic entry ticket has been dispatched to <span className="font-bold text-slate-700 dark:text-slate-300">{booking.guestEmail}</span>.
          </p>
        </div>
      </div>

      {/* Main Voucher/Invoice Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-slate-900"
        id="confirmation-voucher-card"
      >
        {/* Invoice Letterhead Stamp */}
        <div className="bg-slate-950 text-white p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 print:bg-slate-950 print:text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg text-emerald-400">
                <Landmark size={18} />
              </div>
              <span className="font-heading font-black text-lg tracking-wider">StayLux Escapes</span>
            </div>
            <p className="font-mono text-[9px] text-slate-400">VAT Registration No: LUX-2904838-EU</p>
          </div>

          <div className="text-left sm:text-right space-y-1 font-sans text-xs">
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-800/30 font-bold uppercase">
              VOUCHER INVOICE SHEET
            </span>
            <p className="font-bold font-heading pt-1 text-slate-100">Reference: {booking.id}</p>
          </div>
        </div>

        {/* Voucher Content breakdown */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadata Ledger */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-white/5 text-xs">
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Voucher Code</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 block">{booking.id}</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Security Pin</span>
              <span className="font-mono font-bold text-indigo-500 mt-1 block">SLX-2026-X</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Tax Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {new Date(booking.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
              </span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Method of Holding</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block uppercase">Guaranteed Escrow</span>
            </div>
          </div>

          {/* Properties Summary Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-white/5">
            {/* Hotel location */}
            <div className="space-y-2">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                Designated Sanctuaries
              </span>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-lg text-slate-950 dark:text-white leading-tight">
                  {booking.hotelName}
                </h3>
                <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {booking.hotelLocation}
                </p>
              </div>
            </div>

            {/* Room Suite selection */}
            <div className="space-y-2">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                Chamber Blocked
              </span>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-lg text-slate-950 dark:text-white leading-tight">
                  {booking.roomName}
                </h3>
                <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {booking.nights} {booking.nights === 1 ? "Night" : "Nights"} • {booking.guestsCount} Registered Guests
                </p>
              </div>
            </div>
          </div>

          {/* Dates check in/out details */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl">
            <div className="space-y-1">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Check-In Arrival</span>
              <span className="font-heading font-bold text-base text-slate-800 dark:text-white block pt-1">{booking.checkIn}</span>
              <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Greeting locks open from 2:00 PM</span>
            </div>
            <div className="space-y-1 border-l border-slate-200 dark:border-white/5 pl-4 sm:pl-6">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Check-Out Departure</span>
              <span className="font-heading font-bold text-base text-slate-800 dark:text-white block pt-1">{booking.checkOut}</span>
              <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Chamber return before 11:00 AM</span>
            </div>
          </div>

          {/* Guest profiles summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-white/5">
            <div className="space-y-2">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Primary Registered Traveler</span>
              <p className="font-heading font-bold text-base text-slate-800 dark:text-white leading-tight">{booking.guestName}</p>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
                {booking.guestEmail} • {booking.guestPhone}
              </p>
            </div>

            {booking.specialRequests ? (
              <div className="space-y-2">
                <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Concierge Request Records</span>
                <p className="font-sans text-xs text-slate-600 dark:text-slate-350 font-medium italic">
                  "{booking.specialRequests}"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Concierge Services</span>
                <p className="font-sans text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Standard organic minibar & continental buffet pre-authorized.
                </p>
              </div>
            )}
          </div>

          {/* Checkout Invoices Summary */}
          <div className="space-y-3 pt-2">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Financial Audit summary</span>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Room Base Rate (${booking.pricePerNight} × {booking.nights} Nights)</span>
                <span className="font-heading font-extrabold text-slate-850 dark:text-slate-200">${booking.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Occupancy Service Fee & VAT (Combined)</span>
                <span className="font-heading font-extrabold text-slate-850 dark:text-slate-200">${booking.taxes}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-850 pt-2 flex justify-between text-sm">
                <span className="font-heading font-bold text-slate-850 dark:text-slate-200">Total Invoice Charges (Held)</span>
                <span className="font-heading font-extrabold text-slate-950 dark:text-white text-base">${booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Signature validation (for printing matching real invoices) */}
          <div className="hidden print:flex justify-between items-end pt-12 text-[10px] font-sans font-bold text-slate-450 uppercase tracking-widest">
            <div className="space-y-6">
              <span className="border-b border-slate-300 w-44 block" />
              <span>Front Desk Escort Stamp</span>
            </div>
            <div className="space-y-6 text-right">
              <span className="border-b border-slate-300 w-44 block" />
              <span>Traveler Signature Verification</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Guide notes check in actions */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 flex gap-4 text-xs font-semibold print:hidden">
        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center flex-shrink-0 border border-white/5">
          <HotelIcon size={18} />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">What happens next?</h3>
          <p className="font-sans text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            An elite butler companion at <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.hotelName}</span> has already blocked your designated suite. There is no requirement to confirm over phone. Simply bring your voucher reference <span className="font-bold text-slate-700 dark:text-slate-300">{booking.id}</span> and your national registry ID upon check-in greeting doors.
          </p>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-4 rounded-xl shadow-xs print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-850 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-3 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-1.5 hover:border-slate-300 transition-all cursor-pointer"
          id="invoice-print-btn"
        >
          <Printer size={14} />
          Print PDF Invoice Sheet
        </button>

        <button
          onClick={onReturnHome}
          className="w-full sm:w-auto bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-white px-6 py-3 rounded-xl font-sans font-bold text-xs tracking-wide flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] active:translate-y-0.5 cursor-pointer"
          id="confirm-return-home-btn"
        >
          Return to Portal Home
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
