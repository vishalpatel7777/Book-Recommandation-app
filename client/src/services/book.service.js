import api from './axios';

export const fetchAllBooks = () =>
  api.get('/get-all-books').then((r) => r.data.data || []);

export const fetchRecentBooks = () =>
  api.get('/get-recent-books').then((r) => r.data.data || []);

export const getBookById = (id) =>
  api.get(`/get-book-by-id/${id}`).then((r) => r.data.data);
