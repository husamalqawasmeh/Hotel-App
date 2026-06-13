import React from "react";
import { Hotel, Briefcase, Calendar, Menu, X, Landmark } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'hotels' | 'details' | 'book' | 'confirmation' | 'dashboard') => void;
  bookingCount: number;
  onOpenBookingsDrawer: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  bookingCount,
  onOpenBookingsDrawer,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 group focus:outline-none"
              id="navbar-logo-btn"
            >
              <div className="bg-slate-900 text-white p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-800 shadow-sm">
                <Landmark size={22} className="text-slate-100" />
              </div>
              <div className="text-left">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  StayLux
                </span>
                <span className="font-sans text-[10px] text-slate-400 font-medium tracking-widest uppercase block leading-none">
                  Curated Escapes
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate("home")}
              className={`font-sans font-medium text-sm transition-colors duration-200 ${
                currentView === "home"
                  ? "text-slate-900 border-b-2 border-slate-900 py-2"
                  : "text-slate-500 hover:text-slate-900 py-2"
              }`}
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("hotels")}
              className={`font-sans font-medium text-sm transition-colors duration-200 ${
                currentView === "hotels"
                  ? "text-slate-900 border-b-2 border-slate-900 py-2"
                  : "text-slate-500 hover:text-slate-900 py-2"
              }`}
              id="nav-hotels-btn"
            >
              Browse Hotels
            </button>

            <button
              onClick={() => onNavigate("dashboard")}
              className={`font-sans font-medium text-sm transition-colors duration-200 ${
                currentView === "dashboard"
                  ? "text-amber-750 border-b-2 border-amber-600 py-2"
                  : "text-slate-500 hover:text-amber-700 py-2"
              }`}
              id="nav-dashboard-btn"
            >
              Manager Cockpit
            </button>

            <button
              onClick={onOpenBookingsDrawer}
              className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 px-4 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wide text-slate-800 cursor-pointer"
              id="nav-bookings-drawer-btn"
            >
              <Calendar size={14} className="text-slate-600" />
              My Bookings
              {bookingCount > 0 && (
                <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                  {bookingCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Toggle menu"
              id="navbar-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-3 shadow-inner">
          <button
            onClick={() => {
              onNavigate("home");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all block"
            id="mobile-nav-home-btn"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate("dashboard");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all block"
            id="mobile-nav-dashboard-btn"
          >
            Manager Cockpit
          </button>
          <button
            onClick={() => {
              onNavigate("hotels");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all block"
            id="mobile-nav-hotels-btn"
          >
            Browse Hotels
          </button>
          <button
            onClick={() => {
              onOpenBookingsDrawer();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-sans font-semibold text-sm text-slate-800 hover:bg-slate-100 transition-all"
            id="mobile-nav-bookings-btn"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-600" />
              My Bookings
            </span>
            {bookingCount > 0 && (
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
