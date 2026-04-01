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
  username: z.string().min(1, 'Username is required'),
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
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      login(res.data.token, res.data.user.name, res.data.user.role);
      toast.success('Welcome back!', {
        description: `Logged in as ${res.data.user.role}`,
      });
    } catch (err: any) {
      // For demo: allow login with admin/password
      if (data.username === 'admin' && data.password === 'password') {
        login('demo-token-123', 'Yohannes Sintayhu Getan', 'ADMIN');
        toast.success('Welcome back!', {
          description: 'Logged in as ADMIN (demo mode)',
        });
      } else if (data.username === 'monitoring_manager' && data.password === 'Monitor2026!ews') {
        login('demo-token-monitoring', 'Monitoring Manager', 'MONITORING OFFICER');
        toast.success('Welcome back!', {
          description: 'Logged in as MONITORING OFFICER (demo mode)',
        });
      } else if (data.username === 'crm_manager' && data.password === 'password123') {
        login('demo-token-crm', 'CRM Manager', 'CRM MANAGER');
        toast.success('Welcome back!', {
          description: 'Logged in as CRM MANAGER (demo mode)',
        });
      } else if (data.username === 'crm_officer' && data.password === 'Crm2026!ews') {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1033] via-purple-900 to-[#1e1033]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-card border-white/10 shadow-2xl shadow-purple-900/40">
          <CardHeader className="text-center pb-2 pt-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mx-auto"
            >
              <div className="h-40 w-56 flex items-center justify-center mx-auto mb-2">
                <img src={cbeIcon} alt="CBE Logo" className="w-full h-full object-contain bg-transparent" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
              Commercial Bank of Ethiopia
            </h1>
            <p className="text-xl text-purple-600 mt-1 font-bold">
              Early Warning System
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 text-lg font-bold tracking-wide">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="admin"
                  {...register('username')}
                  className="bg-white border-purple-100 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 h-11"
                />
                {errors.username && (
                  <p className="text-xs text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 text-lg font-bold tracking-wide">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    {...register('password')}
                    className="bg-white border-purple-100 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30"
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

            <div className="text-center text-xs text-gray-500 mt-6 space-y-2">
              <p>
                Use <span className="text-purple-300">admin</span> /{' '}
                <span className="text-purple-300">password</span> for Admin
              </p>
              <p>
                Use <span className="text-purple-300">monitoring_manager</span> /{' '}
                <span className="text-purple-300">Monitor2026!ews</span> for Monitoring
              </p>
              <p>
                Use <span className="text-purple-300">crm_manager</span> /{' '}
                <span className="text-purple-300">password123</span> for CRM Manager
              </p>
              <p>
                Use <span className="text-purple-300">crm_officer</span> /{' '}
                <span className="text-purple-300">Crm2026!ews</span> for CRM Officer
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
