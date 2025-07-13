
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Building2, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, verifyLogin, isLoading, setLoading, getUserRole } = useAuthStore();
  
  // Redirect if already authenticated
  useRedirectIfAuthenticated();
  
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  // Helper function to get status-specific messages
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'INACTIVE':
        return {
          title: 'Account Inactive',
          description: 'Your account is currently inactive. Please contact support to activate your account.',
          variant: 'destructive' as const
        };
      case 'SUSPENDED':
        return {
          title: 'Account Suspended',
          description: 'Your account has been suspended. Please contact support for assistance.',
          variant: 'destructive' as const
        };
      case 'DEACTIVATED':
        return {
          title: 'Account Deactivated',
          description: 'Your account has been deactivated. Please contact support to reactivate your account.',
          variant: 'destructive' as const
        };
      default:
        return null;
    }
  };

  // Helper function to parse error response
  const parseErrorResponse = (error: any) => {
    if (error.response?.status === 403 && error.response?.data?.error) {
      return error.response.data.error;
    }
    return null;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountStatus(null); // Clear any previous status
    
    try {
      await login({
        username: email,
        password: password
      });
      
      setStep('verification');
      toast.success('Login successful! Please check your email for verification code.');
    } catch (error) {
      console.error('Error during login:', error);
      
      // Check if it's a 403 error with specific status
      const errorStatus = parseErrorResponse(error);
      if (errorStatus && ['INACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(errorStatus)) {
        setAccountStatus(errorStatus);
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountStatus(null); // Clear any previous status
    
    try {
      await verifyLogin({
        username: email,
        code: verificationCode
      });
      
      // Check user role and navigate accordingly
      const userRole = getUserRole();
      
      if (userRole === 'NONE') {
        toast.success('Account needs verification. Redirecting to KYC...');
        navigate('/kyc');
      } else {
        toast.success('Welcome back! Redirecting to dashboard...');
        navigate('/customer/dashboard');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      
      // Check if it's a 403 error with specific status
      const errorStatus = parseErrorResponse(error);
      if (errorStatus && ['INACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(errorStatus)) {
        setAccountStatus(errorStatus);
      } else {
        toast.error('Verification failed. Please check your code and try again.');
      }
    }
  };

  const handleResendCode = async () => {
    setAccountStatus(null); // Clear any previous status
    
    try {
      // Resend verification code by calling login again
      await login({
        username: email,
        password: password
      });
      toast.success('Verification code resent! Please check your email.');
    } catch (error) {
      console.error('Error resending code:', error);
      
      // Check if it's a 403 error with specific status
      const errorStatus = parseErrorResponse(error);
      if (errorStatus && ['INACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(errorStatus)) {
        setAccountStatus(errorStatus);
      } else {
        toast.error('Failed to resend code. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-secondary via-white to-orange-50 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className=" h-20 rounded-xl flex items-center justify-center">
              <img src="/orbinw.png" alt="Logo" className="h-16" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'credentials' ? 'Welcome back' : 'Verify your email'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'credentials' 
                ? 'Sign in to your Orbin account' 
                : `We've sent a 6-digit code to ${email}`
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Account Status Alert */}
          {accountStatus && (
            <Alert variant={getStatusMessage(accountStatus)?.variant || 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <div className="font-medium">
                  {getStatusMessage(accountStatus)?.title}
                </div>
                <div>
                  {getStatusMessage(accountStatus)?.description}
                </div>
                <div className="text-sm">
                  Need help? Contact support at{' '}
                  <a href="mailto:support@orbin.com" className="text-banking-primary hover:underline">
                    orbin@ashanhimantha.com
                  </a>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
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
              
              <Button 
                type="submit" 
                className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white"
                disabled={isLoading || accountStatus !== null}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('credentials');
                    setAccountStatus(null); // Clear status when going back
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </div>

              <div className="space-y-2 w-full text-center">
                <label className="text-sm font-medium text-gray-900">
                  Verification code
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
                            const nextInput = document.getElementById(`signin-otp-${index + 1}`);
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          const prevInput = document.getElementById(`signin-otp-${index - 1}`);
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
                          const nextInput = document.getElementById(`signin-otp-${nextIndex}`);
                          nextInput?.focus();
                        }
                      }}
                      id={`signin-otp-${index}`}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                className="w-full text-banking-primary hover:text-banking-primaryDark"
                disabled={isLoading || accountStatus !== null}
              >
                Didn't receive a code? Resend
              </Button>
              
              <Button 
                type="submit" 
                className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white"
                disabled={isLoading || verificationCode.length !== 6 || accountStatus !== null}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            </form>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-banking-primary hover:text-banking-primaryDark font-medium">
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
