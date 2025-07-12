
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";

const AdminSignIn = () => {
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for admin login and sending verification code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setStep('verification');
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // Redirect to admin dashboard would happen here
    console.log('Admin sign in successful');
  };

  const handleResendCode = () => {
    console.log('Resending admin verification code...');
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
                ? 'Sign in to MyBank Admin Portal' 
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Admin Verification Code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-red-200" />
                      <InputOTPSlot index={1} className="border-red-200" />
                      <InputOTPSlot index={2} className="border-red-200" />
                      <InputOTPSlot index={3} className="border-red-200" />
                      <InputOTPSlot index={4} className="border-red-200" />
                      <InputOTPSlot index={5} className="border-red-200" />
                    </InputOTPGroup>
                  </InputOTP>
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
