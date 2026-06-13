import React, { useState } from "react";
import { Search, Calendar, Users, MapPin, Star, ArrowRight } from "lucide-react";
import { HOTELS_DATA, RECOMMENDED_CITIES } from "../data";
import { SearchQuery, Hotel } from "../types";
import { motion } from "motion/react";
import AiRecommendationWidget from "./AiRecommendationWidget";

interface HomeViewProps {
  onSearch: (query: SearchQuery) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onNavigate: (view: 'home' | 'hotels' | 'details' | 'book' | 'confirmation') => void;
}

export default function HomeView({ onSearch, onSelectHotel, onNavigate }: HomeViewProps) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("2026-06-22");
  const [checkOut, setCheckOut] = useState("2026-06-29");
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };

  const handleCityClick = (cityName: string) => {
    onSearch({
      destination: cityName,
      checkIn,
      checkOut,
      guests,
    });
  };

  // Get 3 highest rated hotels for featured section
  const featuredHotels = [...HOTELS_DATA]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Poster */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[21/9] min-h-[380px] flex items-center px-6 sm:px-12 lg:px-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Resort Pool"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-heading font-semibold text-xs text-white tracking-wider uppercase">
              Exclusive Summer Escapes 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight"
          >
            Unveil of <span className="text-slate-300">Absolute Luxury</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-slate-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed"
          >
            Indulge in private waterslides, ancient geothermal onsens, and custom sky sanctuaries. Hand-picked stays designed strictly for the extraordinary.
          </motion.p>
        </div>
      </div>

      {/* Advanced Search Form */}
      <div className="max-w-5xl mx-auto -mt-24 relative z-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-100"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* Destination */}
            <div className="md:col-span-4 text-left space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-400" />
                Destination
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Where are you whispering?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm font-medium text-slate-900 border border-slate-200/80 focus:border-slate-400 focus:outline-none py-3 px-4 rounded-xl transition-all"
                  id="search-dest-input"
                />
              </div>
            </div>

            {/* Check-In */}
            <div className="md:col-span-2.5 text-left space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} className="text-slate-400" />
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm font-medium text-slate-900 border border-slate-200/80 focus:border-slate-400 focus:outline-none py-3 px-4 rounded-xl transition-all"
                id="search-checkin-input"
              />
            </div>

            {/* Check-Out */}
            <div className="md:col-span-2.5 text-left space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} className="text-slate-400" />
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm font-medium text-slate-900 border border-slate-200/80 focus:border-slate-400 focus:outline-none py-3 px-4 rounded-xl transition-all"
                id="search-checkout-input"
              />
            </div>

            {/* Guests */}
            <div className="md:col-span-1.5 text-left space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Users size={12} className="text-slate-400" />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm font-semibold text-slate-900 border border-slate-200/80 focus:border-slate-400 focus:outline-none py-3 px-4 rounded-xl transition-all"
                id="search-guests-select"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1.5">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] cursor-pointer"
                id="search-submit-btn"
              >
                <Search size={16} />
                <span className="md:hidden lg:inline">Search</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Recommended Destinations */}
      <div className="space-y-6">
        <div className="text-left">
          <span className="font-heading font-extrabold text-xs text-slate-400 uppercase tracking-widest">
            Inspiration Generator
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
            Browse by Elite Haven
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {RECOMMENDED_CITIES.map((city, idx) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleCityClick(city.name)}
              className="group text-left relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none"
              id={`city-card-${city.name.toLowerCase()}`}
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="font-heading font-bold text-base text-white leading-tight">
                  {city.name}
                </p>
                <p className="font-sans text-[11px] text-slate-300 font-medium">
                  {city.country} • {city.count} Stays
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <span className="font-heading font-extrabold text-xs text-slate-400 uppercase tracking-widest">
              Highest Accolades
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              Curated Luxury Spotlights
            </h2>
          </div>
          <button
            onClick={() => onNavigate("hotels")}
            className="flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors group"
            id="view-all-hotels-btn"
          >
            Browse All Stays
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredHotels.map((hotel, idx) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
              id={`featured-hotel-card-${hotel.id}`}
            >
              {/* Image Banner */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md font-sans font-bold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm text-slate-800">
                  <Star size={12} className="fill-amber-500 stroke-amber-500" />
                  {hotel.rating.toFixed(2)} ({hotel.reviewsCount})
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md font-heading font-bold text-white text-xs px-3.5 py-1.5 rounded-xl shadow-md border border-white/10">
                  From ${hotel.minPrice} <span className="font-sans font-light text-[10px] text-slate-300">/ night</span>
                </div>
              </div>

              {/* Detail Content */}
              <div className="p-6 flex flex-col flex-grow text-left space-y-4">
                <div className="space-y-1">
                  <p className="font-sans font-medium text-[11px] text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                    <MapPin size={11} />
                    {hotel.location}
                  </p>
                  <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-tight group-hover:text-slate-700 transition-colors">
                    {hotel.name}
                  </h3>
                </div>

                <p className="font-sans text-xs text-slate-500 leading-relaxed font-light line-clamp-3">
                  {hotel.description}
                </p>

                {/* Amenities List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-slate-50 font-sans font-medium text-[10px] px-2.5 py-1 rounded-full text-slate-600 border border-slate-100"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="bg-slate-50 font-sans font-semibold text-[10px] px-2 py-1 rounded-full text-slate-400 border border-slate-100">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Call to action */}
                <div className="pt-4 mt-auto border-t border-slate-50">
                  <button
                    onClick={() => onSelectHotel(hotel)}
                    className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white transition-all duration-300 py-3 rounded-xl border border-slate-200 hover:border-slate-900 font-sans font-semibold text-xs text-slate-800 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    id={`featured-view-rooms-btn-${hotel.id}`}
                  >
                    Explore Rooms & Amenities
                    <ArrowRight size={13} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Premium Natural Language Getaway Engine */}
      <div className="pt-4 border-t border-slate-100">
        <AiRecommendationWidget onSelectHotel={onSelectHotel} />
      </div>
    </div>
  );
}
