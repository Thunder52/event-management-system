import axios from 'axios';

const API = axios.create({
  baseURL: 'https://event-management-system-08d9.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchProfilesApi = (search = '') => {
  return API.get('/profile', {
    params: { search },
  });
};

export const addProfileApi = (name) => {
  return API.post('/profile', { name });
};

export const fetchEventsApi = (profileId) => {
  return API.get(`/event/${profileId}`);
};

export const createEventApi = (payload) => {
  return API.post('/event', payload);
};

export const editEventApi = (eventId, payload) => {
  return API.put(`/event/${eventId}`, payload);
};

export default API;
