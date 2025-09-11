'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Save, Trash2, MapPin, Calendar as CalendarIcon, Clock, Users, Star, Building2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client conditionally
const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) : null;

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

interface EventForm {
  title: string;
  performer: string;
  start_date: string;
  end_date: string;
  description: string;
  event_type: string;
  ticket_price: number | '';
  availability: number | '';
  venue_id: string;
  expert_curated: boolean;
}

export default function CalendarAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventForm, setEventForm] = useState<EventForm>({
    title: '',
    performer: '',
    start_date: '',
    end_date: '',
    description: '',
    event_type: 'concert',
    ticket_price: '',
    availability: '',
    venue_id: '',
    expert_curated: false
  });

  const [venueForm, setVenueForm] = useState({
    name: '',
    city: '',
    address: '',
    capacity: '',
    venue_type: 'concert_hall',
    brutalist_rating: 5,
    expert_verified: false
  });

  const eventTypes = [
    'concert',
    'exhibition',
    'fashion_show',
    'performance',
    'workshop',
    'festival',
    'gallery_opening',
    'theater'
  ];

  const venueTypes = [
    'concert_hall',
    'gallery',
    'club',
    'theater',
    'exhibition_hall',
    'warehouse',
    'outdoor_venue',
    'museum'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using mock data');
        setEvents([]);
        setVenues([]);
        setIsLoading(false);
        return;
      }

      // Fetch venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .order('name');

      if (venuesError) {
        console.error('Error fetching venues:', venuesError);
        setVenues([]);
      } else {
        setVenues(venuesData || []);
      }

      // Fetch events with venue data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .order('start_date');

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setEvents([]);
      } else {
        setEvents(eventsData || []);
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setEvents([]);
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        alert('Supabase not configured. Please set up environment variables.');
        return;
      }

      const eventData = {
        ...eventForm,
        ticket_price: eventForm.ticket_price === '' ? null : Number(eventForm.ticket_price),
        availability: eventForm.availability === '' ? 0 : Number(eventForm.availability)
      };

      let result;
      if (editingEvent) {
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
      } else {
        result = await supabase
          .from('events')
          .insert([eventData]);
      }

      if (result.error) {
        console.error('Error saving event:', result.error);
        alert('Error saving event. Please try again.');
      } else {
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        resetEventForm();
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        alert('Supabase not configured. Please set up environment variables.');
        return;
      }

      const venueData = {
        ...venueForm,
        capacity: Number(venueForm.capacity)
      };

      const { error } = await supabase
        .from('venues')
        .insert([venueData]);

      if (error) {
        console.error('Error saving venue:', error);
        alert('Error saving venue. Please try again.');
      } else {
        alert('Venue created successfully!');
        resetVenueForm();
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save venue:', error);
      alert('Failed to save venue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      } else {
        alert('Event deleted successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      performer: '',
      start_date: '',
      end_date: '',
      description: '',
      event_type: 'concert',
      ticket_price: '',
      availability: '',
      venue_id: '',
      expert_curated: false
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const resetVenueForm = () => {
    setVenueForm({
      name: '',
      city: '',
      address: '',
      capacity: '',
      venue_type: 'concert_hall',
      brutalist_rating: 5,
      expert_verified: false
    });
    setShowVenueForm(false);
  };

  const startEditEvent = (event: any) => {
    setEventForm({
      title: event.title,
      performer: event.performer,
      start_date: event.start_date.slice(0, 16), // Format for datetime-local input
      end_date: event.end_date.slice(0, 16),
      description: event.description || '',
      event_type: event.event_type,
      ticket_price: event.ticket_price || '',
      availability: event.availability || '',
      venue_id: event.venue_id,
      expert_curated: event.expert_curated
    });
    setEditingEvent(event);
    setShowEventForm(true);
  };

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
            <a href="/calendar" className="flex items-center space-x-3 hover:text-black/60 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="mono-text text-sm uppercase tracking-wide">BACK TO CALENDAR</span>
            </a>
            
            <div className="text-center">
              <h1 className="heading-lg text-black">CALENDAR ADMIN</h1>
              <p className="mono-text text-sm text-black/60 uppercase tracking-wider">EVENT MANAGEMENT</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowVenueForm(true)}
                className="btn-brutal-outline text-sm flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>ADD VENUE</span>
              </button>
              <button
                onClick={() => setShowEventForm(true)}
                className="btn-brutal text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD EVENT</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-panel rounded-3xl p-6 text-center">
              <CalendarIcon className="w-8 h-8 text-black mx-auto mb-4" />
              <div className="heading-md text-black mb-2">{events.length}</div>
              <div className="mono-text text-sm text-black/60">TOTAL EVENTS</div>
            </div>
            <div className="glass-panel rounded-3xl p-6 text-center">
              <Building2 className="w-8 h-8 text-black mx-auto mb-4" />
              <div className="heading-md text-black mb-2">{venues.length}</div>
              <div className="mono-text text-sm text-black/60">VENUES</div>
            </div>
            <div className="glass-panel rounded-3xl p-6 text-center">
              <Star className="w-8 h-8 text-black mx-auto mb-4" />
              <div className="heading-md text-black mb-2">{events.filter(e => e.expert_curated).length}</div>
              <div className="mono-text text-sm text-black/60">EXPERT CURATED</div>
            </div>
          </motion.div>

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-lg text-black">EVENTS</h2>
              <span className="mono-text text-sm text-black/60">{events.length} TOTAL</span>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="mono-text text-sm text-black/60">LOADING...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-black/20 mx-auto mb-6" />
                <h3 className="heading-md text-black/40 mb-4">NO EVENTS YET</h3>
                <p className="body-text text-black/60 mb-6">Create your first event to get started</p>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="btn-brutal flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD FIRST EVENT</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="glass-panel rounded-2xl p-6 hover:shadow-brutal-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2 text-black/70">
                            <Clock className="w-4 h-4" />
                            <span className="mono-text text-sm">
                              {new Date(event.start_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-black/70">
                            <MapPin className="w-4 h-4" />
                            <span className="mono-text text-sm">
                              {event.venue?.name || 'Unknown Venue'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-black/70">
                            <Users className="w-4 h-4" />
                            <span className="mono-text text-sm">
                              {event.availability || 0} available
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {event.ticket_price && (
                          <div className="text-right mr-4">
                            <div className="heading-md text-black">${event.ticket_price}</div>
                            <div className="mono-text text-xs text-black/60">TICKET</div>
                          </div>
                        )}
                        <button
                          onClick={() => startEditEvent(event)}
                          className="btn-brutal-outline text-sm"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Event Form Modal */}
      {showEventForm && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={resetEventForm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl glass-panel-strong rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-lg text-black">
                  {editingEvent ? 'EDIT EVENT' : 'ADD NEW EVENT'}
                </h2>
                <button onClick={resetEventForm} className="text-2xl text-black">×</button>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">EVENT TITLE</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">PERFORMER/ARTIST</label>
                    <input
                      type="text"
                      value={eventForm.performer}
                      onChange={(e) => setEventForm({...eventForm, performer: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">START DATE & TIME</label>
                    <input
                      type="datetime-local"
                      value={eventForm.start_date}
                      onChange={(e) => setEventForm({...eventForm, start_date: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">END DATE & TIME</label>
                    <input
                      type="datetime-local"
                      value={eventForm.end_date}
                      onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">DESCRIPTION</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">EVENT TYPE</label>
                    <select
                      value={eventForm.event_type}
                      onChange={(e) => setEventForm({...eventForm, event_type: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">TICKET PRICE ($)</label>
                    <input
                      type="number"
                      value={eventForm.ticket_price}
                      onChange={(e) => setEventForm({...eventForm, ticket_price: e.target.value === '' ? '' : Number(e.target.value)})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">AVAILABILITY</label>
                    <input
                      type="number"
                      value={eventForm.availability}
                      onChange={(e) => setEventForm({...eventForm, availability: e.target.value === '' ? '' : Number(e.target.value)})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">VENUE</label>
                  <select
                    value={eventForm.venue_id}
                    onChange={(e) => setEventForm({...eventForm, venue_id: e.target.value})}
                    className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    required
                  >
                    <option value="">SELECT VENUE</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="expert_curated"
                    checked={eventForm.expert_curated}
                    onChange={(e) => setEventForm({...eventForm, expert_curated: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="expert_curated" className="mono-text text-sm text-black/60">
                    EXPERT CURATED EVENT
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-black/10">
                  <button
                    type="button"
                    onClick={resetEventForm}
                    className="btn-brutal-outline"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-brutal flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'SAVING...' : (editingEvent ? 'UPDATE EVENT' : 'CREATE EVENT')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}

      {/* Venue Form Modal */}
      {showVenueForm && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={resetVenueForm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl glass-panel-strong rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-lg text-black">ADD NEW VENUE</h2>
                <button onClick={resetVenueForm} className="text-2xl text-black">×</button>
              </div>

              <form onSubmit={handleVenueSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">VENUE NAME</label>
                    <input
                      type="text"
                      value={venueForm.name}
                      onChange={(e) => setVenueForm({...venueForm, name: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">CITY</label>
                    <input
                      type="text"
                      value={venueForm.city}
                      onChange={(e) => setVenueForm({...venueForm, city: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">ADDRESS</label>
                  <input
                    type="text"
                    value={venueForm.address}
                    onChange={(e) => setVenueForm({...venueForm, address: e.target.value})}
                    className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">CAPACITY</label>
                    <input
                      type="number"
                      value={venueForm.capacity}
                      onChange={(e) => setVenueForm({...venueForm, capacity: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">VENUE TYPE</label>
                    <select
                      value={venueForm.venue_type}
                      onChange={(e) => setVenueForm({...venueForm, venue_type: e.target.value})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    >
                      {venueTypes.map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">BRUTALIST RATING (1-10)</label>
                    <input
                      type="number"
                      value={venueForm.brutalist_rating}
                      onChange={(e) => setVenueForm({...venueForm, brutalist_rating: Number(e.target.value)})}
                      className="w-full p-3 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm font-medium text-sm focus:border-black focus:outline-none transition-colors"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="expert_verified"
                    checked={venueForm.expert_verified}
                    onChange={(e) => setVenueForm({...venueForm, expert_verified: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="expert_verified" className="mono-text text-sm text-black/60">
                    EXPERT VERIFIED VENUE
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-black/10">
                  <button
                    type="button"
                    onClick={resetVenueForm}
                    className="btn-brutal-outline"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-brutal flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'SAVING...' : 'CREATE VENUE'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
