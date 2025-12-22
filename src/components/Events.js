import React from 'react';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import Footer from './Footer';
import './Page.css';
import './Events.css';

const Events = () => {
  // Event data - easily add images by replacing the imageUrl with actual paths
  const events = [
    {
      id: 1,
      title: 'Mental Health Awareness Workshop',
      date: 'March 15, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      description: 'Join us for an interactive workshop focused on mental health awareness, self-care strategies, and building resilience in challenging times.',
      imageUrl: '', // Add image path here: '/images/events/workshop1.jpg'
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Community Support Group Meeting',
      date: 'March 22, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Community Center, Downtown',
      description: 'A safe space for community members to share experiences, support each other, and learn from mental health professionals.',
      imageUrl: '', // Add image path here: '/images/events/support-group.jpg'
      category: 'Support Group'
    },
    {
      id: 3,
      title: 'Mindfulness & Meditation Session',
      date: 'March 29, 2025',
      time: '10:00 AM - 11:30 AM',
      location: 'Parkside Park',
      description: 'Experience guided meditation and mindfulness practices in a peaceful outdoor setting. All levels welcome.',
      imageUrl: '', // Add image path here: '/images/events/meditation.jpg'
      category: 'Wellness'
    },
    {
      id: 4,
      title: 'Youth Mental Health Summit',
      date: 'April 5, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'City Convention Center',
      description: 'A full-day summit featuring speakers, workshops, and resources specifically designed for young people and their mental wellness journey.',
      imageUrl: '', // Add image path here: '/images/events/youth-summit.jpg'
      category: 'Conference'
    },
    {
      id: 5,
      title: 'Art Therapy Session',
      date: 'April 12, 2025',
      time: '3:00 PM - 5:00 PM',
      location: 'Local Art Studio',
      description: 'Express yourself through art in this therapeutic session. No artistic experience required - just bring an open mind and heart.',
      imageUrl: '', // Add image path here: '/images/events/art-therapy.jpg'
      category: 'Therapy'
    },
    {
      id: 6,
      title: 'Evening Wellness Walk',
      date: 'April 19, 2025',
      time: '6:30 PM - 8:00 PM',
      location: 'Riverside Trail',
      description: 'Join us for a gentle evening walk along the river. Physical activity combined with nature therapy for mental wellness.',
      imageUrl: '', // Add image path here: '/images/events/walk.jpg'
      category: 'Activity'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="page">
      <MorningTide />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Events</h1>
        <p className="events-subtitle">
          Join us for upcoming events focused on mental wellness, community support, and personal growth.
        </p>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-inner">
                <div className="event-image-wrapper">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder">
                      <span className="placeholder-icon">📅</span>
                    </div>
                  )}
                  <div className="event-image-overlay"></div>
                  <div className="event-category-badge">{event.category}</div>
                </div>
                <div className="event-card-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-details">
                    <div className="event-detail-item">
                      <span className="event-detail-icon">📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="event-detail-item">
                      <span className="event-detail-icon">🕐</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="event-detail-item">
                      <span className="event-detail-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <button className="event-register-btn">Register Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;

