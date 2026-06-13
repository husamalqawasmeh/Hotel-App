import React, { useState, useMemo } from "react";
import { ArrowLeft, Calendar, Users, Star, Mail, Phone, User, CreditCard, ShieldCheck, BedDouble, Scaling, ChevronDown, Coins, Briefcase } from "lucide-react";
import { Hotel, RoomType, Booking, SearchQuery } from "../types";
import { motion } from "motion/react";
import InteractiveCalendar from "./InteractiveCalendar";

interface BookingFormViewProps {
  hotel: Hotel;
  room: RoomType;
  searchQuery: SearchQuery;
  onBack: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export default function BookingFormView({
  hotel,
  room,
  searchQuery,
  onBack,
  onConfirmBooking,
}: BookingFormViewProps) {
  // Stay Logistics State (all editable on form)
  const [selectedRoomId, setSelectedRoomId] = useState<string>(room.id);
  const [checkInDate, setCheckInDate] = useState<string>(searchQuery.checkIn || "2026-06-22");
  const [checkOutDate, setCheckOutDate] = useState<string>(searchQuery.checkOut || "2026-06-29");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "credit">("card");

  // Find currently selected room specs
  const selectedRoom = useMemo(() => {
    return hotel.rooms.find((r) => r.id === selectedRoomId) || room;
  }, [selectedRoomId, hotel.rooms, room]);

  // Handle auto-adjust guest count if exceeds capacity of newly selected room
  const [guestsCount, setGuestsCount] = useState<number>(() => {
    const defaultGuests = searchQuery.guests || 2;
    return defaultGuests > selectedRoom.capacity ? selectedRoom.capacity : defaultGuests;
  });

  // Automatically cap guests count if room changes and capacity is lower
  React.useEffect(() => {
    if (guestsCount > selectedRoom.capacity) {
      setGuestsCount(selectedRoom.capacity);
    }
  }, [selectedRoomId, selectedRoom.capacity, guestsCount]);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cardholder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nights calculation based on state dates
  const nights = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
      const diffTime = d2.getTime() - d1.getTime();
      const calculated = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return calculated > 0 ? calculated : 0;
    } catch (e) {
      return 0;
    }
  }, [checkInDate, checkOutDate]);

  // Pricing calculation based on the dynamic state and selected room
  const subtotal = selectedRoom.pricePerNight * (nights > 0 ? nights : 1);
  const taxes = Math.round(subtotal * 0.12); // 12% Occupancy Tax & local city tax
  const serviceFee = Math.round(subtotal * 0.05); // 5% luxury booking security fee
  const totalPrice = subtotal + taxes + serviceFee;

  // Format Card inputs cleanly
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.cardNumber;
        return copy;
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData((prev) => ({ ...prev, cardExpiry: value }));
    if (errors.cardExpiry) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.cardExpiry;
        return copy;
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setFormData((prev) => ({ ...prev, cardCvv: value }));
    if (errors.cardCvv) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.cardCvv;
        return copy;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Form Valdiation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate Check-in Date
    if (!checkInDate) {
      newErrors.checkIn = "Check-in date is required";
    } else {
      const today = new Date("2026-06-13"); // Current local date (June 13, 2026)
      const ci = new Date(checkInDate);
      if (ci < today) {
        newErrors.checkIn = "Check-in date cannot be in the past";
      }
    }

    // Validate Check-out Date
    if (!checkOutDate) {
      newErrors.checkOut = "Check-out date is required";
    } else {
      const ci = new Date(checkInDate);
      const co = new Date(checkOutDate);
      if (isNaN(ci.getTime())) {
        newErrors.checkOut = "Please specify a valid check-in date first";
      } else if (co <= ci) {
        newErrors.checkOut = "Departure date must be at least one night after check-in";
      }
    }

    // Validate Guests Count against chamber capacity limits
    if (!guestsCount || guestsCount < 1) {
      newErrors.guestsCount = "Number of guests must be at least 1";
    } else if (guestsCount > selectedRoom.capacity) {
      newErrors.guestsCount = `Max capacity for ${selectedRoom.name} is ${selectedRoom.capacity} guests`;
    }

    // Validate Customer Profile info
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Customer's full legal name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your genuine legal name (at least 2 letters)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address (e.g. name@domain.com)";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile or contact number is required";
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, "");
      if (digitsOnly.length < 7) {
        newErrors.phone = "Please enter a valid mobile number (at least 7 digits)";
      }
    }

    // Validate Card Security values if credit card is chosen
    if (paymentMethod === "card") {
      if (!formData.cardholder.trim()) {
        newErrors.cardholder = "Credit cardholder's name is required";
      }
      if (formData.cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Valid 16-digit card number is required";
      }
      if (!formData.cardExpiry.includes("/") || formData.cardExpiry.length < 5) {
        newErrors.cardExpiry = "Expiry check MM/YY date is required";
      } else {
        const [m, y] = formData.cardExpiry.split("/");
        const month = parseInt(m, 10);
        if (month < 1 || month > 12) {
          newErrors.cardExpiry = "Month must be between 01 and 12";
        }
      }
      if (formData.cardCvv.length < 3) {
        newErrors.cardCvv = "3-digit CVV security code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Find the first error element and scroll to it to help user fix it
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        const elem = document.getElementById(`error-${firstErrorKey}`);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    // Create registry confirmation code
    const refId = `SLX-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking: Booking = {
      id: refId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      guestName: formData.fullName,
      guestEmail: formData.email,
      guestPhone: formData.phone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestsCount,
      nights: nights > 0 ? nights : 1,
      pricePerNight: selectedRoom.pricePerNight,
      subtotal,
      taxes: taxes + serviceFee,
      totalPrice,
      specialRequests: formData.specialRequests,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };

    onConfirmBooking(booking);
  };

  return (
    <div className="pb-16 text-left space-y-8" id="booking-flow-container">
      {/* Back and breadcrumbs bar */}
      <div className="flex justify-between items-center bg-white/50 border border-slate-100 p-4 rounded-xl shadow-xs">
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-250 hover:border-slate-400 font-sans font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          id="booking-back-btn"
        >
          <ArrowLeft size={14} />
          Go Back to Hotel Specs
        </button>

        <span className="font-heading font-semibold text-[10px] text-slate-400 uppercase tracking-widest block leading-none">
          Checkout Registry Secured
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Dynamic summary box & Price breakdown (Fully reactive to date, guests, room select) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-xs">
          <div>
            <span className="font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-widest block leading-none">
              Reservation Summary
            </span>
            <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-1">
              Your Booking Invoice
            </h2>
          </div>

          {/* Hotel card short summary */}
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} size={10} className="fill-amber-400 stroke-amber-400" />
                ))}
              </span>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">
                {hotel.name}
              </h3>
              <p className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {hotel.location}
              </p>
            </div>
          </div>

          {/* Stay specifics summary boxes - dynamically listens to our input fields */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Check-In Date</span>
                <span className="font-heading font-extrabold text-slate-700 flex items-center gap-1.5 leading-none">
                  <Calendar size={13} className="text-slate-400" />
                  {checkInDate || "Not Chosen"}
                </span>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-4">
                <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Check-Out Date</span>
                <span className="font-heading font-extrabold text-slate-700 flex items-center gap-1.5 leading-none">
                  <Calendar size={13} className="text-slate-400" />
                  {checkOutDate || "Not Chosen"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-xs">
              <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Stay Length</span>
              <span className="font-heading font-extrabold text-slate-700">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>

            <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-xs">
              <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Registered Guest count</span>
              <span className="font-heading font-extrabold text-slate-700 flex items-center gap-1.5">
                <Users size={12} className="text-slate-400" />
                {guestsCount} {guestsCount === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          </div>

          {/* Room Specs detailed summary - listens to selected room state */}
          <div className="space-y-2">
            <span className="font-sans text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
              Chamber Designation
            </span>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center text-xs shadow-xs">
              <div>
                <span className="font-heading font-extrabold text-slate-800 block">
                  {selectedRoom.name}
                </span>
                <span className="font-sans text-[10px] text-slate-450 font-semibold block pt-0.5">
                  Size: {selectedRoom.size} • Bed: {selectedRoom.bedType}
                </span>
              </div>
              <div className="text-right">
                <span className="font-heading font-extrabold text-slate-950 block">
                  ${selectedRoom.pricePerNight}
                </span>
                <span className="font-sans font-light text-[9px] text-slate-400 block -mt-0.5">/ night</span>
              </div>
            </div>
          </div>

          {/* Pricing Calculations Sheet */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
              <span>
                Room Base Rate (${selectedRoom.pricePerNight} × {nights > 0 ? nights : 1} {nights === 1 ? "night" : "nights"})
              </span>
              <span className="font-heading font-extrabold text-slate-800">${subtotal}</span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
              <span className="flex items-center gap-1 text-slate-500">
                Occupancy VAT & City Tax (12%)
              </span>
              <span className="font-heading font-extrabold text-slate-800">${taxes}</span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
              <span className="flex items-center gap-1 text-slate-500">
                Luxury Booking Security Fee (5%)
              </span>
              <span className="font-heading font-extrabold text-slate-800">${serviceFee}</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-heading font-extrabold text-sm text-slate-950">Total Reservation Held</span>
              <span className="font-heading font-extrabold text-2xl text-emerald-700" id="calculated-total-price">
                ${totalPrice}
              </span>
            </div>
          </div>

          {/* Secure details disclaimer */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[10px] text-emerald-800 leading-relaxed font-semibold">
              SSL Guarantee. Guest profiles are held securely on-file. Final check-out transactions are only processed on-site during keys handover ceremony.
            </p>
          </div>
        </div>

        {/* Right column: Dynamic parameters and customer fields */}
        <div className="lg:col-span-1" /> {/* Layout spacer */}
        
        <div className="lg:col-span-6 space-y-8">
          {/* Phase 1: Stay Logistics Customization */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <span className="font-sans text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                Component 1 of 3
              </span>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-1 flex items-center gap-2">
                <Calendar size={18} className="text-slate-500" />
                Stay Logistics & Choices
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
              {/* Room Type Selector dropdown */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Select Room Category
                </label>
                <div className="relative">
                  <select
                    name="selectedRoomId"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-4 pr-10 rounded-xl border border-slate-200/80 focus:border-slate-500 focus:outline-none transition-all cursor-pointer appearance-none font-sans font-bold"
                    id="booking-room-type-select"
                  >
                    {hotel.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — ${r.pricePerNight} / night (max {r.capacity} guests)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-450 pointer-events-none" />
                </div>
              </div>
              {/* Custom Interactive Stay Calendar */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-slate-550 text-[11px] font-bold uppercase tracking-wider">
                  Interactive Chamber Reserve Grid
                </label>
                <InteractiveCalendar
                  checkIn={checkInDate}
                  checkOut={checkOutDate}
                  pricePerNight={selectedRoom.pricePerNight}
                  onChange={(ci, co) => {
                    setCheckInDate(ci);
                    setCheckOutDate(co);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.checkIn;
                      delete copy.checkOut;
                      return copy;
                    });
                  }}
                />
              </div>

              {/* Check-In Date DatePicker */}
              <div className="space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Check-In Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="checkIn"
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      if (errors.checkIn) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.checkIn;
                          return copy;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-2.5 px-4 rounded-xl border focus:outline-none transition-all ${
                      errors.checkIn ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                    }`}
                    id="booking-checkin-input"
                  />
                </div>
                {errors.checkIn && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-checkIn">
                    {errors.checkIn}
                  </p>
                )}
              </div>

              {/* Check-Out Date DatePicker */}
              <div className="space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Check-Out Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="checkOut"
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      if (errors.checkOut) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.checkOut;
                          return copy;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-2.5 px-4 rounded-xl border focus:outline-none transition-all ${
                      errors.checkOut ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                    }`}
                    id="booking-checkout-input"
                  />
                </div>
                {errors.checkOut && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-checkOut">
                    {errors.checkOut}
                  </p>
                )}
              </div>


              {/* Guest selection - dropdown up to selectedRoom capacity */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider flex justify-between">
                  <span>Number of Guests</span>
                  <span className="text-slate-400 text-[10px] lowercase font-normal italic">
                    Capacity of selected chamber: {selectedRoom.capacity} {selectedRoom.capacity === 1 ? "person" : "people"}
                  </span>
                </label>
                <div className="relative">
                  <select
                    name="guestsCount"
                    value={guestsCount}
                    onChange={(e) => {
                      setGuestsCount(parseInt(e.target.value, 10));
                      if (errors.guestsCount) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.guestsCount;
                          return copy;
                        });
                      }
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-4 pr-10 rounded-xl border border-slate-200/80 focus:border-slate-500 focus:outline-none transition-all cursor-pointer appearance-none font-sans font-bold"
                    id="booking-guests-select"
                  >
                    {Array.from({ length: selectedRoom.capacity }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-455 pointer-events-none" />
                </div>
                {errors.guestsCount && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-guestsCount">
                    {errors.guestsCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2: Guest Registry Details */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <span className="font-sans text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                Component 2 of 3
              </span>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-1 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                Guest Registry Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
              {/* Customer Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Full Customer Name (Registry)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aurelius Sterling"
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none transition-all ${
                      errors.fullName ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                    }`}
                    id="guest-name-input"
                  />
                  <User size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.fullName && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-fullName">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. aurelius@sterling.com"
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none transition-all ${
                      errors.email ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                    }`}
                    id="guest-email-input"
                  />
                  <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-email">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 019-2831"
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none transition-all ${
                      errors.phone ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                    }`}
                    id="guest-phone-input"
                  />
                  <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-phone">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Special Request box */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-slate-400 text-[11px] uppercase tracking-wider">
                  Special requests & Concierge instructions (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. High allergen feather-free pillows, organic key-lime pastries in minibar upon landing arrival time coordinates."
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 px-4 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none transition-all resize-none"
                  id="guest-requests-textarea"
                />
              </div>
            </div>
          </div>

          {/* Phase 3: Secure deposit escrow details */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <span className="font-sans text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                Component 3 of 3
              </span>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-1 flex items-center gap-2">
                <CreditCard size={18} className="text-slate-500" />
                Guaranteed Holding Deposit
              </h2>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-150">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-3.5 px-2 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="payment-method-card-btn"
              >
                <CreditCard size={14} className="text-indigo-600" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("crypto")}
                className={`py-3.5 px-2 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === "crypto"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="payment-method-crypto-btn"
              >
                <Coins size={14} className="text-amber-500 animate-pulse" />
                <span>Sovereign Crypto</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("credit")}
                className={`py-3.5 px-2 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === "credit"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="payment-method-corporate-btn"
              >
                <Briefcase size={14} className="text-emerald-600" />
                <span>Corporate Line</span>
              </button>
            </div>

            {/* Conditional Input UI Blocks based on selected paymentMethod */}
            {paymentMethod === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs font-semibold animate-fade-in">
                {/* Cardholder Legal Name */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                    Cardholder's Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardholder"
                      value={formData.cardholder}
                      onChange={handleInputChange}
                      placeholder="AS REGISTERED ON PLASTIC"
                      className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none transition-all uppercase tracking-wider ${
                        errors.cardholder ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-500"
                      }`}
                      id="guest-cardholder-input"
                    />
                    <User size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  {errors.cardholder && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-cardholder">
                      {errors.cardholder}
                    </p>
                  )}
                </div>

                {/* Credit Card Number */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                    Credit Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none transition-all tracking-wider ${
                        errors.cardNumber ? "border-rose-400 focus:border-rose-550" : "border-slate-200/80 focus:border-slate-550"
                      }`}
                      id="guest-cardnumber-input"
                    />
                    <CreditCard size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-cardNumber">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Expiry Date */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-slate-500 text-[11px] uppercase tracking-wider text-center sm:text-left">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 px-4 rounded-xl border focus:outline-none transition-all tracking-widest text-center ${
                      errors.cardExpiry ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-550"
                    }`}
                    id="guest-cardexpiry-input"
                  />
                  {errors.cardExpiry && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-cardExpiry">
                      {errors.cardExpiry}
                    </p>
                  )}
                </div>

                {/* Security Code CVV */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-slate-500 text-[11px] uppercase tracking-wider text-center sm:text-left">
                    CVV Code
                  </label>
                  <input
                    type="password"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleCvvChange}
                    placeholder="•••"
                    className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs py-3 px-4 rounded-xl border focus:outline-none transition-all tracking-widest text-center ${
                      errors.cardCvv ? "border-rose-400 focus:border-rose-500" : "border-slate-200/80 focus:border-slate-550"
                    }`}
                    id="guest-cardcvv-input"
                  />
                  {errors.cardCvv && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1" id="error-cardCvv">
                      {errors.cardCvv}
                    </p>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <div className="bg-slate-950 text-white rounded-2xl p-5 border border-white/5 space-y-4 animate-fade-in text-left">
                <div className="space-y-1">
                  <span className="font-heading font-extrabold text-[9px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                    Sovereign Escrow Address (Gas Approved)
                  </span>
                  <p className="font-mono text-[10px] text-slate-350 select-all font-bold pt-1.5 break-all">
                    0xSLX2026f839939a9cceb63e3bee6f0731cbe89
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  {/* Mock QR graphic representation */}
                  <div className="w-16 h-16 bg-white p-1 rounded-lg flex-shrink-0 grid grid-cols-4 gap-0.5 shadow-sm">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 3 === 0 || i % 5 === 1) ? "bg-slate-950" : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-xs text-white">BTC / ETH Multi-sig Node</h4>
                    <p className="font-sans text-[10px] text-slate-400 leading-normal font-light">
                      Secured via StayLux Smart Contract Escrow. Send matching subtotal of <b>${totalPrice} USD</b>. The reservation status is updated instantly upon 3 block confirmations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "credit" && (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 animate-fade-in text-left text-xs font-semibold">
                <div className="space-y-2">
                  <label className="block text-slate-500 text-[11px] uppercase tracking-wider">
                    Corporate Registry ID (DUNS / VAT Code)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DUNS 382-9048-LX"
                    className="w-full bg-white text-xs py-3 px-4 rounded-xl border border-slate-200 focus:border-slate-500 focus:outline-none"
                    id="guest-duns-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-555 text-[11px] uppercase tracking-wider">
                    Pre-Authorized Comptroller Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. billing@company.com"
                    className="w-full bg-white text-xs py-3 px-4 rounded-xl border border-slate-200 focus:border-slate-500 focus:outline-none"
                    id="guest-accounting-email"
                  />
                  <span className="font-sans text-[9px] text-slate-400 block font-normal leading-normal">
                    ✓ Invoice billings will be routed automatically to your company accounts payable ledger.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Secure Submission button block */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs py-4.5 rounded-2xl shadow-md tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              id="confirm-booking-btn"
            >
              <ShieldCheck size={18} />
              CONFIRM RESERVATION AND HOLD SUITE
            </button>
            <p className="font-sans text-[10px] text-slate-400 font-semibold text-center mt-3">
              By confirming, you agree to our 24-hour elite cancellation policy rules. No booking fees or hidden surcharges are parsed.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
