import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  registerUser,
  verifyOTP,
  selectAuthLoading,
  selectAuthError,
  selectPendingEmail,
  clearError,
} from '../features/authSlice';
import { Eye, EyeOff, Monitor, Mail } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const pendingEmail = useSelector(selectPendingEmail);

  // Show backend errors
  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  // Step 1 – Register (sends OTP)
  const onSubmit = async (data) => {
    const result = await dispatch(
      registerUser({ name: data.name, email: data.email, password: data.password })
    );
    if (registerUser.fulfilled.match(result)) {
      toast.success('OTP sent to your email! 📧');
    }
  };

  // Step 2 – Verify OTP
  const onVerifyOTP = async () => {
    if (!otpCode || otpCode.length < 4) {
      toast.error('Please enter the OTP');
      return;
    }
    const result = await dispatch(verifyOTP({ email: pendingEmail, otp: otpCode }));
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    }
  };

  const shakeVariant = {
    shake: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } },
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-white p-8 pb-4 text-center border-b border-gray-50">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Monitor size={32} className="text-secondary" />
                <span className="text-2xl font-black text-primary tracking-tight">
                  Siddhis<span className="text-secondary">Computers</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {pendingEmail ? 'Verify OTP' : 'Create Account'}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {pendingEmail ? `Code sent to ${pendingEmail}` : 'Join us for exclusive deals'}
              </p>
            </div>

            <div className="p-8">
              {/* ── OTP Step ─────────────────────────────────────────── */}
              {pendingEmail ? (
                <div className="space-y-6">
                  <div className="bg-surfaceLight border border-surface rounded-xl p-4 text-center">
                    <p className="text-sm text-secondary font-medium">
                      Check your email for a 6-digit verification code.
                    </p>
                  </div>

                  <div className="space-y-2 text-center">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Verification Code</label>
                    <input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-xl text-center text-3xl tracking-[0.5em] font-bold text-primary focus:border-secondary focus:bg-white focus:outline-none transition-all"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <Button loading={loading} onClick={onVerifyOTP} className="w-full bg-secondary text-white hover:bg-primary py-4 rounded-xl text-base font-bold shadow-lg shadow-secondary/20 transition-all">
                    Verify & Create Account
                  </Button>
                </div>
              ) : (
                /* ── Registration Step ───────────────────────────────── */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Full Name</label>
                    <motion.div variants={shakeVariant} animate={errors.name ? 'shake' : ''}>
                      <input {...register('name', { required: 'Name is required' })} className={`w-full p-4 border border-gray-200 rounded-xl focus:border-secondary outline-none transition ${errors.name ? 'border-red-400' : ''}`} placeholder="John Doe" />
                    </motion.div>
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Email Address</label>
                    <motion.div variants={shakeVariant} animate={errors.email ? 'shake' : ''}>
                      <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className={`w-full p-4 border border-gray-200 rounded-xl focus:border-secondary outline-none transition ${errors.email ? 'border-red-400' : ''}`} placeholder="name@example.com" />
                    </motion.div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Password</label>
                    <motion.div variants={shakeVariant} animate={errors.password ? 'shake' : ''} className="relative">
                      <input
                        {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                        type={showPass ? 'text' : 'password'}
                        className={`w-full p-4 border border-gray-200 rounded-xl focus:border-secondary outline-none transition pr-12 ${errors.password ? 'border-red-400' : ''}`}
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </motion.div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.password.message}</p>}
                  </div>

                  <Button type="submit" loading={loading} className="w-full bg-secondary text-white hover:bg-primary py-4 rounded-xl text-base font-bold shadow-lg shadow-secondary/20 transition-all mt-2">
                    Create Account
                  </Button>
                </form>
              )}

              <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <p className="text-gray-500 text-sm font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-secondary font-bold hover:text-primary transition-colors underline underline-offset-4">Sign In</Link>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} Siddhis Computers. 100% Secure Checkout.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
