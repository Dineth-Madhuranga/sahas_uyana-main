import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';
import VendorStallAdmin from '../components/VendorStallAdmin';
import './AdminDashboard.css';
import { useToast } from '../components/ToastProvider';
import API_BASE_URL, { getBookingStatusUrl, getBookingDeleteUrl, getNewsDeleteUrl, getNewsUpdateUrl, getAdminDeleteUrl } from '../config/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const { showToast } = useToast();
  const [activeBookingTab, setActiveBookingTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionBookingId, setRejectionBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'General',
    imageUrl: ''
  });
  
  // Admin management state
  const [admins, setAdmins] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'admin'
  });
  
  // Profile management state
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  // Helper function to get history bookings
  const getHistoryBookings = (bookingsList) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    return bookingsList.filter(booking => {
      if (booking.status === 'completed') {
        return true; // All completed bookings go to history
      }
      // For confirmed bookings, only non-vendor stalls with past dates
      if (booking.status === 'confirmed' && booking.venue !== 'Vendor Stalls') {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate < currentDate;
      }
      return false; // Don't include anything else
    });
  };

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch current admin profile
        const profileResponse = await fetch(`${API_BASE_URL}/api/admin/profile`, {
          headers
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setCurrentAdmin(profileData);
          setProfileForm({
            username: profileData.username || '',
            firstName: profileData.profile.firstName || '',
            lastName: profileData.profile.lastName || '',
            phone: profileData.profile.phone || ''
          });
        }

        // Fetch all bookings (including vendor stalls for admin dashboard)
        const bookingsResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
          headers
        });
        const bookingsData = await bookingsResponse.json();
        
        // Fetch news
        const newsResponse = await fetch(`${API_BASE_URL}/api/news`, {
          headers
        });
        const newsData = await newsResponse.json();

        // Fetch admin list for admin management
        const adminsResponse = await fetch(`${API_BASE_URL}/api/admin/admins`, {
          headers
        });
        if (adminsResponse.ok) {
          const adminsData = await adminsResponse.json();
          setAdmins(adminsData || []);
        }

        if (bookingsResponse.ok) {
          // Transform booking data to match component expectations
          const transformedBookings = bookingsData.bookings.map(booking => ({
            id: booking._id,
            venue: booking.venue,
            eventType: booking.eventType,
            date: booking.eventDate,
            duration: booking.duration,
            customer: booking.customer.name,
            email: booking.customer.email,
            phone: booking.customer.phone,
            guests: booking.guests,
            status: booking.status,
            totalAmount: booking.totalAmount,
            stallInfo: booking.stallInfo // Include stall information for vendor stalls
          }));
          setBookings(transformedBookings);
        }

        if (newsResponse.ok) {
          // Transform news data to match component expectations
          const transformedNews = newsData.newsItems.map(news => ({
            id: news._id,
            title: news.title,
            description: news.description,
            content: news.content,
            category: news.category,
            date: news.createdAt,
            status: news.status,
            imageUrl: news.image && news.image.url ? news.image.url : ''
          }));
          setNewsItems(transformedNews);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const updateBookingStatus = async (id, status, rejectionReason = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const requestBody = { status };
      if (rejectionReason) {
        requestBody.rejectionReason = rejectionReason;
      }
      
      const response = await fetch(getBookingStatusUrl(id), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Update the local state
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        ));
        
        // Show success message based on status
        if (status === 'confirmed') {
          showToast('Booking approved. Confirmation email sent to customer.', { type: 'success' });
        } else if (status === 'cancelled') {
          showToast('Booking rejected. Notification email sent to customer.', { type: 'warning' });
        }
      } else {
        console.error('Failed to update booking status');
        showToast('Failed to update booking status', { type: 'error' });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast('Error updating booking status', { type: 'error' });
    }
  };

  const handleRejectBooking = (bookingId) => {
    setRejectionBookingId(bookingId);
    setShowRejectionModal(true);
    setRejectionReason('');
  };

  const confirmRejection = () => {
    if (rejectionBookingId) {
      updateBookingStatus(rejectionBookingId, 'cancelled', rejectionReason);
      setShowRejectionModal(false);
      setRejectionBookingId(null);
      setRejectionReason('');
    }
  };

  const cancelRejection = () => {
    setShowRejectionModal(false);
    setRejectionBookingId(null);
    setRejectionReason('');
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this rejected booking? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(getBookingDeleteUrl(id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setBookings(bookings.filter(booking => booking.id !== id));
          showToast('Booking deleted successfully', { type: 'success' });
        } else {
          console.error('Failed to delete booking');
          showToast('Failed to delete booking', { type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        showToast('Error deleting booking', { type: 'error' });
      }
    }
  };

  const deleteNewsItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(getNewsDeleteUrl(id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setNewsItems(newsItems.filter(item => item.id !== id));
        } else {
          console.error('Failed to delete news item');
          showToast('Failed to delete news item', { type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting news item:', error);
        showToast('Error deleting news item', { type: 'error' });
      }
    }
  };

  const handleNewsFormChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (editingNews) {
        // Update existing news item
        const requestBody = {
          ...newsForm,
          status: 'published', // Always set as published
          image: newsForm.imageUrl ? { url: newsForm.imageUrl, alt: newsForm.title } : { url: '', alt: '' }
        };
        delete requestBody.imageUrl; // Remove imageUrl from request as backend expects image object
        
        const response = await fetch(getNewsUpdateUrl(editingNews.id), {
          method: 'PUT',
          headers,
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          await response.json();
          setNewsItems(newsItems.map(item => 
            item.id === editingNews.id 
              ? { 
                  ...item, 
                  ...newsForm, 
                  id: editingNews.id,
                  imageUrl: newsForm.imageUrl,
                  status: 'published'
                }
              : item
          ));
          showToast('News item updated', { type: 'success' });
        } else {
          console.error('Failed to update news item');
          showToast('Failed to update news item', { type: 'error' });
          return;
        }
      } else {
        // Add new news item
        const requestBody = {
          ...newsForm,
          status: 'published', // Always set as published
          image: newsForm.imageUrl ? { url: newsForm.imageUrl, alt: newsForm.title } : { url: '', alt: '' }
        };
        delete requestBody.imageUrl; // Remove imageUrl from request as backend expects image object
        
        const response = await fetch(`${API_BASE_URL}/api/news`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const newNewsItem = await response.json();
          const transformedNews = {
            id: newNewsItem._id,
            title: newNewsItem.title,
            description: newNewsItem.description,
            content: newNewsItem.content,
            category: newNewsItem.category,
            date: newNewsItem.createdAt,
            status: 'published', // Always published
            imageUrl: newNewsItem.image && newNewsItem.image.url ? newNewsItem.image.url : ''
          };
          setNewsItems([transformedNews, ...newsItems]);
          showToast('News item created', { type: 'success' });
        } else {
          console.error('Failed to create news item');
          showToast('Failed to create news item', { type: 'error' });
          return;
        }
      }
      
      // Reset form
      setNewsForm({
        title: '',
        description: '',
        content: '',
        category: 'General',
        imageUrl: ''
      });
      setShowNewsForm(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error submitting news form:', error);
      showToast('Error submitting news form', { type: 'error' });
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content || newsItem.description,
      category: newsItem.category,
      imageUrl: newsItem.imageUrl || ''
    });
    setShowNewsForm(true);
  };

  const handleCancelNewsForm = () => {
    setShowNewsForm(false);
    setEditingNews(null);
    setNewsForm({
      title: '',
      description: '',
      content: '',
      category: 'General',
      imageUrl: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Admin management functions
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching admins with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Admin fetch response status:', response.status);
      
      if (response.ok) {
        const adminsData = await response.json();
        console.log('Fetched admins data:', adminsData);
        console.log('Number of admins:', adminsData.length);
        console.log('First admin structure:', adminsData[0]);
        setAdmins(adminsData);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch admins:', response.status, errorText);
        // Set empty array so UI shows "no admins" message
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      // Set empty array so UI shows "no admins" message
      setAdmins([]);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminForm)
      });

      if (response.ok) {
        const newAdmin = await response.json();
        setAdmins([...admins, newAdmin]);
        setAdminForm({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'admin'
        });
        setShowAdminForm(false);
        showToast('Admin account created successfully', { type: 'success' });
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to create admin account', { type: 'error' });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      showToast('Error creating admin account', { type: 'error' });
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(getAdminDeleteUrl(adminId), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setAdmins(admins.filter(admin => admin._id !== adminId));
          showToast('Admin account deleted successfully', { type: 'success' });
        } else {
          const errorData = await response.json();
          showToast(errorData.message || 'Failed to delete admin account', { type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        showToast('Error deleting admin account', { type: 'error' });
      }
    }
  };

  // Create initial admin for testing
  const createInitialAdmin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create-initial-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await response.json();
        showToast('Test admin created: Username: admin, Password: admin123', { type: 'info' });
        fetchAdmins(); // Refresh the admin list
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to create test admin', { type: 'error' });
      }
    } catch (error) {
      console.error('Error creating initial admin:', error);
      showToast('Error creating test admin', { type: 'error' });
    }
  };

  // Function to refresh bookings data
  const refreshBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const bookingsResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const transformedBookings = bookingsData.bookings.map(booking => ({
          id: booking._id,
          venue: booking.venue,
          eventType: booking.eventType,
          date: booking.eventDate,
          duration: booking.duration,
          customer: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          guests: booking.guests,
          status: booking.status,
          totalAmount: booking.totalAmount,
          stallInfo: booking.stallInfo // Include stall information for vendor stalls
        }));
        setBookings(transformedBookings);
        console.log('Bookings refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  };

  // Fetch admins when admin management tab is selected
  useEffect(() => {
    if (activeTab === 'admin-management') {
      fetchAdmins();
    }
  }, [activeTab]);

  // Profile management functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedAdmin = await response.json();
        setCurrentAdmin(updatedAdmin);
        setShowProfileForm(false);
        showToast('Profile updated successfully', { type: 'success' });
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to update profile', { type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', { type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', { type: 'warning' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', { type: 'warning' });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setShowPasswordForm(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        showToast('Password changed successfully', { type: 'success' });
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to change password', { type: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Error changing password', { type: 'error' });
    }
  };

  const handleCancelProfileForm = () => {
    setShowProfileForm(false);
    if (currentAdmin) {
      setProfileForm({
        username: currentAdmin.username || '',
        firstName: currentAdmin.profile.firstName || '',
        lastName: currentAdmin.profile.lastName || '',
        phone: currentAdmin.profile.phone || ''
      });
    }
  };

  const handleCancelPasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Test function to check if server is responding
  const testServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin-block-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      console.log('Test response status:', response.status);
      const data = await response.json();
      console.log('Test response data:', data);
      return response.ok;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  };


  // Admin booking function for calendar
  const handleAdminBooking = async (bookingData) => {
    try {
      console.log('Admin booking function called with:', bookingData);
      
      // First test server connection
      console.log('Testing server connection...');
      const serverWorking = await testServerConnection();
      if (!serverWorking) {
        throw new Error('Server connection failed. Please check if the backend is running.');
      }
      
      const token = localStorage.getItem('adminToken');
      console.log('Admin token exists:', !!token);
      console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        throw new Error('No admin token found. Please log in again.');
      }

      // Check if token is expired by trying to decode it
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Token payload:', tokenPayload);
        console.log('Token expiry:', new Date(tokenPayload.exp * 1000));
        console.log('Current time:', new Date(currentTime * 1000));
        console.log('Token expired?', tokenPayload.exp < currentTime);
        
        if (tokenPayload.exp < currentTime) {
          console.log('Token is expired, removing from localStorage');
          localStorage.removeItem('adminToken');
          throw new Error('Token has expired. Please log in again.');
        }
      } catch (tokenError) {
        console.error('Error checking token:', tokenError);
        if (tokenError.message.includes('expired')) {
          throw tokenError;
        }
        // Continue if token parsing fails - let server validate
        console.log('Token parsing failed, continuing with server validation');
      }

      const requestBody = {
        venue: bookingData.venue,
        eventType: bookingData.eventType,
        eventDate: bookingData.date,
        duration: bookingData.duration,
        notes: bookingData.notes,
        customer: {
          name: 'Admin Block',
          email: 'admin@sahasyuana.com',
          phone: 'N/A'
        },
        guests: 1,
        status: 'confirmed',
        totalAmount: 0
      };

      console.log('Sending request to admin-block endpoint:', requestBody);

      const response = await fetch(`${API_BASE_URL}/api/bookings/admin-block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const newBooking = await response.json();
        console.log('New booking created:', newBooking);
        
        const transformedBooking = {
          id: newBooking._id,
          venue: newBooking.venue,
          eventType: newBooking.eventType,
          date: newBooking.eventDate,
          duration: newBooking.duration,
          customer: 'Admin Block',
          email: 'admin@sahasyuana.com',
          phone: 'N/A',
          guests: 1,
          status: 'confirmed',
          totalAmount: 0,
          stallInfo: newBooking.stallInfo // Include stall information for vendor stalls
        };
        
        console.log('Adding transformed booking to state:', transformedBooking);
        const updatedBookings = [...bookings, transformedBooking];
        setBookings(updatedBookings);
        console.log('Updated bookings state:', updatedBookings);
        
        // Refresh bookings from server to ensure data consistency (include all bookings)
        const refreshResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const refreshedBookings = refreshData.bookings.map(booking => ({
            id: booking._id,
            venue: booking.venue,
            eventType: booking.eventType,
            date: booking.eventDate,
            duration: booking.duration,
            customer: booking.customer.name,
            email: booking.customer.email,
            phone: booking.customer.phone,
            guests: booking.guests,
            status: booking.status,
            totalAmount: booking.totalAmount,
            stallInfo: booking.stallInfo // Include stall information for vendor stalls
          }));
          setBookings(refreshedBookings);
          console.log('Refreshed bookings from server:', refreshedBookings);
        }
      } else {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        
        // Handle specific authentication errors
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('adminToken');
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating admin booking:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  // Get booked dates for calendar
  const getBookedDates = () => {
    console.log('Getting booked dates from bookings:', bookings);
    const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
    console.log('Confirmed bookings:', confirmedBookings);
    
    const bookedDates = confirmedBookings.map(booking => ({
      date: booking.date,
      venue: booking.venue,
      eventType: booking.eventType,
      customer: booking.customer
    }));
    
    console.log('Returning booked dates for calendar:', bookedDates);
    return bookedDates;
  };

  // Get filtered bookings based on status filter
  const getFilteredBookings = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    let statusFilter;
    switch (activeBookingTab) {
      case 'pending':
        statusFilter = 'pending';
        return bookings.filter(booking => booking.status === statusFilter);
      case 'approved':
        statusFilter = 'confirmed';
        // Only show approved non-vendor stall bookings that haven't passed yet
        return bookings.filter(booking => 
          booking.status === statusFilter && 
          booking.venue !== 'Vendor Stalls' &&
          new Date(booking.date) >= currentDate
        );
      case 'rejected':
        statusFilter = 'cancelled';
        return bookings.filter(booking => booking.status === statusFilter);
      case 'vendor-stalls':
        // Show confirmed vendor stall rentals
        return bookings.filter(booking => 
          booking.venue === 'Vendor Stalls' && 
          booking.status === 'confirmed'
        );
      case 'history':
        // Use helper function for consistent logic
        return getHistoryBookings(bookings);
      default:
        statusFilter = 'pending';
        return bookings.filter(booking => booking.status === statusFilter);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Top Navbar - shows when sidebar is collapsed */}
      <div className={`top-navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <button 
          className={`navbar-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      <div className="admin-content">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        <div className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Sidebar Header with Logo */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <img 
                src="https://i.postimg.cc/V606gTTK/imgi_1_327028694_692281699014840_6610880966568510493_n-removebg-preview.png" 
                alt="Sahas Uyana Logo" 
                className="sidebar-logo-image"
              />
              <span className="sidebar-logo-text">Sahas Uyana Admin</span>
            </div>
          </div>
          
          <nav className="admin-menu">
            <button 
              className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookings');
                setIsMobileMenuOpen(false);
              }}
            >
              📅 Bookings
            </button>
            <button 
              className={`menu-item ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('news');
                setIsMobileMenuOpen(false);
              }}
            >
              📰 News Management
            </button>
            <button 
              className={`menu-item ${activeTab === 'venues' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('venues');
                setIsMobileMenuOpen(false);
              }}
            >
              🏛️ Venue Management
            </button>
            <button 
              className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileMenuOpen(false);
              }}
            >
              📊 Analytics
            </button>
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('profile');
                setIsMobileMenuOpen(false);
              }}
            >
              👤 Profile Settings
            </button>
            <button 
              className={`menu-item ${activeTab === 'booking-calendar' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('booking-calendar');
                setIsMobileMenuOpen(false);
              }}
            >
              📅 Booking Calendar
            </button>
            <button 
              className={`menu-item ${activeTab === 'admin-management' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('admin-management');
                setIsMobileMenuOpen(false);
              }}
            >
              👥 Admin Management
            </button>
            <button 
              className={`menu-item ${activeTab === 'vendor-stalls' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('vendor-stalls');
                setIsMobileMenuOpen(false);
              }}
            >
              🏪 Vendor Stalls
            </button>
            
            {/* Logout Button */}
            <button 
              className="menu-item logout-menu-item"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <div className="bookings-header">
                <h2>Bookings Management</h2>
                <div className="bookings-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{bookings.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending:</span>
                    <span className="stat-value pending">{bookings.filter(b => b.status === 'pending').length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Active Events:</span>
                    <span className="stat-value confirmed">{(() => {
                      const currentDate = new Date();
                      currentDate.setHours(0, 0, 0, 0);
                      return bookings.filter(b => b.status === 'confirmed' && b.venue !== 'Vendor Stalls' && new Date(b.date) >= currentDate).length;
                    })()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Vendor Stalls:</span>
                    <span className="stat-value vendor-stalls">{bookings.filter(b => 
                      b.venue === 'Vendor Stalls' && b.status === 'confirmed'
                    ).length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rejected:</span>
                    <span className="stat-value cancelled">{bookings.filter(b => b.status === 'cancelled').length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">History:</span>
                    <span className="stat-value history">{getHistoryBookings(bookings).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bookings-content">
                <div className="bookings-sidebar">
                  <nav className="booking-status-menu">
                    <button 
                      className={`booking-status-item ${activeBookingTab === 'pending' ? 'active' : ''}`}
                      onClick={() => setActiveBookingTab('pending')}
                    >
                      ⏳ Pending ({bookings.filter(b => b.status === 'pending').length})
                    </button>
                    <button 
                      className={`booking-status-item ${activeBookingTab === 'approved' ? 'active' : ''}`}
                      onClick={() => setActiveBookingTab('approved')}
                    >
                      ✅ Approved Events ({bookings.filter(b => {
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        return b.status === 'confirmed' && b.venue !== 'Vendor Stalls' && new Date(b.date) >= currentDate;
                      }).length})
                    </button>
                    <button 
                      className={`booking-status-item ${activeBookingTab === 'vendor-stalls' ? 'active' : ''}`}
                      onClick={() => setActiveBookingTab('vendor-stalls')}
                    >
                      🏪 Vendor Stalls ({bookings.filter(b => 
                        b.venue === 'Vendor Stalls' && b.status === 'confirmed'
                      ).length})
                    </button>
                    <button 
                      className={`booking-status-item ${activeBookingTab === 'rejected' ? 'active' : ''}`}
                      onClick={() => setActiveBookingTab('rejected')}
                    >
                      ❌ Not Approved ({bookings.filter(b => b.status === 'cancelled').length})
                    </button>
                    <button 
                      className={`booking-status-item ${activeBookingTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveBookingTab('history')}
                    >
                      📚 Booking History ({getHistoryBookings(bookings).length})
                    </button>
                  </nav>
                </div>

                <div className="bookings-main-content">
                  <div className="booking-tab-header">
                    <h3>
                      {activeBookingTab === 'pending' && 'Pending Bookings'}
                      {activeBookingTab === 'approved' && 'Active Approved Events'}
                      {activeBookingTab === 'vendor-stalls' && 'Active Vendor Stall Rentals'}
                      {activeBookingTab === 'rejected' && 'Not Approved Bookings'}
                      {activeBookingTab === 'history' && 'Booking History'}
                    </h3>
                    <span className="booking-count">
                      {getFilteredBookings().length} booking{getFilteredBookings().length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="bookings-grid">
                    {getFilteredBookings().map((booking) => (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                          <h3>{booking.venue}</h3>
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status === 'confirmed' ? 'approved' : booking.status === 'cancelled' ? 'rejected' : booking.status}
                          </span>
                        </div>
                        <div className="booking-details">
                          <div className="detail-row">
                            <span className="detail-label">Event Type:</span>
                            <span className="detail-value">{booking.eventType}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{formatDate(booking.date)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Duration:</span>
                            <span className="detail-value">{booking.duration} day(s)</span>
                          </div>
                          {booking.venue === 'Vendor Stalls' && booking.stallInfo && (
                            <div className="detail-row">
                              <span className="detail-label">Stall:</span>
                              <span className="detail-value">{booking.stallInfo.stallId} ({booking.stallInfo.blockName})</span>
                            </div>
                          )}
                          <div className="detail-row">
                            <span className="detail-label">Customer:</span>
                            <span className="detail-value">{booking.customer}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{booking.email}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">{booking.phone}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Guests:</span>
                            <span className="detail-value">{booking.guests}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value amount">{formatCurrency(booking.totalAmount)}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-success"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                title="Approve this booking and send confirmation email"
                              >
                                ✓ Approve
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleRejectBooking(booking.id)}
                                title="Reject this booking with reason"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && activeBookingTab === 'approved' && (
                            <button 
                              className="btn btn-warning"
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              title="Mark as completed and move to history"
                            >
                              ✓ Mark Complete
                            </button>
                          )}
                          {booking.status === 'confirmed' && activeBookingTab === 'vendor-stalls' && (
                            <>
                              <span className="rental-status">
                                🏪 Active Rental
                              </span>
                              <button 
                                className="btn btn-warning"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to terminate this vendor stall rental? This action cannot be undone.')) {
                                    updateBookingStatus(booking.id, 'completed');
                                  }
                                }}
                                title="Terminate rental and move to history"
                              >
                                🏠 Terminate Rental
                              </button>
                            </>
                          )}
                          {booking.status === 'cancelled' && (
                            <>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => updateBookingStatus(booking.id, 'pending')}
                                title="Reopen this booking"
                              >
                                ↺ Reopen
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => deleteBooking(booking.id)}
                                title="Permanently delete this rejected booking"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                          {activeBookingTab === 'history' && (
                            <div className="history-actions">
                              <span className="history-status">
                                {booking.status === 'completed' ? '✅ Completed' : 
                                 new Date(booking.date) < new Date() ? '📅 Event Date Passed' : '📋 Historical'}
                              </span>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteBooking(booking.id)}
                                title="Permanently delete this historical booking"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {getFilteredBookings().length === 0 && (
                    <div className="no-bookings">
                      <p>
                        No {activeBookingTab === 'pending' ? 'pending' : 
                           activeBookingTab === 'approved' ? 'active approved events' : 
                           activeBookingTab === 'vendor-stalls' ? 'vendor stall rentals' :
                           activeBookingTab === 'rejected' ? 'rejected' : 
                           'historical'} bookings found.
                        {activeBookingTab === 'history' && (
                          <><br /><small>Bookings appear here after their event date has passed or when marked as completed.</small></>
                        )}
                        {activeBookingTab === 'vendor-stalls' && (
                          <><br /><small>Approved vendor stall rentals will appear here. These are ongoing monthly rentals.</small></>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'booking-calendar' && (
            <div className="booking-calendar-tab">
              <div className="calendar-header">
                <h2>Booking Calendar</h2>
                <p className="calendar-description">
                  View all booked dates and block new dates for maintenance or special events. 
                  Booked dates appear in red and can be clicked for details.
                </p>
              </div>
              
              <div className="calendar-container">
                <BookingCalendar 
                  bookedDates={getBookedDates()}
                  onAdminBook={handleAdminBooking}
                />
              </div>
              
              <div className="calendar-stats">
                <div className="stat-card">
                  <h3>This Month</h3>
                  <div className="stat-number">
                    {(() => {
                      const currentMonth = new Date().getMonth();
                      const currentYear = new Date().getFullYear();
                      return bookings.filter(booking => {
                        const bookingDate = new Date(booking.date);
                        return booking.status === 'confirmed' && 
                               bookingDate.getMonth() === currentMonth && 
                               bookingDate.getFullYear() === currentYear;
                      }).length;
                    })()}
                  </div>
                  <div className="stat-label">Booked Days</div>
                </div>
                
                <div className="stat-card">
                  <h3>Next Month</h3>
                  <div className="stat-number">
                    {(() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      const month = nextMonth.getMonth();
                      const year = nextMonth.getFullYear();
                      return bookings.filter(booking => {
                        const bookingDate = new Date(booking.date);
                        return booking.status === 'confirmed' && 
                               bookingDate.getMonth() === month && 
                               bookingDate.getFullYear() === year;
                      }).length;
                    })()}
                  </div>
                  <div className="stat-label">Booked Days</div>
                </div>
                
                <div className="stat-card">
                  <h3>Admin Blocks</h3>
                  <div className="stat-number">
                    {bookings.filter(booking => 
                      booking.customer === 'Admin Block' && booking.status === 'confirmed'
                    ).length}
                  </div>
                  <div className="stat-label">Blocked Dates</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vendor-stalls' && (
            <div className="vendor-stalls-tab">
              <VendorStallAdmin onBookingUpdate={refreshBookings} />
            </div>
          )}

          {activeTab === 'news' && (
            <div className="news-tab">
              <div className="news-header">
                <h2>News Management</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowNewsForm(true)}
                >
                  Add News Item
                </button>
              </div>

              {showNewsForm && (
                <div className="news-form-modal">
                  <div className="news-form-container">
                    <div className="news-form-header">
                      <h3>{editingNews ? 'Edit News Item' : 'Add News Item'}</h3>
                      <button 
                        className="close-btn"
                        onClick={handleCancelNewsForm}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleNewsSubmit} className="news-form">
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newsForm.title}
                          onChange={handleNewsFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={newsForm.description}
                          onChange={handleNewsFormChange}
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                          id="content"
                          name="content"
                          value={newsForm.content}
                          onChange={handleNewsFormChange}
                          rows="6"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="imageUrl">Image URL</label>
                        <input
                          type="url"
                          id="imageUrl"
                          name="imageUrl"
                          value={newsForm.imageUrl}
                          onChange={handleNewsFormChange}
                          placeholder="https://example.com/image.jpg"
                        />
                        {newsForm.imageUrl && (
                          <div className="image-preview">
                            <img 
                              src={newsForm.imageUrl} 
                              alt="Preview" 
                              className="news-image-preview"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="image-error" style={{display: 'none'}}>
                              Invalid image URL
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="category">Category</label>
                          <select
                            id="category"
                            name="category"
                            value={newsForm.category}
                            onChange={handleNewsFormChange}
                          >
                            <option value="General">General</option>
                            <option value="Events">Events</option>
                            <option value="Exhibitions">Exhibitions</option>
                            <option value="Awards">Awards</option>
                            <option value="Announcements">Announcements</option>
                            <option value="Community">Community</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleCancelNewsForm}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {editingNews ? 'Update' : 'Save'} News Item
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="news-grid">
                {newsItems.map((item) => (
                  <div key={item.id} className="news-card">
                    {item.imageUrl && (
                      <div className="news-card-image">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="news-thumbnail"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="news-card-header">
                      <h3>{item.title}</h3>
                    </div>
                    <p className="news-description">{item.description}</p>
                    <div className="news-meta">
                      <span className="news-category">{item.category}</span>
                      <span className="news-date">Published: {formatDate(item.date)}</span>
                    </div>
                    <div className="news-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleEditNews(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => deleteNewsItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'venues' && (
            <div className="venues-tab">
              <h2>Venue Management</h2>
              <div className="venues-list">
                <div className="venue-item">
                  <h3>Open Air Arena</h3>
                  <p>Price: Rs. 1,250,000 per day</p>
                  <p>Capacity: Up to 1000 guests</p>
                  <p>Status: Available</p>
                </div>
                <div className="venue-item">
                  <h3>Exhibition & Fairs Area</h3>
                  <p>Price: Rs. 150,000 per day</p>
                  <p>Capacity: 100 vendor stalls</p>
                  <p>Status: Available</p>
                </div>
                <div className="venue-item">
                  <h3>Kids Park</h3>
                  <p>Price: Free of Charge</p>
                  <p>Capacity: Unlimited</p>
                  <p>Status: Always Available</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin-management' && (
            <div className="admin-management-tab">
              <div className="admin-management-header">
                <h2>Admin Account Management</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAdminForm(true)}
                >
                  Create New Admin
                </button>
              </div>

              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <p><strong>Debug Info:</strong></p>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>Admins count: {admins.length}</p>
                <p>Current tab: {activeTab}</p>
                <button onClick={fetchAdmins} className="btn btn-secondary btn-sm">
                  Refresh Admins
                </button>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading admin accounts...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="admins-grid">
                    {admins.length > 0 ? admins.map((admin) => (
                      <div key={admin._id} className="admin-card">
                        <div className="admin-card-header">
                          <h3>{admin.profile?.firstName} {admin.profile?.lastName}</h3>
                          <span className={`role-badge ${admin.role}`}>
                            {admin.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="admin-details">
                          <div className="detail-row">
                            <span className="detail-label">Username:</span>
                            <span className="detail-value">{admin.username}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{admin.email}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">{admin.profile?.phone || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Status:</span>
                            <span className={`detail-value ${admin.isActive ? 'active' : 'inactive'}`}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Created:</span>
                            <span className="detail-value">{formatDate(admin.createdAt)}</span>
                          </div>
                          {admin.lastLogin && (
                            <div className="detail-row">
                              <span className="detail-label">Last Login:</span>
                              <span className="detail-value">{formatDate(admin.lastLogin)}</span>
                            </div>
                          )}
                        </div>
                        <div className="admin-actions">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAdmin(admin._id)}
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="no-admins">
                        <p>No admin accounts found.</p>
                        <div style={{ marginTop: '1rem' }}>
                          <button 
                            className="btn btn-primary"
                            onClick={() => setShowAdminForm(true)}
                            style={{ marginRight: '1rem' }}
                          >
                            Create New Admin
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={createInitialAdmin}
                          >
                            Create Test Admin
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'profile' && currentAdmin && (
            <div className="profile-tab">
              <div className="profile-header">
                <h2>Profile Settings</h2>
                <div className="profile-info-summary">
                  <div className="admin-avatar">
                    <div className="avatar-circle">
                      {currentAdmin.profile.firstName?.[0]}{currentAdmin.profile.lastName?.[0]}
                    </div>
                  </div>
                  <div className="admin-info">
                    <h3>{currentAdmin.fullName}</h3>
                    <p className="admin-role">{currentAdmin.role.replace('_', ' ').toUpperCase()}</p>
                    <p className="admin-email">{currentAdmin.email}</p>
                  </div>
                </div>
              </div>

              <div className="profile-sections">
                <div className="profile-section">
                  <div className="section-header">
                    <h3>Personal Information</h3>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowProfileForm(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="detail-label">First Name:</span>
                      <span className="detail-value">{currentAdmin.profile.firstName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Name:</span>
                      <span className="detail-value">{currentAdmin.profile.lastName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{currentAdmin.profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Username:</span>
                      <span className="detail-value">{currentAdmin.username}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{currentAdmin.email}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <div className="section-header">
                    <h3>Account Security</h3>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="detail-label">Password:</span>
                      <span className="detail-value">••••••••</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Account Status:</span>
                      <span className={`detail-value ${currentAdmin.isActive ? 'active' : 'inactive'}`}>
                        {currentAdmin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Login:</span>
                      <span className="detail-value">
                        {currentAdmin.lastLogin ? formatDate(currentAdmin.lastLogin) : 'Never'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Account Created:</span>
                      <span className="detail-value">{formatDate(currentAdmin.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <h2>Analytics Dashboard</h2>
              <div className="analytics-grid">
                <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <div className="stat-number">{bookings.length}</div>
                </div>
                <div className="stat-card">
                  <h3>Confirmed Bookings</h3>
                  <div className="stat-number">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                </div>
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <div className="stat-number">
                    {formatCurrency(bookings.reduce((sum, b) => sum + b.totalAmount, 0))}
                  </div>
                </div>
                <div className="stat-card">
                  <h3>News Items</h3>
                  <div className="stat-number">{newsItems.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileForm && currentAdmin && (
        <div className="modal-overlay" onClick={handleCancelProfileForm}>
          <div className="modal-content profile-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={handleCancelProfileForm}>&times;</button>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="modal-body">
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      required
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-info">
                    <p><strong>Note:</strong> Email cannot be changed from this form. Username must be unique.</p>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancelProfileForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="modal-overlay" onClick={handleCancelPasswordForm}>
          <div className="modal-content password-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={handleCancelPasswordForm}>&times;</button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                <div className="password-form-grid">
                  <div className="form-group">
                    <label>Current Password *</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password *</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                      placeholder="Enter new password (min 6 characters)"
                      minLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password *</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm new password"
                      minLength="6"
                    />
                  </div>
                  <div className="form-info">
                    <p><strong>Password Requirements:</strong></p>
                    <ul>
                      <li>Minimum 6 characters</li>
                      <li>New password must be different from current password</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancelPasswordForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div className="modal-overlay" onClick={() => setShowAdminForm(false)}>
          <div className="modal-content admin-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Admin Account</h3>
              <button className="modal-close" onClick={() => setShowAdminForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="modal-body">
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={adminForm.username}
                      onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                      required
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                      required
                      placeholder="Enter password (min 6 characters)"
                      minLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={adminForm.role}
                      onChange={(e) => setAdminForm({...adminForm, role: e.target.value})}
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={adminForm.firstName}
                      onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={adminForm.lastName}
                      onChange={(e) => setAdminForm({...adminForm, lastName: e.target.value})}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone (Optional)</label>
                    <input
                      type="tel"
                      value={adminForm.phone}
                      onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdminForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay" onClick={cancelRejection}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button className="modal-close" onClick={cancelRejection}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Please provide a reason for rejecting this booking:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason (optional)..."
                rows="4"
                className="rejection-textarea"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelRejection}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmRejection}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;