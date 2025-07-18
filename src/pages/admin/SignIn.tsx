
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard";
import { toast } from "sonner";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const { login, verifyLogin, isLoading, setLoading, getUserRole } = useAuthStore();
  
  // Redirect if already authenticated
  useRedirectIfAuthenticated();
  
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        username: email,
        password: password
      });
      
      setStep('verification');
      toast.success('Login successful! Please check your email for verification code.');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await verifyLogin({
        username: email,
        code: verificationCode
      });
      
      // Check user role and navigate accordingly
      const userRole = getUserRole();
      
      if (userRole === 'ADMIN') {
        toast.success('Admin login successful! Redirecting to admin dashboard...');
        navigate('/admin/dashboard');
      } else if (userRole === 'EMPLOYEE') {
        toast.success('Employee login successful! Redirecting to admin dashboard...');
        navigate('/admin/customers');
      } else {
        toast.error('Access denied. Admin or Employee access required.');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error('Verification failed. Please check your code and try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      // Resend verification code by calling login again
      await login({
        username: email,
        password: password
      });
      toast.success('Verification code resent! Please check your email.');
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'credentials' ? 'Admin Access' : 'Verify your email'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'credentials' 
                ? 'Sign in to Orbin admin Portal' 
                : `We've sent a 6-digit code to ${email}`
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-gray-900">
                  Admin Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-red-200 focus:border-red-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10 border-red-200 focus:border-red-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-700">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin access requires additional security verification
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying Access...' : 'Admin Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('credentials')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to admin sign in
                </Button>
              </div>

              <div className="space-y-2 w-full text-center">
                <label className="text-sm font-medium text-gray-900">
                  Admin Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={verificationCode[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (value.length <= 1 && /^[0-9A-Z]*$/.test(value)) {
                          const newCode = verificationCode.split('');
                          newCode[index] = value;
                          setVerificationCode(newCode.join(''));
                          
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = document.getElementById(`admin-otp-${index + 1}`);
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          const prevInput = document.getElementById(`admin-otp-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text');
                        const validChars = pastedData.replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, 6);
                        if (validChars.length > 0) {
                          setVerificationCode(validChars.padEnd(6, ''));
                          // Focus the last filled input or the next empty one
                          const nextIndex = Math.min(validChars.length, 5);
                          const nextInput = document.getElementById(`admin-otp-${nextIndex}`);
                          nextInput?.focus();
                        }
                      }}
                      id={`admin-otp-${index}`}
                      className="w-12 h-12 text-center text-lg font-semibold border-red-200"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                className="w-full text-red-600 hover:text-red-700"
              >
                Didn't receive a code? Resend
              </Button>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Access Admin'}
              </Button>
            </form>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Need customer access?{' '}
              <Link to="/signin" className="text-red-600 hover:text-red-700 font-medium">
                Customer Sign In
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignIn;
