import React, { useState, useEffect } from "react";
import { Booking, Hotel, RoomType, SearchQuery } from "./types";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import HotelListView from "./components/HotelListView";
import RoomDetailsView from "./components/RoomDetailsView";
import BookingFormView from "./components/BookingFormView";
import ConfirmationView from "./components/ConfirmationView";
import ManagerDashboardView from "./components/ManagerDashboardView";
import AiCompanionWidget from "./components/AiCompanionWidget";
import { X, Trash2, Calendar, MapPin, DollarSign, AlertCircle, Inbox, Landmark, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'hotels' | 'details' | 'book' | 'confirmation' | 'dashboard'>('home');
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    destination: "",
    checkIn: "2026-06-22",
    checkOut: "2026-06-29",
    guests: 2,
  });

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Booking history local state
  const [savedBookings, setSavedBookings] = useState<Booking[]>([]);
  const [bookingsDrawerOpen, setBookingsDrawerOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("staylux_bookings");
      if (saved) {
        setSavedBookings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }, []);

  // Save to LocalStorage whenever changes happen
  const saveBookingsList = (updated: Booking[]) => {
    setSavedBookings(updated);
    try {
      localStorage.setItem("staylux_bookings", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage save error", e);
    }
  };

  const handleSearchAndDirect = (query: SearchQuery) => {
    setSearchQuery(query);
    setCurrentView("hotels");
  };

  const handleSelectHotelAndDirect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentView("details");
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectRoomAndDirect = (room: RoomType) => {
    setSelectedRoom(room);
    setCurrentView("book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBookingAndDirect = (newBooking: Booking) => {
    const updated = [newBooking, ...savedBookings];
    saveBookingsList(updated);
    setActiveBooking(newBooking);
    setCurrentView("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this reservation held in the database? This is irreversible.")) {
      const updated = savedBookings.filter((b) => b.id !== bookingId);
      saveBookingsList(updated);
    }
  };

  const handleReturnHome = () => {
    setSelectedHotel(null);
    setSelectedRoom(null);
    setActiveBooking(null);
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === "home") handleReturnHome();
        }}
        bookingCount={savedBookings.length}
        onOpenBookingsDrawer={() => setBookingsDrawerOpen(true)}
      />

      {/* Main Container Stage wrapper */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <HomeView
                onSearch={handleSearchAndDirect}
                onSelectHotel={handleSelectHotelAndDirect}
                onNavigate={setCurrentView}
              />
            </motion.div>
          )}

          {currentView === "hotels" && (
            <motion.div
              key="hotels"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <HotelListView
                searchQuery={searchQuery}
                onSelectHotel={handleSelectHotelAndDirect}
                onClearSearch={() => setSearchQuery({ destination: "", checkIn: "2026-06-22", checkOut: "2026-06-29", guests: 2 })}
                onUpdateSearch={setSearchQuery}
              />
            </motion.div>
          )}

          {currentView === "details" && selectedHotel && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <RoomDetailsView
                hotel={selectedHotel}
                onBack={() => setCurrentView("hotels")}
                onSelectRoom={handleSelectRoomAndDirect}
              />
            </motion.div>
          )}

          {currentView === "book" && selectedHotel && selectedRoom && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <BookingFormView
                hotel={selectedHotel}
                room={selectedRoom}
                searchQuery={searchQuery}
                onBack={() => setCurrentView("details")}
                onConfirmBooking={handleConfirmBookingAndDirect}
              />
            </motion.div>
          )}

          {currentView === "confirmation" && activeBooking && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ConfirmationView
                booking={activeBooking}
                onReturnHome={handleReturnHome}
              />
            </motion.div>
          )}

          {currentView === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ManagerDashboardView
                bookings={savedBookings}
                onCancelBooking={handleCancelBooking}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Luxury Footer copyright */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex justify-center items-center gap-2">
            <Landmark size={14} className="text-slate-500" />
            <span className="font-heading font-extrabold text-sm text-slate-900 tracking-tight">StayLux</span>
          </div>
          <p className="font-sans font-medium text-[10px]">
            © {new Date().getFullYear()} StayLux Escrapes Ltd. All Rights Reserved. Crafted with simple, direct client-side luxury.
          </p>
        </div>
      </footer>

      {/* Flyout Side Drawer: Booking Records Archive */}
      <AnimatePresence>
        {bookingsDrawerOpen && (
          <>
            {/* Backdrop Dimmer overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
              id="drawer-backdrop"
            />

            {/* Sliding Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col focus:outline-none text-left"
              id="bookings-drawer"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <div className="space-y-0.5">
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    <Landmark size={18} className="text-emerald-400" />
                    My Stays Ledger
                  </h3>
                  <p className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {savedBookings.length} Active Reservations
                  </p>
                </div>
                <button
                  onClick={() => setBookingsDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white hover:text-slate-100 transition-colors cursor-pointer focus:outline-none"
                  id="close-drawer-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {savedBookings.length > 0 ? (
                  savedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4 relative group"
                      id={`drawer-booking-card-${booking.id}`}
                    >
                      {/* Cancel Booking Action Indicator banner */}
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all cursor-pointer focus:outline-none"
                        title="Cancel held stay"
                        id={`drawer-cancel-btn-${booking.id}`}
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="space-y-1 pr-6">
                        <span className="font-heading font-extrabold text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                          {booking.id}
                        </span>
                        <h4 className="font-heading font-extrabold text-base text-slate-900 pt-1 leading-tight">
                          {booking.hotelName}
                        </h4>
                        <p className="font-sans text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin size={11} className="text-slate-400" />
                          {booking.hotelLocation}
                        </p>
                      </div>

                      {/* Brief Specs */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-slate-450" />
                          <span>{booking.checkIn}</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2.5">
                          <span>{booking.checkOut}</span>
                        </div>
                      </div>

                      {/* Suite and Pricing summaries */}
                      <div className="flex justify-between items-end pt-2 text-xs">
                        <div>
                          <span className="font-sans text-[9px] font-bold text-slate-400 block uppercase leading-none">Chamber Category</span>
                          <span className="font-heading font-bold text-slate-800 block truncate max-w-[180px]">
                            {booking.roomName}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-sans text-[9px] font-bold text-slate-400 block uppercase leading-none">Total Held</span>
                          <span className="font-heading font-extrabold text-sm text-slate-900 block leading-none">
                            ${booking.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-72 flex flex-col justify-center items-center text-center space-y-4" id="empty-ledger-view">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-450">
                      <Inbox size={22} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-800 text-sm">Ledger is Empty</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed font-light max-w-[200px] mx-auto pt-1">
                        Select a luxury getaway suite and secure your placement to populate records.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Secure Footer */}
              <div className="p-6 border-t border-slate-50 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Durable Safe SSL Protection Enabled</span>
                </div>
                <button
                  onClick={() => setBookingsDrawerOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-sans font-semibold text-xs tracking-wider cursor-pointer transition-all"
                  id="drawer-ledger-close-cta"
                >
                  CLOSE LEDGER PANELS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Luxury AI Floating Companion Side balloon (retains state, provides smart advice) */}
      <AiCompanionWidget />
    </div>
  );
}
