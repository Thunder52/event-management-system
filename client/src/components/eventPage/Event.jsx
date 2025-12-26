import './Event.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchEvents } from '../../redux/slices/eventSlice';
import EditEvent from '../editEvent/EditEvent';
import ViewLogs from '../viewLogs/ViewLogs';

const Event = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);
  const { activeProfileId } = useSelector((state) => state.profile);

  const [timezone, setTimezone] = useState('America/New_York');
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEventId, setViewingLogsEventId] = useState(null);

  useEffect(() => {
    if (activeProfileId) {
      dispatch(fetchEvents(activeProfileId)); 
    }
  }, [activeProfileId, dispatch]);

  const formatDate = (dateString, timezone) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString, timezone) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatMetaDate = (dateString, timezone) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  const getTimezoneLabel = (tz) => {
    const labels = {
      'America/New_York': 'Eastern Time (ET)',
      'Asia/Kolkata': 'Asia/Kolkata (IST)',
      'UTC': 'UTC',
      'America/Los_Angeles': 'Pacific Time (PT)',
      'Europe/London': 'London (GMT)',
    };
    return labels[tz] || tz;
  };

  return (
    <div className="event-card">
      <h3 className="event-title">Events</h3>

      <div className="form">
        <label>View in Timezone</label>
        <div className="select-wrapper">
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
          </select>
          <span className="select-arrow">▾</span>
        </div>
      </div>

      {loading && <div className="no-events">Loading...</div>}

      {!loading && events.length === 0 && (
        <div className="no-events">No events found</div>
      )}

      {!loading &&
        events.map((event) => (
          <div key={event._id} className="event-box">
            <div className="event-profiles">
              <span className="profile-icon">👥</span>
              {event.profile?.map((p) => p.name).join(', ')}
            </div>

            <div className="event-details">
              <div className="event-detail-row">
                <span className="icon">📅</span>
                <span className="label">Start:</span>
                <span className="date">{formatDate(event.startDate, timezone)}</span>
              </div>
              <div className="event-detail-row">
                <span className="icon">🕐</span>
                <span className="time">{formatTime(event.startDate, timezone)}</span>
              </div>

              <div className="event-detail-row">
                <span className="icon">📅</span>
                <span className="label">End:</span>
                <span className="date">{formatDate(event.endDate, timezone)}</span>
              </div>
              <div className="event-detail-row">
                <span className="icon">🕐</span>
                <span className="time">{formatTime(event.endDate, timezone)}</span>
              </div>
            </div>

            <div className="event-meta">
              <div>Created: {formatMetaDate(event.createdAt, timezone)}</div>
              <div>Updated: {formatMetaDate(event.updatedAt, timezone)}</div>
            </div>

            <div className="event-actions">
              <button 
                className="btn-outline"
                onClick={() => setEditingEvent(event)}
              >
                <span className="btn-icon">✏️</span>
                Edit
              </button>
              <button 
                className="btn-outline"
                onClick={() => setViewingLogsEventId(event._id)}
              >
                <span className="btn-icon">📄</span>
                View Logs
              </button>
            </div>
          </div>
        ))}

      {editingEvent && (
        <EditEvent 
          event={editingEvent} 
          onClose={() => setEditingEvent(null)} 
        />
      )}

      {viewingLogsEventId && (
        <ViewLogs 
          eventId={viewingLogsEventId} 
          onClose={() => setViewingLogsEventId(null)} 
        />
      )}
    </div>
  );
};

export default Event;
