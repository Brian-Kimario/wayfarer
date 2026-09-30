/**
 * Trips Page
 * Phase 8 Tier 2: View, organize, and manage multi-leg trips combining flights and stays
 */

'use client';

import { useState } from 'react';
import { Container, Card, Badge, Button, Modal, HeroImage } from '@/components';
import { formatMoney, formatDate } from '@/lib/format';

interface TripLeg {
  id: number;
  type: 'flight' | 'stay';
  startDate: string;
  endDate: string;
  location: string;
  details: {
    departure?: string;
    arrival?: string;
    flightNumber?: string;
    airline?: string;
    duration?: string;
    propertyName?: string;
    nights?: number;
    roomType?: string;
  };
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  legs: TripLeg[];
  totalPrice: number;
  image?: string;
  description?: string;
  createdDate: string;
}

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-001',
    name: 'Dubai & Paris Adventure',
    destination: 'Dubai → Paris',
    startDate: '2026-10-15',
    endDate: '2026-10-28',
    createdDate: '2026-09-20',
    totalPrice: 2850,
    description: 'A 2-week journey combining luxury shopping in Dubai with cultural exploration in Paris.',
    legs: [
      {
        id: 1,
        type: 'flight',
        startDate: '2026-10-15',
        endDate: '2026-10-15',
        location: 'DAR → DXB',
        details: {
          departure: '14:30',
          arrival: '23:00',
          flightNumber: 'EK 237',
          airline: 'Emirates',
          duration: '4h 30m',
        },
        price: 450,
        status: 'confirmed',
      },
      {
        id: 2,
        type: 'stay',
        startDate: '2026-10-15',
        endDate: '2026-10-22',
        location: 'Dubai, UAE',
        details: {
          propertyName: 'Burj Al Arab',
          nights: 7,
          roomType: 'Deluxe Suite',
        },
        price: 1400,
        status: 'confirmed',
      },
      {
        id: 3,
        type: 'flight',
        startDate: '2026-10-22',
        endDate: '2026-10-22',
        location: 'DXB → CDG',
        details: {
          departure: '11:00',
          arrival: '16:20',
          flightNumber: 'AF 122',
          airline: 'Air France',
          duration: '5h 20m',
        },
        price: 520,
        status: 'confirmed',
      },
      {
        id: 4,
        type: 'stay',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        location: 'Paris, France',
        details: {
          propertyName: 'Le Marais Boutique Hotel',
          nights: 6,
          roomType: 'Deluxe Room',
        },
        price: 480,
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'trip-002',
    name: 'East African Safari',
    destination: 'Kenya & Tanzania',
    startDate: '2026-11-01',
    endDate: '2026-11-10',
    createdDate: '2026-09-15',
    totalPrice: 1920,
    description: 'Explore the wildlife and natural wonders of East Africa.',
    legs: [
      {
        id: 1,
        type: 'flight',
        startDate: '2026-11-01',
        endDate: '2026-11-01',
        location: 'DAR → NBO',
        details: {
          departure: '08:15',
          arrival: '10:45',
          flightNumber: 'KQ 122',
          airline: 'Kenya Airways',
          duration: '2h 30m',
        },
        price: 280,
        status: 'confirmed',
      },
      {
        id: 2,
        type: 'stay',
        startDate: '2026-11-01',
        endDate: '2026-11-05',
        location: 'Nairobi, Kenya',
        details: {
          propertyName: 'Safari Park Hotel',
          nights: 4,
          roomType: 'Safari Suite',
        },
        price: 800,
        status: 'confirmed',
      },
      {
        id: 3,
        type: 'flight',
        startDate: '2026-11-05',
        endDate: '2026-11-05',
        location: 'NBO → DAR',
        details: {
          departure: '16:00',
          arrival: '18:30',
          flightNumber: 'KQ 125',
          airline: 'Kenya Airways',
          duration: '2h 30m',
        },
        price: 280,
        status: 'pending',
      },
      {
        id: 4,
        type: 'stay',
        startDate: '2026-11-05',
        endDate: '2026-11-10',
        location: 'Zanzibar, Tanzania',
        details: {
          propertyName: 'Zanzibar Clove Resort',
          nights: 5,
          roomType: 'Beach Bungalow',
        },
        price: 560,
        status: 'pending',
      },
    ],
  },
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');

  const getStatusBadge = (status: TripLeg['status']) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
    };
    return variants[status] as any;
  };

  const filteredTrips = trips.filter((trip) => {
    if (filterStatus === 'upcoming') {
      return new Date(trip.startDate) > new Date();
    } else if (filterStatus === 'past') {
      return new Date(trip.endDate) < new Date();
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80">
        <HeroImage category="ADVENTURE" height={320} showAttribution={true} />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your trips</h1>
            <p className="text-lg md:text-xl opacity-90">Manage your flights, stays, and itineraries in one place</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section
        className="py-8 md:py-12"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <Container>
          <div className="flex gap-3">
            {(['all', 'upcoming', 'past'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-[var(--color-ocean-700)] text-white'
                    : 'bg-white border'
                }`}
                style={
                  filterStatus !== status
                    ? { borderColor: 'var(--color-border)' }
                    : {}
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} trips
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Trips List */}
      <section className="py-12 md:py-16 flex-1">
        <Container>
          {/* Live region for trips filter updates */}
          <div
            role="region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {filterStatus === 'all' && `Showing all ${filteredTrips.length} trips`}
            {filterStatus === 'upcoming' && `Showing ${filteredTrips.length} upcoming trips`}
            {filterStatus === 'past' && `Showing ${filteredTrips.length} past trips`}
          </div>

          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✈️</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                No trips yet
              </h2>
              <p style={{ color: 'var(--color-muted)' }} className="mb-6">
                Plan your first adventure and create a trip combining flights and stays.
              </p>
              <a href="/">
                <Button>Start planning</Button>
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredTrips.map((trip) => {
                const confirmedLegs = trip.legs.filter((l) => l.status === 'confirmed').length;
                const totalLegs = trip.legs.length;

                return (
                  <Card
                    key={trip.id}
                    className="p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTrip(trip);
                      setShowTripDetail(true);
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: Trip Info */}
                      <div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                          {trip.name}
                        </h3>
                        <p className="text-lg mb-3" style={{ color: 'var(--color-muted)' }}>
                          {trip.destination}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                        </p>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                          Created {formatDate(trip.createdDate)}
                        </p>
                      </div>

                      {/* Middle: Legs Status */}
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                            Itinerary ({totalLegs} legs)
                          </p>
                          <div className="space-y-2">
                            {trip.legs.map((leg, idx) => (
                              <div key={leg.id} className="flex items-center gap-2 text-sm">
                                <span>{leg.type === 'flight' ? '✈️' : '🏨'}</span>
                                <span style={{ color: 'var(--color-muted)' }}>
                                  {leg.type === 'flight'
                                    ? leg.details.departure + ' → ' + leg.details.arrival
                                    : leg.location}
                                </span>
                                <Badge variant={getStatusBadge(leg.status)} className="text-xs">
                                  {leg.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            Total trip cost
                          </p>
                          <p className="text-3xl font-bold" style={{ color: 'var(--color-ocean-700)' }}>
                            {formatMoney(trip.totalPrice)}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
                            {confirmedLegs}/{totalLegs} confirmed
                          </p>
                        </div>
                        <Button size="sm" variant="secondary">
                          View details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Trip Detail Modal */}
      <Modal
        isOpen={showTripDetail}
        onClose={() => setShowTripDetail(false)}
        title={selectedTrip?.name || 'Trip Details'}
      >
        {selectedTrip && (
          <div className="space-y-6">
            {/* Trip Overview */}
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                Trip Summary
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-muted)' }}>Destination</span>
                  <span className="font-medium">{selectedTrip.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-muted)' }}>Dates</span>
                  <span className="font-medium">
                    {formatDate(selectedTrip.startDate)} – {formatDate(selectedTrip.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-muted)' }}>Duration</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(selectedTrip.endDate).getTime() -
                        new Date(selectedTrip.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Legs */}
            <div
              style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}
            >
              <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
                Itinerary ({selectedTrip.legs.length} legs)
              </h3>
              <div className="space-y-4">
                {selectedTrip.legs.map((leg, idx) => (
                  <div key={leg.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {leg.type === 'flight' ? '✈️' : '🏨'}
                        </span>
                        <div>
                          <p className="font-bold" style={{ color: 'var(--color-ink)' }}>
                            {leg.type === 'flight' ? 'Flight' : 'Stay'}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            {formatDate(leg.startDate)}
                            {leg.endDate !== leg.startDate && ` – ${formatDate(leg.endDate)}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadge(leg.status)}>
                        {leg.status}
                      </Badge>
                    </div>

                    {/* Leg Details */}
                    {leg.type === 'flight' ? (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p style={{ color: 'var(--color-muted)' }}>From</p>
                          <p className="font-bold">{leg.details.departure}</p>
                        </div>
                        <div className="text-center">
                          <p style={{ color: 'var(--color-muted)' }}>Duration</p>
                          <p className="font-bold">{leg.details.duration}</p>
                        </div>
                        <div className="text-right">
                          <p style={{ color: 'var(--color-muted)' }}>To</p>
                          <p className="font-bold">{leg.details.arrival}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--color-muted)' }}>Property</span>
                          <span className="font-medium">{leg.details.propertyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--color-muted)' }}>Room Type</span>
                          <span className="font-medium">{leg.details.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--color-muted)' }}>Nights</span>
                          <span className="font-medium">{leg.details.nights}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--color-muted)' }}>Leg price</span>
                        <span className="font-bold">{formatMoney(leg.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div
              className="pt-6"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg" style={{ color: 'var(--color-ink)' }}>
                  Total trip cost
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--color-ocean-700)' }}>
                  {formatMoney(selectedTrip.totalPrice)}
                </span>
              </div>
              <Button className="w-full mb-3">Manage trip</Button>
              <button
                className="w-full px-4 py-2 border rounded-lg font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel trip
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
