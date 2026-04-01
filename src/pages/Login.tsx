import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import cbeIcon from '@/assets/icon-cbe.png';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username: data.email, password: data.password });
      login(res.data.token, res.data.user.name, res.data.user.role);
      toast.success('Welcome back!', {
        description: `Logged in as ${res.data.user.role}`,
      });
    } catch (err: any) {
      // For demo: allow login with demo credentials
      if (data.email === 'admin@cbe.com.et' && data.password === 'password') {
        login('demo-token-123', 'Yohannes Sintayhu Getan', 'ADMIN');
        toast.success('Welcome back!', {
          description: 'Logged in as ADMIN (demo mode)',
        });
      } else if (data.email === 'monitoring@cbe.com.et' && data.password === 'Monitor2026!ews') {
        login('demo-token-monitoring', 'Monitoring Manager', 'MONITORING OFFICER');
        toast.success('Welcome back!', {
          description: 'Logged in as MONITORING OFFICER (demo mode)',
        });
      } else if (data.email === 'crm_manager@cbe.com.et' && data.password === 'password123') {
        login('demo-token-crm', 'CRM Manager', 'CRM MANAGER');
        toast.success('Welcome back!', {
          description: 'Logged in as CRM MANAGER (demo mode)',
        });
      } else if (data.email === 'crm_officer@cbe.com.et' && data.password === 'Crm2026!ews') {
        login('demo-token-crm-officer', 'Abebe Kebede', 'CRM OFFICER');
        toast.success('Welcome back!', {
          description: 'Logged in as CRM OFFICER (demo mode)',
        });
      } else {
        toast.error('Login Failed', {
          description: err?.response?.data?.message || 'Invalid credentials',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1a0a1e 0%, #3d1036 30%, #1a0a1e 60%, #2d0e28 100%)' }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]"
        style={{ background: 'rgba(196, 31, 168, 0.2)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]"
        style={{ background: 'rgba(156, 21, 133, 0.15)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-card border-white/10 shadow-2xl" style={{ boxShadow: '0 25px 50px rgba(196, 31, 168, 0.25)' }}>
          <CardHeader className="text-center pb-2 pt-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mx-auto"
            >
              <div className="h-40 w-56 flex items-center justify-center mx-auto mb-2">
                <img
                  src={cbeIcon}
                  alt="CBE Logo"
                  className="w-full h-full object-contain bg-transparent"
                />
              </div>
            </motion.div>
            <h1
              className="text-3xl font-bold text-gray-900 tracking-wide"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Commercial Bank of Ethiopia
            </h1>
            <p
              className="text-xl mt-1 font-bold"
              style={{ color: '#c41fa8', fontFamily: "'Times New Roman', Times, serif" }}
            >
              Early Warning System
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-900 text-lg font-bold tracking-wide"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cbe.com.et"
                  {...register('email')}
                  className="bg-white text-gray-900 placeholder:text-gray-400 h-11"
                  style={{
                    borderColor: 'rgba(196, 31, 168, 0.2)',
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-900 text-lg font-bold tracking-wide"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    {...register('password')}
                    className="bg-white text-gray-900 placeholder:text-gray-400 h-11 pr-10"
                    style={{
                      borderColor: 'rgba(196, 31, 168, 0.2)',
                      fontFamily: "'Times New Roman', Times, serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
                    style={{ color: undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c41fa8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-white font-semibold transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #c41fa8 0%, #a61d94 100%)',
                  boxShadow: '0 4px 14px rgba(196, 31, 168, 0.3)',
                  fontFamily: "'Times New Roman', Times, serif",
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo credentials for all 4 roles */}
            <div
              className="text-center text-xs text-gray-500 mt-6 space-y-2"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              <p className="font-semibold text-gray-600 mb-1">Demo Credentials</p>
              <p>
                <span style={{ color: '#c41fa8' }}>admin@cbe.com.et</span> /{' '}
                <span style={{ color: '#c41fa8' }}>password</span>{' '}
                <span className="text-gray-400">— Admin</span>
              </p>
              <p>
                <span style={{ color: '#c41fa8' }}>monitoring@cbe.com.et</span> /{' '}
                <span style={{ color: '#c41fa8' }}>Monitor2026!ews</span>{' '}
                <span className="text-gray-400">— Monitoring</span>
              </p>
              <p>
                <span style={{ color: '#c41fa8' }}>crm_manager@cbe.com.et</span> /{' '}
                <span style={{ color: '#c41fa8' }}>password123</span>{' '}
                <span className="text-gray-400">— CRM Manager</span>
              </p>
              <p>
                <span style={{ color: '#c41fa8' }}>crm_officer@cbe.com.et</span> /{' '}
                <span style={{ color: '#c41fa8' }}>Crm2026!ews</span>{' '}
                <span className="text-gray-400">— CRM Officer</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
