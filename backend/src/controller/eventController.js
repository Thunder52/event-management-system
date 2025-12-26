import { validationResult } from "express-validator";
import Event from "../models/Events.js";
import EventLog from "../models/EventLog.js";
import Profile from "../models/Profile.js";

export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { profiles, timezone, startDate, endDate } = req.body;

    const event = await Event.create({
      profile: profiles,
      timezone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    // Log event creation
    const profileNames = await Profile.find({ _id: { $in: profiles } }).select("name");
    await EventLog.create({
      event: event._id,
      changeType: 'created',
      oldValue: null,
      newValue: `Event created with profiles: ${profileNames.map(p => p.name).join(", ")}`
    });

    return res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const editEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { id } = req.params;
    const { profiles, timezone, startDate, endDate } = req.body;
    const oldEvent = await Event.findById(id).populate("profile", "name");
    
    if (!oldEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    const updateData = {};
    if (profiles !== undefined) updateData.profile = profiles;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("profile", "name");
    const logs = [];
    
    if (profiles !== undefined) {
      const oldProfileIds = oldEvent.profile.map(p => p._id ? p._id.toString() : p.toString()).sort();
      const newProfileIds = profiles.map(p => p.toString()).sort();
      
      if (JSON.stringify(oldProfileIds) !== JSON.stringify(newProfileIds)) {
        const newProfiles = await Profile.find({ _id: { $in: profiles } }).select("name");
        const newValue = newProfiles.map(p => p.name).join(", ");
        const oldValue = oldEvent.profile.map(p => p.name ? p.name : '').join(", ");
        logs.push({
          event: id,
          changeType: 'profiles',
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }

    if (timezone !== undefined && timezone !== oldEvent.timezone) {
      logs.push({
        event: id,
        changeType: 'timezone',
        oldValue: oldEvent.timezone,
        newValue: timezone
      });
    }

    if (startDate !== undefined && new Date(startDate).getTime() !== oldEvent.startDate.getTime()) {
      logs.push({
        event: id,
        changeType: 'startDate',
        oldValue: oldEvent.startDate.toISOString(),
        newValue: new Date(startDate).toISOString()
      });
    }

    if (endDate !== undefined && new Date(endDate).getTime() !== oldEvent.endDate.getTime()) {
      logs.push({
        event: id,
        changeType: 'endDate',
        oldValue: oldEvent.endDate.toISOString(),
        newValue: new Date(endDate).toISOString()
      });
    }
    if (logs.length > 0) {
      await EventLog.insertMany(logs);
    }

    return res.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { profileId } = req.params;

    const events = await Event.find({
      profile: { $in: [profileId] },
    })
      .populate("profile", "name")
      .sort({ startDate: 1 });

    return res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getEventLogs = async (req, res) => {
  try {
    const { eventId } = req.params;

    const logs = await EventLog.find({ event: eventId })
      .sort({ timestamp: -1 });

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
