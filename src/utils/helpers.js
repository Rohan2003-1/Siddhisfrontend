export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const getDiscount = (original, current) =>
  Math.round(((original - current) / original) * 100);

export const generateOrderId = () =>
  'SC' + Math.random().toString(36).substr(2, 6).toUpperCase();

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'confirmed': return 'bg-accent/20 text-secondary';
    case 'completed': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];
