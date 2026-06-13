export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  size: string;
  bedType: string;
  amenities: string[];
  images: string[];
  availableCount: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  description: string;
  rating: number;
  reviewsCount: number;
  stars: number;
  amenities: string[];
  image: string;
  additionalImages: string[];
  minPrice: number;
  rooms: RoomType[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  taxes: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
