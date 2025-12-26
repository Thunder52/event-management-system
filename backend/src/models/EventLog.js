import mongoose from "mongoose";

const eventLogSchema = mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  changeType: {
    type: String,
    required: true,
    enum: ['profiles', 'timezone', 'startDate', 'endDate', 'created', 'updated']
  },
  oldValue: {
    type: String,
    default: null
  },
  newValue: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const EventLog = mongoose.model("EventLog", eventLogSchema);
export default EventLog;

