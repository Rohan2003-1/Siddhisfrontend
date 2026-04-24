import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../features/authSlice';
import { Eye, EyeOff, Monitor } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  // Show backend error as a toast
  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser({ email: data.email, password: data.password }));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
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
              <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
              <p className="text-gray-500 mt-1 text-sm">Access your account and orders</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Email Address</label>
                  <motion.div variants={shakeVariant} animate={errors.email ? 'shake' : ''}>
                    <input
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                      className={`input-field ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
                      placeholder="name@example.com"
                    />
                  </motion.div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <a href="#" className="text-xs font-bold text-secondary hover:text-primary transition-colors">Forgot Password?</a>
                  </div>
                  <motion.div variants={shakeVariant} animate={errors.password ? 'shake' : ''} className="relative">
                    <input
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      type={showPass ? 'text' : 'password'}
                      className={`input-field pr-12 ${errors.password ? 'border-red-400 bg-red-50' : ''}`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </motion.div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{errors.password.message}</p>}
                </div>

                <Button type="submit" loading={loading} className="w-full bg-secondary text-white hover:bg-primary py-4 rounded-xl text-base font-bold shadow-lg shadow-secondary/20 transition-all duration-300 mt-2">
                  Sign In
                </Button>
              </form>

              <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <p className="text-gray-500 text-sm font-medium">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-secondary font-bold hover:text-primary transition-colors underline underline-offset-4">Create account</Link>
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} Siddhis Computers. Secure SSL Encryption.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
