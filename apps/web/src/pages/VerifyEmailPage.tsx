import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

export function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('No email provided. Please register again.');
      navigate('/register');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, otp });
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Verification failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg tracking-widest ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-primary hover:underline"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
}