import './createEvent.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MultiProfileDropdown from '../profileDropDown/MultiProfileDropdown';
import { createEvent, fetchEvents } from '../../redux/slices/eventSlice';

export default function CreateEvent() {
  const dispatch = useDispatch();
  const { activeProfileId } = useSelector((state) => state.profile);

  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const [timezone, setTimezone] = useState('America/New_York');

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');

  const handleCreate = async () => {
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

    // Convert local date/time to the selected timezone
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Validate that end date/time is not before start date/time
    if (endDateTime <= startDateTime) {
      alert('End date and time must be after start date and time');
      return;
    }

    const result = await dispatch(
      createEvent({
        profiles: selectedProfiles,
        timezone,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      })
    );

    // If event created successfully, refresh events for active profile if it's in the selected profiles
    if (result.meta.requestStatus === 'fulfilled' && activeProfileId && selectedProfiles.includes(activeProfileId)) {
      dispatch(fetchEvents(activeProfileId));
    }

    // reset
    setSelectedProfiles([]);
    setTimezone('America/New_York');
    setStartDate('');
    setStartTime('09:00');
    setEndDate('');
    setEndTime('09:00');
  };

  return (
    <div className="create-event-card">
      <h2 className="card-title">Create Event</h2>

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
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
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
              placeholder="Pick a date"
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
              placeholder="Pick a date"
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

      <button className="create-btn" onClick={handleCreate}>
        <span className="btn-icon">+</span>
        Create Event
      </button>
    </div>
  );
}
