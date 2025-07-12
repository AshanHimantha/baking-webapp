
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for login and sending verification code
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
    // Redirect to dashboard would happen here
    console.log('Sign in successful');
  };

  const handleResendCode = () => {
    console.log('Resending verification code...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-secondary via-white to-orange-50 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-banking-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'credentials' ? 'Welcome back' : 'Verify your email'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'credentials' 
                ? 'Sign in to your MyBank account' 
                : `We've sent a 6-digit code to ${email}`
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
                disabled={isLoading}
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
                  onClick={() => setStep('credentials')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Verification code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                className="w-full text-banking-primary hover:text-banking-primaryDark"
              >
                Didn't receive a code? Resend
              </Button>
              
              <Button 
                type="submit" 
                className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white"
                disabled={isLoading || verificationCode.length !== 6}
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
