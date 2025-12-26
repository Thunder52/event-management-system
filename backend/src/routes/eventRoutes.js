import express from 'express';
import {
  createEvent,
  editEvent,
  getEvents,
  getEventLogs,
} from '../controller/eventController.js';

import {
  createEventValidation,
  editEventValidation,
} from '../validations/eventValidation.js';

const router = express.Router();

router.post('/event', createEventValidation, createEvent);
router.put('/event/:id', editEventValidation, editEvent);
router.get('/event/logs/:eventId', getEventLogs);
router.get('/event/:profileId', getEvents);

export default router;