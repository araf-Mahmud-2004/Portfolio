import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading: authLoading, user } = useAuth();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-olive/20 to-charcoal">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with email:', email);
    try {
      const { data, error } = await signIn(email, password);
      console.log('Login response:', { data, error });
      
      if (error) {
        console.error('Login error details:', error);
        throw error;
      }
      
      // After successful login, wait a moment for the auth state to update
      setTimeout(() => {
        console.log('Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Invalid credentials. Please check your email and password.';
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account.';
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-olive/20 to-charcoal flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23FCE300' fill-opacity='0.1'%3E%3Cpath d='M0 30h60v30H0V30zm15-15h30v30H15V15z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Floating Security Icons with Enhanced Animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`security-${i}`}
            className="absolute text-neon/10 text-3xl"
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 15, -15, 0],
              opacity: [0.05, 0.2, 0.05],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          >
            {[<Shield key="shield" />, <Lock key="lock" />, <User key="user" />, <Sparkles key="sparkles" />][i % 4]}
          </motion.div>
        ))}

        {/* Glowing Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-3 h-3 bg-neon/20 rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${25 + (i % 2) * 50}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0.6, 0.2],
              y: [-20, 20, -20]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Enhanced Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-gray hover:text-neon transition-all duration-300 group"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="group-hover:underline">Back to Portfolio</span>
          </Link>
        </motion.div>

        {/* Enhanced Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-charcoal/90 backdrop-blur-xl rounded-3xl border border-olive/30 p-8 shadow-2xl shadow-neon/20 relative overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon/5 via-transparent to-olive/5 rounded-3xl" />
          
          <div className="relative z-10">
            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-r from-neon/20 to-olive/40 rounded-full p-1 mx-auto mb-6 relative"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(252, 227, 0, 0.3)",
                      "0 0 40px rgba(252, 227, 0, 0.5)",
                      "0 0 20px rgba(252, 227, 0, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full bg-charcoal rounded-full flex items-center justify-center"
                >
                  <Shield className="w-12 h-12 text-neon" />
                </motion.div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl font-bold text-off-white mb-3 bg-gradient-to-r from-off-white to-neon bg-clip-text text-transparent"
              >
                Admin Portal
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-muted-gray text-lg mb-4"
              >
                Secure access to portfolio management
              </motion.p>

              {/* Simple Admin Notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center"
              >
                <p className="text-blue-300 text-sm">
                  👋 <strong>Visitor?</strong> This is the admin area. Check out the{' '}
                  <Link 
                    to="/" 
                    className="text-neon hover:text-yellow-300 underline font-medium transition-colors"
                  >
                    main portfolio
                  </Link>{' '}
                  instead!
                </p>
              </motion.div>
            </div>

            {/* Enhanced Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Enhanced Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-light-gray flex items-center gap-2">
                  <User className="w-4 h-4 text-neon" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-4 text-off-white placeholder-muted-gray focus:border-neon focus:ring-2 focus:ring-neon/20 transition-all duration-300 outline-none group-hover:border-olive/50"
                    placeholder="Enter your email address"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Enhanced Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-light-gray flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neon" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-4 pr-12 text-off-white placeholder-muted-gray focus:border-neon focus:ring-2 focus:ring-neon/20 transition-all duration-300 outline-none group-hover:border-olive/50"
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-gray hover:text-neon transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Enhanced Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-neon to-yellow-300 text-charcoal py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-neon transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-neon/30 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full"
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Access Dashboard
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.div>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Enhanced Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-muted-gray bg-olive/10 rounded-full px-4 py-2 border border-olive/20">
                <Lock className="w-3 h-3" />
                <span>Protected by enterprise-grade security</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔒
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8 text-sm text-muted-gray"
        >
          <div className="flex items-center justify-center gap-2">
            <span>© 2024 Araf Mahmud</span>
            <span className="text-neon">•</span>
            <span>Portfolio Management System</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;