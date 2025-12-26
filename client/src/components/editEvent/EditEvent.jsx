import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MultiProfileDropdown from '../profileDropDown/MultiProfileDropdown';
import { updateEvent, fetchEvents } from '../../redux/slices/eventSlice';
import './EditEvent.css';

const EditEvent = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const { activeProfileId } = useSelector((state) => state.profile);

  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (event) {
      // Set initial values from event
      setSelectedProfiles(event.profile?.map(p => p._id || p) || []);
      setTimezone(event.timezone || 'America/New_York');
      
      // Format dates
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [event]);

  const handleUpdate = async () => {
    if (
      !selectedProfiles.length ||
      !timezone ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      alert('Please fill all fields');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Validate that end date/time is not before start date/time
    if (endDateTime <= startDateTime) {
      alert('End date and time must be after start date and time');
      return;
    }

    const result = await dispatch(
      updateEvent({
        id: event._id,
        profiles: selectedProfiles,
        timezone,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      })
    );

    // If event updated successfully, refresh events for active profile
    if (result.meta.requestStatus === 'fulfilled' && activeProfileId) {
      dispatch(fetchEvents(activeProfileId));
      onClose();
    }
  };

  const getTimezoneLabel = (tz) => {
    const labels = {
      'America/New_York': 'Eastern Time (ET)',
      'Asia/Kolkata': 'India (IST)',
      'UTC': 'UTC',
      'America/Los_Angeles': 'Pacific Time (PT)',
      'Europe/London': 'London (GMT)',
    };
    return labels[tz] || tz;
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Event</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Profiles */}
          <div className="form-group">
            <label>Profiles</label>
            <MultiProfileDropdown
              selectedProfiles={selectedProfiles}
              setSelectedProfiles={setSelectedProfiles}
            />
          </div>

          {/* Timezone */}
          <div className="form-group">
            <label>Timezone</label>
            <div className="select-wrapper">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          {/* Start */}
          <div className="form-group">
            <label>Start Date & Time</label>
            <div className="datetime-row">
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    setStartDate(newStartDate);
                    // If end date is before new start date, reset end date to start date
                    if (endDate && newStartDate && endDate < newStartDate) {
                      setEndDate(newStartDate);
                      // If same date, ensure end time is after start time
                      if (endTime <= startTime) {
                        // Set end time to 1 hour after start time
                        const [hours, minutes] = startTime.split(':');
                        const newEndHours = String((parseInt(hours) + 1) % 24).padStart(2, '0');
                        setEndTime(`${newEndHours}:${minutes}`);
                      }
                    }
                  }}
                />
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🕐</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    // If same date and end time is before or equal to new start time, update end time
                    if (startDate === endDate && endTime <= e.target.value) {
                      // Set end time to 1 hour after start time, or minimum valid time
                      const [hours, minutes] = e.target.value.split(':');
                      const newEndHours = String((parseInt(hours) + 1) % 24).padStart(2, '0');
                      setEndTime(`${newEndHours}:${minutes}`);
                    }
                  }}
                />
                <span className="time-arrow">▾</span>
              </div>
            </div>
          </div>

          {/* End */}
          <div className="form-group">
            <label>End Date & Time</label>
            <div className="datetime-row">
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                />
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🕐</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={startDate === endDate ? startTime : undefined}
                />
                <span className="time-arrow">▾</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-update" onClick={handleUpdate}>
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;

