import React, { useState, useMemo } from "react";
import { Star, MapPin, Search, SlidersHorizontal, X, ArrowUpDown, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { HOTELS_DATA } from "../data";
import { Hotel, SearchQuery } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HotelListViewProps {
  searchQuery: SearchQuery;
  onSelectHotel: (hotel: Hotel) => void;
  onClearSearch: () => void;
  onUpdateSearch: (query: SearchQuery) => void;
}

export default function HotelListView({
  searchQuery,
  onSelectHotel,
  onClearSearch,
  onUpdateSearch,
}: HotelListViewProps) {
  // Filters state
  const [keyword, setKeyword] = useState(searchQuery.destination || "");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "rating">("recommended");

  // Get list of all distinct amenities across all hotels
  const allAmenities = useMemo(() => {
    const amenitiesSet = new Set<string>();
    HOTELS_DATA.forEach((hotel) => {
      hotel.amenities.forEach((amenity) => amenitiesSet.add(amenity));
    });
    return Array.from(amenitiesSet);
  }, []);

  // Filtered and sorted Hotels list
  const filteredHotels = useMemo(() => {
    let result = [...HOTELS_DATA];

    // Filter by Destination / Keyword
    const queryStr = keyword.toLowerCase().trim();
    if (queryStr) {
      result = result.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(queryStr) ||
          hotel.city.toLowerCase().includes(queryStr) ||
          hotel.location.toLowerCase().includes(queryStr) ||
          hotel.description.toLowerCase().includes(queryStr)
      );
    }

    // Filter by Max Price
    result = result.filter((hotel) => hotel.minPrice <= maxPrice);

    // Filter by Stars
    if (selectedStars.length > 0) {
      result = result.filter((hotel) => selectedStars.includes(hotel.stars));
    }

    // Filter by Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((hotel) =>
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [keyword, maxPrice, selectedStars, selectedAmenities, sortBy]);

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setKeyword("");
    setMaxPrice(1500);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSortBy("recommended");
    onClearSearch();
  };

  return (
    <div className="pb-16 text-left">
      {/* Header and Summary Bar */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="font-heading font-extrabold text-xs text-slate-400 uppercase tracking-widest leading-none">
            Selected Escape Criteria
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1 leading-tight">
            {keyword ? `Properties in "${keyword}"` : "Explore Luxury Portfolios"}
          </h1>
          <p className="font-sans text-xs text-slate-500 font-medium mt-1">
            Displaying {filteredHotels.length} of {HOTELS_DATA.length} available properties matching check-in {searchQuery.checkIn || "2026-06-22"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {searchQuery.destination && (
            <span className="bg-slate-900 text-white font-sans font-semibold text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <MapPin size={11} />
              {searchQuery.destination}
            </span>
          )}
          {(searchQuery.destination || selectedStars.length > 0 || selectedAmenities.length > 0 || maxPrice < 1500) && (
            <button
              onClick={handleResetFilters}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs font-sans font-semibold text-xs py-2 px-3.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
              id="clear-all-filters-btn"
            >
              Reset Filters
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6 sticky top-28">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-slate-500" />
                Refine Search
              </h2>
              <button
                onClick={handleResetFilters}
                className="font-sans text-[11px] font-semibold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                id="sidebar-reset-btn"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Keyword / City
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Greece..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-semibold text-slate-900 border border-slate-200/80 focus:border-slate-400 focus:outline-none py-2.5 pl-9 pr-4 rounded-xl transition-all"
                  id="filter-keyword-input"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Maximum Budget
                </label>
                <span className="font-sans font-extrabold text-xs text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  ${maxPrice} / night
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                id="filter-price-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Min: $200</span>
                <span>Max: $1500</span>
              </div>
            </div>

            {/* Star Rating Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Star Rating
              </label>
              <div className="flex flex-col gap-2">
                {[5, 4].map((star) => (
                  <button
                    key={star}
                    onClick={() => toggleStar(star)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedStars.includes(star)
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
                    }`}
                    id={`filter-star-btn-${star}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {Array.from({ length: star }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={selectedStars.includes(star) ? "fill-white stroke-white" : "fill-amber-400 stroke-amber-400"}
                        />
                      ))}
                    </span>
                    <span className={selectedStars.includes(star) ? "text-slate-200" : "text-slate-400"}>
                      {star} Stars
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Luxury Offerings
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 py-1 custom-scrollbar">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4.5 w-4.5 transition-colors cursor-pointer accent-slate-900"
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hotels Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting and Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
            <span className="font-sans text-xs text-slate-500 font-semibold">
              Showing <span className="text-slate-900 font-bold">{filteredHotels.length}</span> luxury matches
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={13} className="text-slate-400" />
              <span className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 font-sans font-bold text-xs pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-200/80 text-slate-800 focus:outline-none"
                id="sorting-select"
              >
                <option value="recommended">Best Match / Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Guest Rating Level</option>
              </select>
            </div>
          </div>

          {/* Results Grid / List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row group text-left h-full"
                    id={`hotel-list-card-${hotel.id}`}
                  >
                    {/* Cover Photo */}
                    <div className="md:w-2/5 relative min-h-[220px] bg-slate-100 overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm font-sans font-bold text-[11px] text-slate-800 border border-slate-100">
                        <Star size={11} className="fill-amber-400 stroke-amber-400" />
                        {hotel.rating.toFixed(2)}
                      </div>
                      {hotel.stars === 5 && (
                        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md text-white font-heading font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                          <ShieldCheck size={11} className="text-emerald-400" />
                          Ultra Luxury Class
                        </div>
                      )}
                    </div>

                    {/* Specifications */}
                    <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <p className="font-sans font-semibold text-[10px] text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                          <MapPin size={11} />
                          {hotel.location}
                        </p>
                        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-slate-700 transition-colors">
                          {hotel.name}
                        </h3>
                      </div>

                      <p className="font-sans text-xs text-slate-500 font-light leading-relaxed line-clamp-3">
                        {hotel.description}
                      </p>

                      {/* Amenities checklist preview */}
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className={`font-sans font-medium text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                              selectedAmenities.includes(amenity)
                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-100"
                            }`}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Price tag & Reserve button */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <div>
                          <span className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                            Starting Rate
                          </span>
                          <span className="font-heading font-extrabold text-xl text-slate-900 leading-tight block">
                            ${hotel.minPrice}{" "}
                            <span className="font-sans font-light text-xs text-slate-400">/ night</span>
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectHotel(hotel)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs py-3 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-sm hover:scale-[1.02]"
                          id={`hotel-list-view-rooms-btn-${hotel.id}`}
                        >
                          Explore Suites
                          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-4"
                  id="empty-hotel-results"
                >
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Search size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    No matching sanctuaries found
                  </h3>
                  <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Adjust price parameters, toggle your star rating checkboxes, or reset all filter entries to find a suitable stay.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                    id="no-results-reset-btn"
                  >
                    Reset Filter Forms
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
