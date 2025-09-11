'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, Star, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Initialize Supabase client - temporarily disabled for deployment
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
// );

interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  venue_type: string;
  brutalist_rating: number;
  expert_verified: boolean;
}

interface Event {
  id: string;
  title: string;
  performer: string;
  start_date: string;
  end_date: string;
  description: string;
  event_type: string;
  ticket_price: number | null;
  availability: number;
  expert_curated: boolean;
  venue: Venue;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using mock data');
          // Enhanced mock events with venue data for demonstration
          setEvents([
            {
              id: '1',
              title: 'BRUTALIST FASHION SHOW',
              performer: 'EMERGING DESIGNERS COLLECTIVE',
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 3600000).toISOString(),
              description: 'Architectural fashion meets brutalist design philosophy',
              event_type: 'fashion_show',
              ticket_price: 85,
              availability: 120,
              expert_curated: true,
              venue: {
                id: 'v1',
                name: 'CONCRETE GALLERY',
                city: 'NEW YORK',
                address: '450 W 14th St',
                capacity: 200,
                venue_type: 'gallery',
                brutalist_rating: 9,
                expert_verified: true
              }
            },
            {
              id: '2',
              title: 'DIGITAL ART EXHIBITION',
              performer: 'VARIOUS ARTISTS',
              start_date: new Date(Date.now() + 86400000).toISOString(),
              end_date: new Date(Date.now() + 90000000).toISOString(),
              description: 'Contemporary digital art and NFT showcase',
              event_type: 'exhibition',
              ticket_price: 25,
              availability: 300,
              expert_curated: true,
              venue: {
                id: 'v2',
                name: 'PLAZA SPACE',
                city: 'LOS ANGELES',
                address: '8000 Sunset Blvd',
                capacity: 400,
                venue_type: 'exhibition_hall',
                brutalist_rating: 8,
                expert_verified: true
              }
            },
            {
              id: '3',
              title: 'UNDERGROUND CONCERT SERIES',
              performer: 'ELECTRONIC COLLECTIVE',
              start_date: new Date(Date.now() + 172800000).toISOString(),
              end_date: new Date(Date.now() + 176400000).toISOString(),
              description: 'Experimental electronic music in brutalist architecture',
              event_type: 'concert',
              ticket_price: 45,
              availability: 80,
              expert_curated: false,
              venue: {
                id: 'v3',
                name: 'THE BUNKER',
                city: 'LONDON',
                address: 'Shoreditch Underground',
                capacity: 150,
                venue_type: 'club',
                brutalist_rating: 10,
                expert_verified: true
              }
            }
          ]);
          setIsLoading(false);
          return;
        }

        const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd'T'23:59:59'Z'");

        // Temporarily disabled for deployment - will set up Supabase later
        // const { data, error } = await supabase
        //   .from('events')
        //   .select('*')
        //   .gte('start_date', startDate)
        //   .lte('end_date', endDate)
        //   .order('start_date', { ascending: true });

        // if (error) {
        //   console.error('Error fetching events:', error);
        //   setEvents([]);
        // } else {
        //   setEvents(data || []);
        // }
        
        // Temporary: Set empty events for now
        setEvents([]);

      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  // Get all days in current month
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!events) return [];
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      return isSameDay(eventStart, date);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const filteredEvents = events.filter(event => {
    const matchesCity = selectedCity === 'ALL' || event.venue.city === selectedCity;
    const matchesType = selectedEventType === 'ALL' || event.event_type === selectedEventType;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.performer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCity && matchesType && matchesSearch;
  });

  const cities = ['ALL', ...Array.from(new Set(events.map(e => e.venue.city)))];
  const eventTypes = ['ALL', ...Array.from(new Set(events.map(e => e.event_type)))];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b-4 border-black bg-white/90 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <a href="/home" className="flex items-center space-x-3 hover:text-black/60 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="mono-text text-sm uppercase tracking-wide">BACK TO PLAZA</span>
            </a>
            
            <div className="text-center">
              <h1 className="heading-lg text-black">CALENDAR</h1>
              <p className="mono-text text-sm text-black/60 uppercase tracking-wider">LIVE CITY CULTURE</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                className="btn-brutal-outline text-sm"
              >
                {viewMode === 'calendar' ? 'LIST' : 'CALENDAR'}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="px-6 py-8 border-b-2 border-black/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-3xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  type="text"
                  placeholder="SEARCH EVENTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm uppercase tracking-wide placeholder:text-black/40 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm uppercase tracking-wide focus:border-black focus:outline-none transition-colors"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Event Type Filter */}
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-4 py-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm uppercase tracking-wide focus:border-black focus:outline-none transition-colors"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>

              {/* Expert Curated Toggle */}
              <div className="flex items-center justify-center space-x-2 px-4 py-3 glass-panel-dark rounded-xl">
                <Star className="w-4 h-4 text-black/60" />
                <span className="mono-text text-xs uppercase tracking-wider text-black/60">EXPERT CURATED</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {viewMode === 'calendar' ? (
            <>
              {/* Month Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-panel rounded-3xl p-6 mb-12"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={previousMonth}
                    className="btn-brutal-outline flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>PREV</span>
                  </button>
                  
                  <h2 className="heading-lg text-black">
                    {format(currentDate, 'MMMM yyyy').toUpperCase()}
                  </h2>
                  
                  <button
                    onClick={nextMonth}
                    className="btn-brutal-outline flex items-center space-x-2"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Calendar Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-panel-strong rounded-3xl p-4 sm:p-6 lg:p-8"
              >
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-center p-1 sm:p-2 lg:p-4">
                      <span className="mono-text text-xs sm:text-sm font-bold text-black/60">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <span className="mono-text text-sm text-black/60">LOADING EVENTS...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {monthDays.map((day, index) => {
                      const dayEvents = getEventsForDate(day).filter(event => 
                        filteredEvents.includes(event)
                      );
                      const hasEvents = dayEvents.length > 0;
                      const isSelected = selectedDate && isSameDay(selectedDate, day);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.01 }}
                          onClick={() => handleDateClick(day)}
                          className={`
                            min-h-12 sm:min-h-16 lg:min-h-24 p-1 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 border border-black/20 sm:border-2 flex flex-col items-center justify-center text-center relative
                            ${!isSameMonth(day, currentDate) ? 'opacity-30 border-black/10' : ''}
                            ${hasEvents ? 'bg-black text-white border-black' : 'hover:bg-black/5 hover:border-black/40'}
                            ${isSelected ? 'ring-1 sm:ring-2 ring-black' : ''}
                          `}
                        >
                          {/* Day Number */}
                          <div className="mono-text text-xs sm:text-sm lg:text-base font-bold mb-0.5 sm:mb-1">
                            {format(day, 'd')}
                          </div>
                          
                          {/* Events Indicator */}
                          {hasEvents && (
                            <>
                              {/* Mobile: Simple dot indicator */}
                              <div className="sm:hidden">
                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${
                                  hasEvents && !isSameMonth(day, currentDate) ? 'bg-white/50' :
                                  hasEvents ? 'bg-white' : ''
                                }`} />
                                {dayEvents.length > 1 && (
                                  <div className="text-xs opacity-75 mt-0.5">
                                    {dayEvents.length}
                                  </div>
                                )}
                              </div>
                              
                              {/* Tablet & Desktop: Show event titles */}
                              <div className="hidden sm:block space-y-1 w-full">
                                {dayEvents.slice(0, 2).map(event => (
                                  <div key={event.id} className="text-xs font-medium truncate px-1">
                                    {event.title.length > 15 ? event.title.substring(0, 12) + '...' : event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs opacity-80">
                                    +{dayEvents.length - 2}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            /* List View */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center mb-12">
                <h2 className="heading-lg text-black mb-4">UPCOMING EVENTS</h2>
                <p className="body-text text-black/70">
                  {filteredEvents.length} events found across {cities.length - 1} cities
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <span className="mono-text text-sm text-black/60">LOADING EVENTS...</span>
                  </div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-24">
                  <CalendarIcon className="w-16 h-16 text-black/20 mx-auto mb-6" />
                  <h3 className="heading-md text-black/40 mb-4">NO EVENTS FOUND</h3>
                  <p className="body-text text-black/60">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="glass-panel rounded-3xl p-6 hover:shadow-brutal-hover transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {event.expert_curated && (
                              <Star className="w-4 h-4 text-black fill-current" />
                            )}
                            <span className="mono-text text-xs uppercase tracking-wider text-black/60">
                              {event.event_type.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="heading-md text-black mb-2">{event.title}</h3>
                          <p className="body-text text-sm text-black/80 mb-2">{event.performer}</p>
                        </div>
                        {event.ticket_price && (
                          <div className="text-right">
                            <div className="heading-md text-black">${event.ticket_price}</div>
                            <div className="mono-text text-xs text-black/60">TICKET</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-black/70">
                          <Clock className="w-4 h-4" />
                          <span className="mono-text text-sm">
                            {format(new Date(event.start_date), 'MMM d, h:mm a')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-black/70">
                          <MapPin className="w-4 h-4" />
                          <span className="mono-text text-sm">
                            {event.venue.name}, {event.venue.city}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-black/70">
                          <Users className="w-4 h-4" />
                          <span className="mono-text text-sm">
                            {event.availability}/{event.venue.capacity} available
                          </span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="body-text text-sm text-black/80 mt-4 pt-4 border-t-2 border-black/10">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="mono-text text-xs text-black/60">
                            BRUTALIST RATING: {event.venue.brutalist_rating}/10
                          </span>
                        </div>
                        <button className="btn-brutal-outline text-sm">
                          VIEW DETAILS
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Enhanced Event Modal */}
      {showModal && selectedDate && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            onClick={() => setShowModal(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-2xl glass-panel-strong rounded-3xl p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-lg text-black">
                  {format(selectedDate, 'MMMM d, yyyy').toUpperCase()}
                </h2>
                <p className="mono-text text-sm text-black/60 mt-2">
                  {getEventsForDate(selectedDate).filter(event => filteredEvents.includes(event)).length} EVENTS
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-black/5 rounded-2xl transition-colors"
              >
                <span className="text-2xl text-black font-light">×</span>
              </button>
            </div>

            {getEventsForDate(selectedDate).filter(event => filteredEvents.includes(event)).length === 0 ? (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-black/20 mx-auto mb-6" />
                <h3 className="heading-md text-black/40 mb-4">NO EVENTS SCHEDULED</h3>
                <p className="body-text text-black/60">Check back later for new events</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getEventsForDate(selectedDate).filter(event => filteredEvents.includes(event)).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="glass-panel rounded-2xl p-6 hover:shadow-brutal-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {event.expert_curated && (
                            <Star className="w-4 h-4 text-black fill-current" />
                          )}
                          <span className="mono-text text-xs uppercase tracking-wider text-black/60">
                            {event.event_type.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="heading-md text-black mb-2">{event.title}</h3>
                        <p className="body-text text-sm text-black/80">{event.performer}</p>
                      </div>
                      {event.ticket_price && (
                        <div className="text-right">
                          <div className="heading-md text-black">${event.ticket_price}</div>
                          <div className="mono-text text-xs text-black/60">TICKET</div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-black/70">
                        <Clock className="w-4 h-4" />
                        <div>
                          <div className="mono-text text-sm">
                            {format(new Date(event.start_date), 'h:mm a')}
                          </div>
                          <div className="mono-text text-xs text-black/50">
                            {format(new Date(event.end_date), 'h:mm a')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-black/70">
                        <MapPin className="w-4 h-4" />
                        <div>
                          <div className="mono-text text-sm">{event.venue.name}</div>
                          <div className="mono-text text-xs text-black/50">{event.venue.city}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-black/70">
                        <Users className="w-4 h-4" />
                        <div>
                          <div className="mono-text text-sm">{event.availability} available</div>
                          <div className="mono-text text-xs text-black/50">of {event.venue.capacity}</div>
                        </div>
                      </div>
                    </div>

                    {event.description && (
                      <p className="body-text text-sm text-black/80 mb-4 pb-4 border-b-2 border-black/10">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="mono-text text-xs text-black/60">
                            BRUTALIST: {event.venue.brutalist_rating}/10
                          </span>
                        </div>
                        {event.venue.expert_verified && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="mono-text text-xs text-black/60">VERIFIED</span>
                          </div>
                        )}
                      </div>
                      <button className="btn-brutal text-sm">
                        GET TICKETS
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
} 