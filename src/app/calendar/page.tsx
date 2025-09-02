'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Initialize Supabase client - temporarily disabled for deployment
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
// );

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  color: string | null;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using mock data');
          // Mock events for demonstration
          setEvents([
            {
              id: '1',
              title: 'plaza showcase',
              start_date: new Date().toISOString(),
              end_date: new Date().toISOString(),
              description: 'monthly curated collection reveal',
              color: 'black'
            },
            {
              id: '2',
              title: 'artist talk',
              start_date: new Date(Date.now() + 86400000).toISOString(),
              end_date: new Date(Date.now() + 86400000).toISOString(),
              description: 'contemporary digital art discussion',
              color: 'gray'
            }
          ]);
          setIsLoading(false);
          return;
        }

        const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd'T'23:59:59'Z'");

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', startDate)
          .lte('end_date', endDate)
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
          setEvents([]);
        } else {
          setEvents(data || []);
        }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-brutal border-black bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:text-black/60 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="mono-text text-sm uppercase tracking-wide">back to home</span>
            </a>
            
            <div className="text-center">
              <h1 className="heading-lg md:heading-xl text-black">public calendar</h1>
              <p className="mono-text text-xs md:text-sm text-black/60">community events • live updates</p>
            </div>
            
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Month Navigation */}
        <div className="glass-panel rounded-3xl p-6 mb-12">
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
        </div>

        {/* Calendar Grid */}
        <div className="glass-panel-strong rounded-3xl p-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center p-4">
                <span className="mono-text text-sm font-bold text-black/60">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-8 h-8 border-brutal border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="mono-text text-sm text-black/60">LOADING EVENTS...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDate && isSameDay(selectedDate, day);

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      min-h-24 p-3 rounded-2xl cursor-pointer transition-all duration-300 border-brutal
                      ${!isSameMonth(day, currentDate) ? 'opacity-30 border-black/10' : 'border-black/20'}
                      ${hasEvents ? 'bg-black text-white border-black' : 'hover:bg-black/5 hover:border-black/40'}
                      ${isSelected ? 'ring-2 ring-black' : ''}
                    `}
                  >
                    <div className="mono-text text-sm font-bold mb-2">
                      {format(day, 'd')}
                    </div>
                    
                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div key={event.id} className="text-xs font-medium truncate">
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs opacity-80">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showModal && selectedDate && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg glass-panel-strong rounded-3xl p-8 z-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-md text-black">
                {format(selectedDate, 'MMMM d, yyyy').toUpperCase()}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-black/5 rounded-2xl transition-colors"
              >
                <span className="text-xl text-black">×</span>
              </button>
            </div>

            {getEventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-black/40 mx-auto mb-4" />
                <p className="mono-text text-sm text-black/60">no events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className="glass-panel rounded-2xl p-6"
                  >
                    <h3 className="heading-md text-black mb-2">{event.title}</h3>
                    <div className="mono-text text-sm text-black/60 mb-3">
                      {format(new Date(event.start_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                    </div>
                    {event.description && (
                      <p className="body-text text-black/80">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 