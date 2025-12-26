import { useEffect, useState } from 'react';
import { fetchEventLogs, clearLogs } from '../../redux/slices/eventSlice';
import { useDispatch, useSelector } from 'react-redux';
import './ViewLogs.css';

const ViewLogs = ({ eventId, onClose }) => {
  const dispatch = useDispatch();
  const { logs, logsLoading } = useSelector((state) => state.event);
  const [timezone, setTimezone] = useState('America/New_York');

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventLogs(eventId));
    }
    return () => {
      dispatch(clearLogs());
    };
  }, [eventId, dispatch]);

  const handleClose = () => {
    dispatch(clearLogs());
    onClose();
  };

  const formatLogDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatLogTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatLogMessage = (log) => {
    switch (log.changeType) {
      case 'profiles':
        return `Profiles changed to: ${log.newValue}`;
      case 'timezone':
        return `Timezone changed from ${log.oldValue} to ${log.newValue}`;
      case 'startDate':
        return 'Start date/time updated';
      case 'endDate':
        return 'End date/time updated';
      default:
        return `${log.changeType} updated`;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Event Update History</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {logsLoading && (
            <div className="logs-loading">Loading...</div>
          )}

          {!logsLoading && (!logs || logs.length === 0) && (
            <div className="logs-empty">No update history yet</div>
          )}

          {!logsLoading && logs && logs.length > 0 && (
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log._id} className="log-item">
                  <span className="log-icon">🕐</span>
                  <div className="log-content">
                    <div className="log-timestamp">
                      {formatLogDate(log.timestamp)} at {formatLogTime(log.timestamp)}
                    </div>
                    <div className="log-message">
                      - {formatLogMessage(log)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;

