import React, { useState, useEffect } from 'react';
import {
  Search, Filter, CheckCircle, XCircle, AlertCircle,
  MessageSquare, Eye, EyeOff, Clock, User, Car, Shield,
  TrendingUp, DollarSign, Users, Calendar, MapPin, Star,
  ChevronRight, ChevronLeft, Download, RefreshCw, MoreVertical,
  Mail, Phone, MessageCircle, FileText, Camera, Image as ImageIcon,
  Settings, LogOut, Bell, Home, BarChart, Package, CreditCard,
  Zap, Users as UsersIcon, ShieldCheck, Settings as SettingsIcon
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  memberSince: string;
  status: 'active' | 'pending' | 'suspended';
  verificationLevel: 'basic' | 'verified' | 'premium';
  lastActive: string;
}

interface CarListing {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  carName: string;
  carType: string;
  price: number;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submittedDate: string;
  images: {
    front: string;
    back: string;
    side: string;
    interior: string;
    dashboard: string;
  };
  specifications: {
    year: number;
    fuelType: string;
    engine: string;
    mileage: string;
    color: string;
    registration: string;
  };
  adminComments: AdminComment[];
  rejectionReason?: string;
  verificationScore: number;
}

interface AdminComment {
  id: string;
  adminName: string;
  message: string;
  timestamp: string;
  type: 'comment' | 'rejection' | 'approval';
}

interface Booking {
  id: string;
  userName: string;
  carName: string;
  dates: string;
  total: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  bookingDate: string;
}

interface AdminStats {
  totalListings: number;
  pendingListings: number;
  totalUsers: number;
  newUsers: number;
  totalBookings: number;
  activeBookings: number;
  revenue: number;
  approvalRate: number;
}

// Notification System
const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'new_listing' as const,
      title: 'New Car Listing',
      message: 'Toyota Camry 2023 submitted for review',
      timestamp: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'user_signup' as const,
      title: 'New User Registered',
      message: 'John Doe registered as a new host',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'booking' as const,
      title: 'New Booking',
      message: 'Mercedes C-Class booked for 5 days',
      timestamp: '5 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'issue' as const,
      title: 'Reported Issue',
      message: 'User reported issue with booking #12345',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button className="relative p-2 hover:bg-gray-100 rounded-lg">
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>
      
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 border border-gray-200 hidden group-hover:block z-50">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900">Notifications</p>
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'new_listing' ? 'bg-green-100 text-green-600' :
                  notification.type === 'user_signup' ? 'bg-blue-100 text-blue-600' :
                  notification.type === 'booking' ? 'bg-purple-100 text-purple-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {notification.type === 'new_listing' && <Car className="w-4 h-4" />}
                  {notification.type === 'user_signup' && <User className="w-4 h-4" />}
                  {notification.type === 'booking' && <Calendar className="w-4 h-4" />}
                  {notification.type === 'issue' && <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 px-4 py-3">
          <button className="text-sm text-blue-600 hover:text-blue-700 w-full text-center">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Cards Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, icon, color }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  </div>
);

// Listing Review Card Component
const ListingReviewCard: React.FC<{
  listing: CarListing;
  onSelect: (listing: CarListing) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestRevision: (id: string) => void;
}> = ({ listing, onSelect, onApprove, onReject, onRequestRevision }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                {listing.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">Score: {listing.verificationScore}/100</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900">{listing.carName}</h3>
            <p className="text-sm text-gray-600">{listing.carType}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₦{listing.price.toLocaleString()}<span className="text-sm text-gray-500">/day</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>{listing.userName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Submitted: {new Date(listing.submittedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2" />
            <span>Year: {listing.specifications.year}</span>
          </div>
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {Object.entries(listing.images).map(([key, url]) => (
            <div key={key} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={url}
                alt={`${key} view`}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Admin Comments Preview */}
        {listing.adminComments.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Previous Comments:</p>
            <div className="space-y-2">
              {listing.adminComments.slice(0, 2).map(comment => (
                <div key={comment.id} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{comment.adminName}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1">{comment.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onSelect(listing)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review Details
          </button>
          
          {listing.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(listing.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Approve Listing"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRequestRevision(listing.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Request Revision"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(listing.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Reject Listing"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Detailed Review Modal
const ReviewModal: React.FC<{
  listing: CarListing;
  onClose: () => void;
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestRevision: (id: string, comment: string) => void;
  onAddComment: (id: string, comment: string) => void;
}> = ({ listing, onClose, onApprove, onReject, onRequestRevision, onAddComment }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisionComment, setRevisionComment] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(listing.id, newComment);
      setNewComment('');
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(listing.id, rejectionReason);
      onClose();
    }
  };

  const handleRequestRevision = () => {
    if (revisionComment.trim()) {
      onRequestRevision(listing.id, revisionComment);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Listing</h2>
              <p className="text-gray-600">{listing.carName} • Submitted by {listing.userName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-1 mt-6 p-1 bg-gray-100 rounded-lg">
            {['details', 'images', 'comments', 'verification'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Car Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium">{listing.specifications.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-medium">{listing.specifications.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engine</p>
                      <p className="font-medium">{listing.specifications.engine}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-medium">{listing.specifications.mileage} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-medium">{listing.specifications.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration</p>
                      <p className="font-medium">{listing.specifications.registration}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Owner Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{listing.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{listing.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{listing.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted Date</p>
                      <p className="font-medium">{new Date(listing.submittedDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Verification Score: {listing.verificationScore}/100</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Image Quality</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Information Completeness</span>
                        <span>90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Price Competitiveness</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Admin Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => onApprove(listing.id)}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Listing
                    </button>
                    
                    <div className="space-y-2">
                      <textarea
                        value={revisionComment}
                        onChange={(e) => setRevisionComment(e.target.value)}
                        placeholder="Add comments for revision request..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <button
                        onClick={handleRequestRevision}
                        disabled={!revisionComment.trim()}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Request Revision
                      </button>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                      <button
                        onClick={handleReject}
                        disabled={!rejectionReason.trim()}
                        className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject Listing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(listing.images).map(([key, url]) => (
                  <div key={key} className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900 capitalize">{key} View</h4>
                    </div>
                    <div className="p-4">
                      <img
                        src={url}
                        alt={`${key} view`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="flex space-x-2 mt-4">
                        <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">
                          <Eye className="w-4 h-4 inline mr-1" />
                          View Full Size
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          Flag Issue
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Admin Comments</h3>
                
                <div className="space-y-4 mb-6">
                  {listing.adminComments.map(comment => (
                    <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{comment.adminName}</p>
                          <p className="text-sm text-gray-500">{comment.type}</p>
                        </div>
                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.message}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Add New Comment</h4>
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Verification Checklist</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 1, title: 'Vehicle Documents Verified', checked: true },
                    { id: 2, title: 'Owner Identity Verified', checked: true },
                    { id: 3, title: 'Insurance Coverage Valid', checked: false },
                    { id: 4, title: 'All Required Images Provided', checked: true },
                    { id: 5, title: 'Price Within Market Range', checked: true },
                    { id: 6, title: 'No Prohibited Content in Images', checked: true },
                    { id: 7, title: 'Vehicle Not Reported Stolen', checked: true },
                    { id: 8, title: 'Registration Details Match', checked: false },
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          readOnly
                        />
                        <span className="ml-3 text-gray-700">{item.title}</span>
                      </div>
                      {item.checked ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Pending Items</h4>
                  <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                    <li>Insurance document verification required</li>
                    <li>Registration number needs verification with authorities</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement: React.FC<{
  users: User[];
  onUserAction: (userId: string, action: string) => void;
}> = ({ users, onUserAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">User Management</h3>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.verificationLevel === 'premium' ? 'bg-purple-100 text-purple-800' :
                      user.verificationLevel === 'verified' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.verificationLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.memberSince).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onUserAction(user.id, 'verify')}
                        className="text-green-600 hover:text-green-900"
                        title="Verify User"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onUserAction(user.id, 'suspend')}
                        className="text-red-600 hover:text-red-900"
                        title="Suspend User"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onUserAction(user.id, 'message')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Message User"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedListing, setSelectedListing] = useState<CarListing | null>(null);
  const [listings, setListings] = useState<CarListing[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      carName: 'Toyota Camry 2023',
      carType: 'Executive Sedan',
      price: 35000,
      location: 'Lagos, VI',
      status: 'pending',
      submittedDate: new Date().toISOString(),
      images: {
        front: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
        side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
        interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
      },
      specifications: {
        year: 2023,
        fuelType: 'Petrol',
        engine: '2.5L 4-cylinder',
        mileage: '15,000 km',
        color: 'Pearl White',
        registration: 'LAG-123-AB'
      },
      adminComments: [],
      verificationScore: 85
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      carName: 'Mercedes-Benz C-Class 2022',
      carType: 'Luxury Sedan',
      price: 55000,
      location: 'Abuja, Maitama',
      status: 'needs_revision',
      submittedDate: new Date(Date.now() - 86400000).toISOString(),
      images: {
        front: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        back: 'https://images.unsplash.com/photo-1593941707882-a5bba53388fe?w=800&q=80',
        side: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
        interior: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        dashboard: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
      },
      specifications: {
        year: 2022,
        fuelType: 'Petrol',
        engine: '2.0L Turbo',
        mileage: '25,000 km',
        color: 'Black',
        registration: 'ABJ-456-CD'
      },
      adminComments: [
        {
          id: '1',
          adminName: 'Admin User',
          message: 'Please provide clearer images of the interior',
          timestamp: '2024-01-15 10:30:00',
          type: 'comment'
        }
      ],
      verificationScore: 70
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 800 000 0001',
      location: 'Lagos',
      profileImage: '',
      memberSince: '2024-01-01',
      status: 'active',
      verificationLevel: 'verified',
      lastActive: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 800 000 0002',
      location: 'Abuja',
      profileImage: '',
      memberSince: '2024-01-05',
      status: 'pending',
      verificationLevel: 'basic',
      lastActive: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [stats] = useState<AdminStats>({
    totalListings: 156,
    pendingListings: 12,
    totalUsers: 2450,
    newUsers: 45,
    totalBookings: 892,
    activeBookings: 78,
    revenue: 15600000,
    approvalRate: 92
  });

  const handleApproveListing = (id: string, comment?: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === id) {
        const newComment: AdminComment = {
          id: Date.now().toString(),
          adminName: 'Admin User',
          message: comment || 'Listing approved',
          timestamp: new Date().toISOString(),
          type: 'approval'
        };
        
        return {
          ...listing,
          status: 'approved',
          adminComments: [...listing.adminComments, newComment]
        };
      }
      return listing;
    }));
    
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
    
    alert('Listing approved successfully!');
  };

  const handleRejectListing = (id: string, reason: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === id) {
        const newComment: AdminComment = {
          id: Date.now().toString(),
          adminName: 'Admin User',
          message: `Rejected: ${reason}`,
          timestamp: new Date().toISOString(),
          type: 'rejection'
        };
        
        return {
          ...listing,
          status: 'rejected',
          adminComments: [...listing.adminComments, newComment],
          rejectionReason: reason
        };
      }
      return listing;
    }));
    
    alert('Listing rejected. User has been notified.');
  };

  const handleRequestRevision = (id: string, comment: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === id) {
        const newComment: AdminComment = {
          id: Date.now().toString(),
          adminName: 'Admin User',
          message: `Revision requested: ${comment}`,
          timestamp: new Date().toISOString(),
          type: 'comment'
        };
        
        return {
          ...listing,
          status: 'needs_revision',
          adminComments: [...listing.adminComments, newComment]
        };
      }
      return listing;
    }));
    
    alert('Revision requested. User has been notified.');
  };

  const handleAddComment = (id: string, comment: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === id) {
        const newComment: AdminComment = {
          id: Date.now().toString(),
          adminName: 'Admin User',
          message: comment,
          timestamp: new Date().toISOString(),
          type: 'comment'
        };
        
        return {
          ...listing,
          adminComments: [...listing.adminComments, newComment]
        };
      }
      return listing;
    }));
    
    if (selectedListing?.id === id) {
      setSelectedListing(prev => prev ? {
        ...prev,
        adminComments: [...prev.adminComments, {
          id: Date.now().toString(),
          adminName: 'Admin User',
          message: comment,
          timestamp: new Date().toISOString(),
          type: 'comment'
        }]
      } : null);
    }
    
    alert('Comment added successfully!');
  };

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'verify':
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, verificationLevel: 'verified', status: 'active' }
            : user
        ));
        alert('User verified successfully!');
        break;
      case 'suspend':
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'suspended' }
            : user
        ));
        alert('User suspended!');
        break;
      case 'message':
        // Open messaging interface
        alert('Open messaging interface for user');
        break;
    }
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const needsRevisionListings = listings.filter(l => l.status === 'needs_revision');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
                <div className="flex items-center space-x-1 mt-[-4px]">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Control Panel</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <AdminNotifications />
              
              <div className="relative group">
                <button className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-200 z-50">
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <SettingsIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <a href="/" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Home className="w-4 h-4" />
                    <span>Back to Site</span>
                  </a>
                  <div className="border-t my-1"></div>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending Listings"
            value={stats.pendingListings}
            change="+2"
            icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
            color="text-yellow-600"
          />
          <StatsCard
            title="Total Revenue"
            value={`₦${(stats.revenue / 1000000).toFixed(1)}M`}
            change="+15%"
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            color="text-green-600"
          />
          <StatsCard
            title="New Users"
            value={stats.newUsers}
            change="+8"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="text-blue-600"
          />
          <StatsCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            change="+3%"
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            color="text-purple-600"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-xl border border-gray-200 p-1 mb-8">
          {['dashboard', 'listings', 'users', 'bookings', 'reports', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-all flex items-center space-x-2 ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab === 'dashboard' && <BarChart className="w-4 h-4" />}
              {tab === 'listings' && <Car className="w-4 h-4" />}
              {tab === 'users' && <Users className="w-4 h-4" />}
              {tab === 'bookings' && <Calendar className="w-4 h-4" />}
              {tab === 'reports' && <FileText className="w-4 h-4" />}
              {tab === 'settings' && <Settings className="w-4 h-4" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Pending Listings Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pending Listings ({pendingListings.length})</h2>
                <button className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                  View All →
                </button>
              </div>
              
              {pendingListings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingListings.map(listing => (
                    <ListingReviewCard
                      key={listing.id}
                      listing={listing}
                      onSelect={setSelectedListing}
                      onApprove={handleApproveListing}
                      onReject={handleRejectListing}
                      onRequestRevision={handleRequestRevision}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Listings</h3>
                  <p className="text-gray-600">All listings have been reviewed and processed.</p>
                </div>
              )}
            </div>

            {/* Needs Revision Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Needs Revision ({needsRevisionListings.length})</h2>
                <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  View All →
                </button>
              </div>
              
              {needsRevisionListings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {needsRevisionListings.map(listing => (
                    <ListingReviewCard
                      key={listing.id}
                      listing={listing}
                      onSelect={setSelectedListing}
                      onApprove={handleApproveListing}
                      onReject={handleRejectListing}
                      onRequestRevision={handleRequestRevision}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Revisions Required</h3>
                  <p className="text-gray-600">All listings meet the required standards.</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Listing Approved</p>
                        <p className="text-xs text-gray-500">Toyota Camry 2023</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">10 min ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Revision Requested</p>
                        <p className="text-xs text-gray-500">Mercedes C-Class</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New User Registered</p>
                        <p className="text-xs text-gray-500">John Smith</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Verification Queue</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pending Listings</span>
                      <span>{pendingListings.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(pendingListings.length / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Needs Revision</span>
                      <span>{needsRevisionListings.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(needsRevisionListings.length / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate</span>
                      <span>{stats.approvalRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.approvalRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-left flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Batch Approve Selected
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-left flex items-center">
                    <Download className="w-5 h-5 mr-3" />
                    Export Reports
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-left flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">All Listings</h3>
                  <p className="text-gray-600">Manage and review all car listings</p>
                </div>
                
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                    />
                  </div>
                  
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Needs Revision</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={listing.images.front}
                              alt={listing.carName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{listing.carName}</div>
                              <div className="text-sm text-gray-500">{listing.carType}</div>
                              <div className="text-sm text-gray-500">{listing.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{listing.userName}</div>
                          <div className="text-sm text-gray-500">{listing.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">₦{listing.price.toLocaleString()}/day</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                            listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {listing.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(listing.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedListing(listing)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Review"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {listing.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveListing(listing.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectListing(listing.id, 'Quality issues')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement users={users} onUserAction={handleUserAction} />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Admin Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Listing Approval Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Auto-approval for verified users</label>
                      <div className="relative">
                        <input type="checkbox" id="autoApprove" className="sr-only" />
                        <label
                          htmlFor="autoApprove"
                          className="block w-14 h-8 bg-green-600 rounded-full cursor-pointer"
                        >
                          <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Minimum verification score for auto-approval</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        defaultValue="80"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>50%</span>
                        <span className="font-medium">80%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Notification Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email notifications for new listings</span>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only" />
                        <div className="block w-14 h-8 bg-green-600 rounded-full"></div>
                        <div className="dot absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SMS alerts for high-priority issues</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="block w-14 h-8 bg-gray-300 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedListing && (
        <ReviewModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={handleApproveListing}
          onReject={handleRejectListing}
          onRequestRevision={handleRequestRevision}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default AdminDashboard;