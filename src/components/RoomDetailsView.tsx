import React, { useState } from "react";
import { ArrowLeft, Star, MapPin, CheckCircle2, BedDouble, Scaling, Users, Calendar, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Hotel, RoomType } from "../types";
import { motion } from "motion/react";
import ReviewListAndForm from "./ReviewListAndForm";

interface RoomDetailsViewProps {
  hotel: Hotel;
  onBack: () => void;
  onSelectRoom: (room: RoomType) => void;
}

export default function RoomDetailsView({ hotel, onBack, onSelectRoom }: RoomDetailsViewProps) {
  // Swappable main image state
  const [activeImage, setActiveImage] = useState(hotel.image);

  const imagesList = [hotel.image, ...hotel.additionalImages];

  return (
    <div className="pb-16 text-left space-y-12">
      {/* Back Button and Path navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/85 hover:border-slate-300 font-sans font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          id="details-back-btn"
        >
          <ArrowLeft size={14} />
          Back to Listings
        </button>

        <span className="font-heading font-semibold text-[10px] text-slate-400 uppercase tracking-widest block leading-none">
          StayLux Portfolio • {hotel.city}
        </span>
      </div>

      {/* Main Banner and Swappable Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 relative"
          >
            <img
              src={activeImage}
              alt={hotel.name}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {hotel.stars === 5 && (
              <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded-md shadow-md border border-white/5 flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" />
                Ultra Elite Escape
              </span>
            )}
          </motion.div>

          {/* Miniature List */}
          <div className="grid grid-cols-4 gap-3">
            {imagesList.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 transition-all cursor-pointer relative ${
                  activeImage === img
                    ? "ring-3 ring-slate-900 ring-offset-2 scale-98"
                    : "opacity-75 hover:opacity-100"
                }`}
                id={`gallery-thumb-btn-${index}`}
              >
                <img
                  src={img}
                  alt={`Gallery thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Essential specifications side column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 stroke-amber-400" />
                ))}
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="font-sans text-xs text-slate-500 font-semibold">
                {hotel.rating.toFixed(2)} Rating ({hotel.reviewsCount} reviews)
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-none">
              {hotel.name}
            </h1>

            <p className="font-sans font-semibold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={13} className="text-slate-400" />
              {hotel.location}
            </p>

            <p className="font-sans text-xs sm:text-sm text-slate-600 font-light leading-relaxed pt-2">
              {hotel.description}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-widest">
              General Sanctuary Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 font-sans text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 size={13.5} className="text-emerald-500 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room listings section */}
      <div className="space-y-8 pt-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="font-heading font-extrabold text-xs text-slate-400 uppercase tracking-widest">
            Select Your Chamber
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
            Available Suites & Villas
          </h2>
          <p className="font-sans text-xs text-slate-500 font-medium">
            No booking fees. High quality continental breakfast and fully stocked organic minibar included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotel.rooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group text-left h-full"
              id={`room-card-${room.id}`}
            >
              {/* Room photo */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={room.images[0] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Room specs */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-tight group-hover:text-slate-700 transition-colors">
                      {room.name}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-700 font-sans font-bold text-[10px] px-2.5 py-1 rounded-md border border-emerald-100 whitespace-nowrap">
                      {room.availableCount} Remaining
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-500 leading-relaxed font-light">
                    {room.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-center space-y-0.5">
                      <Scaling size={14} className="mx-auto text-slate-400" />
                      <span className="font-sans text-[10px] font-bold text-slate-500 block leading-none">Size</span>
                      <span className="font-heading font-extrabold text-[11px] text-slate-800 block">{room.size}</span>
                    </div>
                    <div className="text-center space-y-0.5 border-x border-slate-200">
                      <BedDouble size={14} className="mx-auto text-slate-400" />
                      <span className="font-sans text-[10px] font-bold text-slate-500 block leading-none">Bed</span>
                      <span className="font-heading font-extrabold text-[11px] text-slate-800 block truncate px-0.5">{room.bedType}</span>
                    </div>
                    <div className="text-center space-y-0.5">
                      <Users size={14} className="mx-auto text-slate-400" />
                      <span className="font-sans text-[10px] font-bold text-slate-500 block leading-none">Capacity</span>
                      <span className="font-heading font-extrabold text-[11px] text-slate-800 block">{room.capacity} Guests</span>
                    </div>
                  </div>

                  {/* Suite specific amenities */}
                  <div className="space-y-1.5 pt-2">
                    <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Suite Exclusives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="bg-slate-50 border border-slate-100 text-slate-600 font-sans font-medium text-[9px] px-2 py-0.5 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & Reservation Action */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-auto">
                  <div>
                    <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                      Tonight's Price
                    </span>
                    <span className="font-heading font-extrabold text-xl text-slate-900 leading-tight block">
                      ${room.pricePerNight}{" "}
                      <span className="font-sans font-light text-xs text-slate-400">/ night</span>
                    </span>
                    <span className="text-[9px] font-sans font-semibold text-slate-400 block leading-none pt-0.5">
                      taxes & fees calculated next
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectRoom(room)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs py-3.5 px-4.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
                    id={`room-select-btn-${room.id}`}
                  >
                    Reserve Chamber
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verified Guest Reviews List & Interactive Rating Form */}
      <div className="pt-8 border-t border-slate-100">
        <ReviewListAndForm hotelId={hotel.id} />
      </div>
    </div>
  );
}
