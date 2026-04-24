import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { submitBooking, setSelectedDate, setSelectedTime, setSelectedService, selectSelectedDate, selectSelectedTime, selectSelectedService, selectBookingsLoading } from '../features/bookingSlice';
import { timeSlots, formatDate } from '../utils/helpers';

const services = [
  { id: 1, name: 'Computer Repair', duration: '2-4 hours', price: 'Starting ₹499', icon: '🔧' },
  { id: 2, name: 'Software Installation', duration: '1-2 hours', price: 'Starting ₹299', icon: '⚙️' },
  { id: 3, name: 'Exam Form', duration: '30 mins', price: 'Starting ₹50', icon: '📝' },
  { id: 4, name: 'PF Service', duration: '1-2 days', price: 'Starting ₹199', icon: '🏦' },
  { id: 5, name: 'Other', duration: 'Flexible', price: 'Varies', icon: '❓' },
];
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../features/authSlice';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const selectedDate = useSelector(selectSelectedDate);
  const selectedTime = useSelector(selectSelectedTime);
  const selectedService = useSelector(selectSelectedService);
  const loading = useSelector(selectBookingsLoading);

  const [step, setStep] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [note, setNote] = useState('');

  if (!isAuth) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Login Required</h2>
            <p className="text-gray-500 mb-6">Please sign in to book a service appointment</p>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Calendar helpers
  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf('month').day();
  const today = dayjs();
  const bookedSlots = ['10:00 AM', '02:00 PM', '11:30 AM'];

  const handleConfirm = async () => {
    if (!name || !phone) { toast.error('Please fill in your contact details'); return; }
    const result = await dispatch(submitBooking({
      serviceType: selectedService,
      appointmentDate: selectedDate,
      timeSlot: selectedTime,
      details: note || `Booking for ${selectedService} requested by ${name}. Contact: ${phone}`,
    }));
    if (submitBooking.fulfilled.match(result)) {
      const id = result.payload?._id?.slice(-6).toUpperCase() || 'BK' + Math.random().toString(36).substr(2, 3).toUpperCase();
      setBookingId(id);
      setBooked(true);
      toast.success('Booking confirmed!');
    } else {
      toast.error(result.payload || 'Booking failed. Please try again.');
    }
  };


  if (booked) return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center p-10 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={60} className="text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-primary mb-3">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-2">{selectedService} on <strong>{formatDate(selectedDate)}</strong> at <strong>{selectedTime}</strong></p>
          <p className="text-secondary font-bold text-lg mb-8">Booking ID: #{bookingId}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard')}>View Bookings</Button>
            <Button variant="outline" onClick={() => { setBooked(false); setStep(0); dispatch(setSelectedDate(null)); dispatch(setSelectedTime(null)); dispatch(setSelectedService(null)); }}>
              Book Another
            </Button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        {/* Header */}
        <div className="bg-primary text-white py-12">
          <div className="page-container">
            <h1 className="text-4xl font-bold mb-2">Book a Service</h1>
            <p className="text-white/70">Schedule an appointment with our expert technicians</p>
          </div>
        </div>

        <div className="page-container py-10 max-w-4xl">
          {/* Progress steps */}
          <div className="flex items-center mb-10 gap-2">
            {['Select Service', 'Choose Date', 'Pick Time', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    i < step ? 'bg-primary text-white' : i === step ? 'bg-secondary text-white' : 'bg-surface text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-surface'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Service */}
            {step === 0 && (
              <motion.div key="service" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-2xl font-bold text-primary mb-6">Select a Service</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {services.map(service => (
                    <motion.button
                      key={service.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => dispatch(setSelectedService(service.name))}
                      className={`p-5 rounded-2xl text-left border-2 transition-all ${
                        selectedService === service.name
                          ? 'border-secondary bg-surface shadow-glow'
                          : 'border-surface bg-white hover:border-accent'
                      }`}
                    >
                      <div className="text-3xl mb-3">{service.icon}</div>
                      <h3 className="font-bold text-gray-800 mb-1">{service.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">⏱ {service.duration}</p>
                      <p className="text-secondary font-semibold text-sm">{service.price}</p>
                    </motion.button>
                  ))}
                </div>
                <Button disabled={!selectedService} onClick={() => setStep(1)} className="w-full sm:w-auto">
                  Continue to Date Selection →
                </Button>
              </motion.div>
            )}

            {/* Step 1: Date */}
            {step === 1 && (
              <motion.div key="date" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Calendar size={24} /> Select Date
                </h2>
                <div className="bg-white rounded-3xl p-6 shadow-card mb-6 max-w-sm">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="p-2 hover:bg-surface rounded-xl transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-bold text-gray-800">{currentMonth.format('MMMM YYYY')}</span>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="p-2 hover:bg-surface rounded-xl transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const date = currentMonth.date(day);
                      const isPast = date.isBefore(today, 'day');
                      const isSelected = selectedDate === date.format('YYYY-MM-DD');
                      const isToday = date.isSame(today, 'day');
                      return (
                        <motion.button
                          key={day}
                          whileHover={!isPast ? { scale: 1.15 } : {}}
                          whileTap={!isPast ? { scale: 0.9 } : {}}
                          disabled={isPast}
                          onClick={() => dispatch(setSelectedDate(date.format('YYYY-MM-DD')))}
                          className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                            isSelected ? 'bg-primary text-white shadow-glow' :
                            isToday ? 'bg-surface text-primary font-bold' :
                            isPast ? 'text-gray-300 cursor-not-allowed' :
                            'hover:bg-surface text-gray-700'
                          }`}
                        >
                          {day}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button disabled={!selectedDate} onClick={() => setStep(2)}>Continue →</Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Time */}
            {step === 2 && (
              <motion.div key="time" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Clock size={24} /> Select Time Slot
                </h2>
                <p className="text-gray-500 mb-5">Available slots for {formatDate(selectedDate)}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {timeSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTime === slot;
                    return (
                      <motion.button
                        key={slot}
                        whileHover={!isBooked ? { scale: 1.05 } : {}}
                        whileTap={!isBooked ? { scale: 0.95 } : {}}
                        disabled={isBooked}
                        onClick={() => dispatch(setSelectedTime(slot))}
                        className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border-2 ${
                          isBooked ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through' :
                          isSelected ? 'bg-primary text-white border-primary shadow-glow' :
                          'bg-white text-gray-700 border-surface hover:border-accent'
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-xs">Booked</span>}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button disabled={!selectedTime} onClick={() => setStep(3)}>Continue →</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-2xl font-bold text-primary mb-6">Confirm Booking</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-surface/60 rounded-2xl p-5 mb-5 space-y-3">
                      <h3 className="font-bold text-gray-800 mb-3">Booking Summary</h3>
                      {[
                        { label: 'Service', value: selectedService },
                        { label: 'Date', value: formatDate(selectedDate) },
                        { label: 'Time', value: selectedTime },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span className="text-gray-500">{row.label}</span>
                          <span className="font-semibold text-gray-800">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number *</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="10-digit mobile" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Additional Notes</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} className="input-field resize-none h-24" placeholder="Describe your issue..." />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button loading={loading} onClick={handleConfirm} className="flex-1 sm:flex-none sm:px-12 justify-center py-4">
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Booking;
