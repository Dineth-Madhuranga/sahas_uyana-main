import React, { useState, useEffect } from 'react';
import './VendorStallAdmin.css';
import { useToast } from './ToastProvider';
import API_BASE_URL from '../config/api';

const VendorStallAdmin = ({ onBookingUpdate }) => {
  const { showToast } = useToast();
  const [stallData, setStallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStall, setSelectedStall] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });

  // Stall block configuration
  const stallBlocks = {
    A: { count: 16, name: 'Block A' },
    B: { count: 24, name: 'Block B' },
    C: { count: 20, name: 'Block C' },
    D: { count: 16, name: 'Block D' },
    E: { count: 12, name: 'Block E' },
    F: { count: 12, name: 'Block F' }
  };

  useEffect(() => {
    fetchStallData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStallData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      console.log('Fetching vendor stall data...');
      
      // Try authenticated endpoint first
      if (token) {
        console.log('Trying authenticated endpoint...');
        const response = await fetch(`${API_BASE_URL}/api/bookings/admin/vendor-stalls`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Auth endpoint response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Stall data received from auth endpoint:', data);
          setStallData(data);
          setLoading(false);
          return;
        } else {
          console.log('Auth endpoint failed, trying test endpoint...');
        }
      }
      
      // Fallback to test endpoint
      console.log('Trying test endpoint...');
      const testResponse = await fetch(`${API_BASE_URL}/api/bookings/vendor-stalls/test`);
      
      console.log('Test endpoint response status:', testResponse.status);
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log('Stall data received from test endpoint:', data);
        setStallData(data);
      } else {
        const errorText = await testResponse.text();
        console.error('Both endpoints failed:', testResponse.status, errorText);
        
        // Show mock data for demonstration
        console.log('Loading mock data for demonstration...');
        const mockData = {
          stallBlocks: {
            A: { count: 16, name: 'Block A', stalls: [] },
            B: { count: 24, name: 'Block B', stalls: [] },
            C: { count: 20, name: 'Block C', stalls: [] },
            D: { count: 16, name: 'Block D', stalls: [] },
            E: { count: 12, name: 'Block E', stalls: [] },
            F: { count: 12, name: 'Block F', stalls: [] }
          },
          statistics: {
            totalStalls: 100,
            bookedStalls: 0,
            availableStalls: 100,
            occupancyRate: '0.0'
          }
        };
        
        // Initialize all stalls as available (mock data)
        Object.keys(mockData.stallBlocks).forEach(block => {
          for (let i = 1; i <= mockData.stallBlocks[block].count; i++) {
            mockData.stallBlocks[block].stalls.push({
              stallId: `${block}${i}`,
              stallNumber: i,
              status: 'available',
              booking: null
            });
          }
        });
        
        setStallData(mockData);
        showToast('Server connection failed. Showing demo data. Please restart the server and refresh.', { type: 'warning' });
      }
    } catch (error) {
      console.error('Error fetching stall data:', error);
      showToast('Network error. Please check if the server is running.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStallClick = (stall, block) => {
    if (stall.status === 'available') {
      setSelectedStall({
        ...stall,
        block,
        blockName: stallBlocks[block].name
      });
      setShowBookingModal(true);
    } else {
      setSelectedStall({
        ...stall,
        block,
        blockName: stallBlocks[block].name
      });
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStall || !bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.customerPhone) {
      showToast('Please fill in all required fields', { type: 'warning' });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      // For now, just simulate booking since we're having auth issues
      if (!token) {
        showToast('Admin booking simulation: This would book the stall in a real environment. Please ensure you are logged in as admin.', { type: 'info' });
        setShowBookingModal(false);
        setBookingForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          notes: ''
        });
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin/vendor-stalls/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stallInfo: {
            stallId: selectedStall.stallId,
            block: selectedStall.block,
            stallNumber: selectedStall.stallNumber,
            blockName: selectedStall.blockName
          },
          customer: {
            name: bookingForm.customerName,
            email: bookingForm.customerEmail,
            phone: bookingForm.customerPhone
          },
          notes: bookingForm.notes
        })
      });

      if (response.ok) {
        showToast(`Stall ${selectedStall.stallId} booked successfully!`, { type: 'success' });
        setShowBookingModal(false);
        setBookingForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          notes: ''
        });
        fetchStallData(); // Refresh stall data
        
        // Notify parent component to refresh bookings
        if (onBookingUpdate) {
          onBookingUpdate();
        }
      } else {
        const errorData = await response.json();
        showToast(`Booking failed: ${errorData.message}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Error booking stall:', error);
      showToast('Error booking stall. Please try again.', { type: 'error' });
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading vendor stall data...</div>;
  }

  if (!stallData) {
    return <div className="error">Failed to load vendor stall data</div>;
  }

  return (
    <div className="vendor-stall-admin">
      <div className="admin-header">
        <h2>Vendor Stall Management</h2>
        <div className="statistics">
          <div className="stat-card">
            <h3>{stallData.statistics.totalStalls}</h3>
            <p>Total Stalls</p>
          </div>
          <div className="stat-card booked">
            <h3>{stallData.statistics.bookedStalls}</h3>
            <p>Booked Stalls</p>
          </div>
          <div className="stat-card available">
            <h3>{stallData.statistics.availableStalls}</h3>
            <p>Available Stalls</p>
          </div>
          <div className="stat-card occupancy">
            <h3>{stallData.statistics.occupancyRate}%</h3>
            <p>Occupancy Rate</p>
          </div>
        </div>
      </div>

      <div className="stall-blocks">
        {Object.entries(stallData.stallBlocks).map(([blockLetter, blockData]) => (
          <div key={blockLetter} className="admin-stall-block">
            <h3>{blockData.name} ({blockData.count} stalls)</h3>
            <div className="admin-stall-grid">
              {blockData.stalls.map((stall) => (
                <div
                  key={stall.stallId}
                  className={`admin-stall-box ${stall.status}`}
                  onClick={() => handleStallClick(stall, blockLetter)}
                  title={stall.status === 'booked' 
                    ? `${stall.stallId} - Booked by ${stall.booking?.customerName}` 
                    : `${stall.stallId} - Available`
                  }
                >
                  <span className="stall-id">{stall.stallId}</span>
                  {stall.status === 'booked' && (
                    <div className="booking-info">
                      <small>{stall.booking?.customerName}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stall Details Modal */}
      {selectedStall && !showBookingModal && (
        <div className="modal-overlay" onClick={() => setSelectedStall(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Stall {selectedStall.stallId} Details</h3>
              <button onClick={() => setSelectedStall(null)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <p><strong>Block:</strong> {selectedStall.blockName}</p>
              <p><strong>Status:</strong> {selectedStall.status}</p>
              
              {selectedStall.status === 'booked' && selectedStall.booking && (
                <div className="booking-details">
                  <h4>Booking Information</h4>
                  <p><strong>Customer:</strong> {selectedStall.booking.customerName}</p>
                  <p><strong>Email:</strong> {selectedStall.booking.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedStall.booking.customerPhone}</p>
                  <p><strong>Start Date:</strong> {new Date(selectedStall.booking.startDate).toLocaleDateString()}</p>
                  <p><strong>Booked On:</strong> {new Date(selectedStall.booking.createdAt).toLocaleDateString()}</p>
                  {selectedStall.booking.notes && (
                    <p><strong>Notes:</strong> {selectedStall.booking.notes}</p>
                  )}
                </div>
              )}
              
              {selectedStall.status === 'available' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book This Stall
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Stall {selectedStall?.stallId}</h3>
              <button onClick={() => setShowBookingModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={bookingForm.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Customer Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={bookingForm.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Customer Phone *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={bookingForm.customerPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Additional notes about this booking..."
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Book Stall
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color booked"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStallAdmin;
