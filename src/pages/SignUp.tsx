
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Phone number validation: not empty, positive, numbers only
    let phone = formData.phoneNumber.trim();
    if (!phone) {
      toast.error('Phone number is required.');
      return;
    }
    if (!/^[0-9]+$/.test(phone)) {
      toast.error('Phone number must contain only numbers.');
      return;
    }
    if (parseInt(phone, 10) <= 0) {
      toast.error('Phone number must be a positive number.');
      return;
    }

    // Auto-prefix for Sri Lanka
    let phoneNumber = phone;
    if (formData.country === 'LK' && !phone.startsWith('94')) {
      phoneNumber = '94' + phone.replace(/^0+/, '');
    }
    if (formData.country === 'LK' && !phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: phoneNumber,
        username: formData.username,
        password: formData.password
      };

      const response = await apiClient.post('/api/auth/register', requestBody);

      console.log('Registration successful:', response.data);
      toast.success('Account created successfully! Please check your email for verification.');
      setIsLoading(false);
      setStep('verification');

    } catch (error: any) {
      console.error('Registration failed:', error);

      // Extract error message from backend response
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the email verification API
      const response = await apiClient.post('/api/auth/verify-email', {
        email: formData.email,
        code: verificationCode
      });
      
      // Store the token in local storage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('Token stored in localStorage:', response.data.token);
      }
      
      toast.success('Email verified successfully! Redirecting to sign in...');
      setIsLoading(false);
      
      // Redirect to sign in page after successful verification
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (error: any) {
      console.error('Verification failed:', error);
      
      // Extract error message from backend response
      let errorMessage = 'Verification failed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-secondary via-white to-orange-50 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className=" h-12  rounded-xl flex items-center justify-center">
              <img src="/orbinw.png" alt="Logo" className="h-10" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'details' ? 'Create your account' : 'Verify your email'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'details' 
                ? 'Join Orbin and start managing your finances' 
                : `We've sent a 6-digit code to ${formData.email}`
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-900">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block mb-1">
                  Country & Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    id="country"
                    className="block w-2/5 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-banking-primary"
                    value={formData.country || ''}
                    onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    required
                  >
                    <option value="">Country</option>
                    <option value="US">United States (+1)</option>
                    <option value="CA">Canada (+1)</option>
                    <option value="GB">United Kingdom (+44)</option>
                    <option value="AU">Australia (+61)</option>
                    <option value="IN">India (+91)</option>
                    <option value="LK">Sri Lanka (+94)</option>
                    <option value="NG">Nigeria (+234)</option>
                    <option value="KE">Kenya (+254)</option>
                    <option value="ZA">South Africa (+27)</option>
                    <option value="PK">Pakistan (+92)</option>
                    <option value="BD">Bangladesh (+880)</option>
                    <option value="PH">Philippines (+63)</option>
                    <option value="DE">Germany (+49)</option>
                    <option value="FR">France (+33)</option>
                    <option value="BR">Brazil (+55)</option>
                    <option value="SG">Singapore (+65)</option>
                    <option value="MY">Malaysia (+60)</option>
                    <option value="GH">Ghana (+233)</option>
                    <option value="UG">Uganda (+256)</option>
                    <option value="RW">Rwanda (+250)</option>
                    <option value="TZ">Tanzania (+255)</option>
                    <option value="ZM">Zambia (+260)</option>
                    <option value="CM">Cameroon (+237)</option>
                    <option value="ET">Ethiopia (+251)</option>
                    <option value="SA">Saudi Arabia (+966)</option>
                    <option value="AE">UAE (+971)</option>
                    <option value="TR">Turkey (+90)</option>
                    <option value="IT">Italy (+39)</option>
                    <option value="ES">Spain (+34)</option>
                    <option value="JP">Japan (+81)</option>
                    <option value="KR">South Korea (+82)</option>
                    <option value="CN">China (+86)</option>
                    <option value="RU">Russia (+7)</option>
                    <option value="MX">Mexico (+52)</option>
                    <option value="AR">Argentina (+54)</option>
                    <option value="CO">Colombia (+57)</option>
                    <option value="TH">Thailand (+66)</option>
                    <option value="VN">Vietnam (+84)</option>
                    <option value="ID">Indonesia (+62)</option>
                    <option value="PL">Poland (+48)</option>
                    <option value="NL">Netherlands (+31)</option>
                    <option value="SE">Sweden (+46)</option>
                    <option value="CH">Switzerland (+41)</option>
                    <option value="BE">Belgium (+32)</option>
                    <option value="AT">Austria (+43)</option>
                    <option value="IE">Ireland (+353)</option>
                    <option value="DK">Denmark (+45)</option>
                    <option value="NO">Norway (+47)</option>
                    <option value="FI">Finland (+358)</option>
                    <option value="NZ">New Zealand (+64)</option>
                  </select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g. 555 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    required
                    className="w-3/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    className="pr-10"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('details')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to details
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
                            const nextInput = document.getElementById(`otp-${index + 1}`);
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
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
                          const nextInput = document.getElementById(`otp-${nextIndex}`);
                          nextInput?.focus();
                        }
                      }}
                      id={`otp-${index}`}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>
            </form>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {step === 'details' ? 'Already have an account?' : 'Already have an account?'}{' '}
              <Link to="/signin" className="text-banking-primary hover:text-banking-primaryDark font-medium">
                Sign in
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
