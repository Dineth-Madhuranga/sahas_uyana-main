// API Configuration
// This file centralizes all API endpoint configurations

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sahasuyana-production.up.railway.app/';

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_PROFILE: `${API_BASE_URL}/api/admin/profile`,
  ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`,
  ADMIN_LIST: `${API_BASE_URL}/api/admin/admins`,
  ADMIN_CREATE_INITIAL: `${API_BASE_URL}/api/admin/create-initial-admin`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  ADMIN_BLOCK: `${API_BASE_URL}/api/bookings/admin-block`,
  ADMIN_BLOCK_TEST: `${API_BASE_URL}/api/bookings/admin-block-test`,
  
  // Vendor stalls endpoints
  VENDOR_STALLS_ADMIN: `${API_BASE_URL}/api/bookings/admin/vendor-stalls`,
  VENDOR_STALLS_TEST: `${API_BASE_URL}/api/bookings/vendor-stalls/test`,
  VENDOR_STALLS_BOOK: `${API_BASE_URL}/api/bookings/admin/vendor-stalls/book`,
  VENDOR_STALLS_BOOKED: `${API_BASE_URL}/api/bookings/vendor-stalls/booked`,
  VENDOR_STALLS_AVAILABILITY: `${API_BASE_URL}/api/bookings/vendor-stalls/availability`,
  
  // News endpoints
  NEWS: `${API_BASE_URL}/api/news`,
  
  // Contact endpoint
  CONTACT: `${API_BASE_URL}/api/contact`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Helper function to build dynamic URLs
export const getBookingStatusUrl = (id) => `${API_BASE_URL}/api/bookings/${id}/status`;
export const getBookingDeleteUrl = (id) => `${API_BASE_URL}/api/bookings/${id}`;
export const getNewsDeleteUrl = (id) => `${API_BASE_URL}/api/news/${id}`;
export const getNewsUpdateUrl = (id) => `${API_BASE_URL}/api/news/${id}`;
export const getAdminDeleteUrl = (adminId) => `${API_BASE_URL}/api/admin/admins/${adminId}`;
export const getUnavailableDatesUrl = (venue) => `${API_BASE_URL}/api/bookings/unavailable-dates/${venue}`;

export default API_BASE_URL;
