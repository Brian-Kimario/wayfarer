/**
 * Flights Search & Results Page
 * Phase 8 Tier 2: Search for flights, view results, select flights for booking
 */

'use client';

import { useState, useEffect } from 'react';
import { Container, Button, Card, Badge, HeroImage, Modal, TakeoffIcon, AirplaneIcon } from '@/components';
import { formatMoney, formatDate } from '@/lib/format';
import Image from 'next/image';

interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    code: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  seatsAvailable: number;
  aircraft: string;
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first';
}

interface FlightSearchParams {
  departure: string;
  arrival: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'roundtrip' | 'oneway';
}

const MOCK_FLIGHTS: Flight[] = [
  {
    id: 1,
    airline: 'Emirates',
    flightNumber: 'EK 237',
    departure: {
      airport: 'Dar es Salaam Julius Nyerere',
      code: 'DAR',
      time: '14:30',
      date: '2026-10-15',
    },
    arrival: {
      airport: 'Dubai International',
      code: 'DXB',
      time: '23:00',
      date: '2026-10-15',
    },
    duration: '4h 30m',
    stops: 0,
    price: 450,
    seatsAvailable: 12,
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'economy',
  },
  {
    id: 2,
    airline: 'Kenya Airways',
    flightNumber: 'KQ 122',
    departure: {
      airport: 'Dar es Salaam Julius Nyerere',
      code: 'DAR',
      time: '08:15',
      date: '2026-10-15',
    },
    arrival: {
      airport: 'Jomo Kenyatta International',
      code: 'NBO',
      time: '10:45',
      date: '2026-10-15',
    },
    duration: '2h 30m',
    stops: 0,
    price: 280,
    seatsAvailable: 8,
    aircraft: 'Boeing 787-8',
    cabinClass: 'economy',
  },
  {
    id: 3,
    airline: 'Turkish Airlines',
    flightNumber: 'TK 857',
    departure: {
      airport: 'Dar es Salaam Julius Nyerere',
      code: 'DAR',
      time: '18:45',
      date: '2026-10-15',
    },
    arrival: {
      airport: 'Istanbul Airport',
      code: 'IST',
      time: '03:20',
      date: '2026-10-16',
    },
    duration: '6h 35m',
    stops: 0,
    price: 520,
    seatsAvailable: 15,
    aircraft: 'Airbus A350',
    cabinClass: 'premium-economy',
  },
];

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    departure: 'DAR',
    arrival: 'DXB',
    departDate: '2026-10-15',
    passengers: 1,
    tripType: 'oneway',
  });

  const [flights, setFlights] = useState<Flight[]>(MOCK_FLIGHTS);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showFlightDetail, setShowFlightDetail] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('price');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFlights(MOCK_FLIGHTS);
      setLoading(false);
    }, 800);
  };

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return a.departure.time.localeCompare(b.departure.time);
      case 'duration':
        const durationA = parseInt(a.duration);
        const durationB = parseInt(b.duration);
        return durationA - durationB;
      default:
        return 0;
    }
  });

  const cabinBadgeVariant = {
    economy: 'info',
    'premium-economy': 'warning',
    business: 'success',
    first: 'error',
  };

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80">
        <HeroImage category="FLIGHT" height={320} showAttribution={true} />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Find flights</h1>
            <p className="text-lg md:text-xl opacity-90">Search millions of flights and book instantly</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section
        className="py-8 md:py-12"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <Container>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Departure */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                From
              </label>
              <input
                type="text"
                value={searchParams.departure}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, departure: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="DAR"
                aria-label="Departure airport code"
              />
            </div>

            {/* Arrival */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                To
              </label>
              <input
                type="text"
                value={searchParams.arrival}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, arrival: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="DXB"
                aria-label="Arrival airport code"
              />
            </div>

            {/* Depart Date */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                Depart
              </label>
              <input
                type="date"
                value={searchParams.departDate}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, departDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
                aria-label="Departure date"
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                Passengers
              </label>
              <select
                value={searchParams.passengers}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
                aria-label="Number of passengers"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} passenger{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
                Trip
              </label>
              <select
                value={searchParams.tripType}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    tripType: e.target.value as 'roundtrip' | 'oneway',
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
                aria-label="Trip type"
              >
                <option value="oneway">One way</option>
                <option value="roundtrip">Round trip</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16 flex-1">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
              {flights.length} flights found
            </h2>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'departure' | 'duration')}
                className="px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: 'var(--color-border)' }}
                aria-label="Sort flights by"
              >
                <option value="price">Cheapest first</option>
                <option value="departure">Earliest departure</option>
                <option value="duration">Shortest duration</option>
              </select>
            </div>
          </div>

          {/* Live region for search results updates */}
          <div
            role="region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {flights.length} flights found
            {sortBy === 'price' && ' sorted by price'}
            {sortBy === 'departure' && ' sorted by departure time'}
            {sortBy === 'duration' && ' sorted by duration'}
          </div>

          {/* Flight Results */}
          <div className="space-y-4">
            {sortedFlights.map((flight) => (
              <Card key={flight.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        {flight.airline === 'Emirates' ? (
                          <TakeoffIcon size={24} color="var(--color-ocean-700)" />
                        ) : (
                          <AirplaneIcon size={24} color="var(--color-ocean-700)" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--color-ink)' }}>
                          {flight.airline} • {flight.flightNumber}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                          {flight.aircraft}
                        </p>
                      </div>
                    </div>

                    {/* Times & Stops */}
                    <div className="flex items-center gap-6 mb-2">
                      <div>
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                          {flight.departure.time}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                          {flight.departure.code}
                        </p>
                      </div>

                      <div className="flex-1 text-center">
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
                          {flight.duration}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 h-px bg-gradient-to-r from-ocean-700 to-transparent"></div>
                          {flight.stops === 0 ? (
                            <Badge variant="success" className="text-xs">
                              Direct
                            </Badge>
                          ) : (
                            <Badge variant="info" className="text-xs">
                              {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                            </Badge>
                          )}
                          <div className="flex-1 h-px bg-gradient-to-l from-ocean-700 to-transparent"></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-right" style={{ color: 'var(--color-ink)' }}>
                          {flight.arrival.time}
                        </p>
                        <p className="text-sm text-right" style={{ color: 'var(--color-muted)' }}>
                          {flight.arrival.code}
                        </p>
                      </div>
                    </div>

                    {/* Cabin Class Badge */}
                    <div className="mt-2">
                      <Badge variant={cabinBadgeVariant[flight.cabinClass] as any}>
                        {flight.cabinClass.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="w-full md:w-auto flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-ocean-700)' }}>
                        {formatMoney(flight.price)}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        per seat
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedFlight(flight);
                        setShowFlightDetail(true);
                      }}
                      aria-label={`Select ${flight.airline} flight ${flight.flightNumber} departing at ${flight.departure.time} for ${formatMoney(flight.price)}`}
                    >
                      Select flight
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Flight Detail Modal */}
      <Modal
        isOpen={showFlightDetail}
        onClose={() => setShowFlightDetail(false)}
        title={selectedFlight ? `${selectedFlight.airline} ${selectedFlight.flightNumber}` : 'Flight Details'}
      >
        {selectedFlight && (
          <div className="space-y-6">
            {/* Flight Times */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="text-2xl font-bold">{selectedFlight.departure.time}</p>
                <p className="text-sm font-medium">{selectedFlight.departure.code}</p>
                <p className="text-xs text-gray-500">{selectedFlight.departure.airport}</p>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">{selectedFlight.duration}</p>
                  {selectedFlight.stops === 0 ? (
                    <Badge variant="success">Direct</Badge>
                  ) : (
                    <Badge variant="info">{selectedFlight.stops} stop{selectedFlight.stops > 1 ? 's' : ''}</Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="text-2xl font-bold">{selectedFlight.arrival.time}</p>
                <p className="text-sm font-medium">{selectedFlight.arrival.code}</p>
                <p className="text-xs text-gray-500">{selectedFlight.arrival.airport}</p>
              </div>
            </div>

            {/* Flight Details */}
            <div className="space-y-2" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Aircraft</span>
                <span className="font-medium">{selectedFlight.aircraft}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Cabin Class</span>
                <Badge variant={cabinBadgeVariant[selectedFlight.cabinClass] as any}>
                  {selectedFlight.cabinClass.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Seats Available</span>
                <span className="font-medium">{selectedFlight.seatsAvailable}</span>
              </div>
            </div>

            {/* Pricing */}
            <div
              className="space-y-3"
              style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}
            >
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Price per seat</span>
                <span className="text-lg font-bold">{formatMoney(selectedFlight.price)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Number of passengers</span>
                <span className="text-lg font-bold">{searchParams.passengers}</span>
              </div>
              <div
                className="flex justify-between pt-3"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <span className="font-bold" style={{ color: 'var(--color-ink)' }}>
                  Total price
                </span>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-ocean-700)' }}>
                  {formatMoney(selectedFlight.price * searchParams.passengers)}
                </span>
              </div>
            </div>

            {/* Action */}
            <Button className="w-full mt-6" onClick={() => {
              // Navigate to checkout with flight data
              window.location.href = `/checkout?type=flight&flight_id=${selectedFlight.id}&seats=${searchParams.passengers}`;
            }}>
              Book now for {formatMoney(selectedFlight.price * searchParams.passengers)}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
