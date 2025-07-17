
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Upload, Check, ArrowLeft, Calendar, MapPin, User, CreditCard, X, Clock, AlertCircle, CheckCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const KYC = () => {
  const navigate = useNavigate();
  const { getUser, logout } = useAuthStore();
  const [step, setStep] = useState<'documents' | 'details' | 'review'>('documents');
  const [kycStatus, setKycStatus] = useState<'loading' | 'none' | 'pending' | 'rejected' | 'approved'>('loading');
  const [existingKyc, setExistingKyc] = useState<any>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    idNumber: '',
    idType: 'passport'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing KYC documents on component mount
  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const user = getUser();
        if (!user || !user.sub) {
          setKycStatus('none');
          return;
        }

        const response = await apiClient.get(`/api/kyc/documents/user/${user.sub}`);
        
        if (response.data.success && response.data.data) {
          console.log('Existing KYC data:', response.data.data);

          const kycData = response.data.data;
          setExistingKyc(kycData);
          
          // Set status based on API response
          if (kycData.status === 'PENDING') {
            setKycStatus('pending');
          } else if (kycData.status === 'REJECTED') {
            setKycStatus('rejected');
            // Pre-fill form with existing data for resubmission
            setPersonalDetails({
              fullName: kycData.fullName || '',
              dateOfBirth: kycData.dateOfBirth || '',
              nationality: kycData.nationality || '',
              address: kycData.address || '',
              city: kycData.city || '',
              postalCode: kycData.postalCode || '',
              country: kycData.country || '',
              idNumber: kycData.idNumber || '',
              idType: 'passport'
            });
          } else if (kycData.status === 'VERIFIED') {
            
            
            // Refresh token when KYC is verified
            try {
              const currentToken = localStorage.getItem('auth_token');
              console.log('Current token before refresh:', currentToken);
              const refreshResponse = await apiClient.post('/api/auth/refresh-token', {
                currentToken: currentToken,
                username: user.username || user.sub
              });
              
              if (refreshResponse.data.token) {
                // Update localStorage with new token
                localStorage.setItem('auth_token', refreshResponse.data.token);
                console.log('Token refreshed successfully after KYC verification');
              }
            } catch (error) {
              console.error('Error refreshing token after KYC verification:', error);
            }
            setKycStatus('approved');
            // Redirect to dashboard immediately if KYC is verified
            navigate('/customer/dashboard');
            return;
          }
        } else {
          setKycStatus('none');
        }
      } catch (error) {
        console.error('Error checking KYC status:', error);
        setKycStatus('none');
      }
    };

    checkKycStatus();
  }, [getUser]);

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    if (type === 'front') {
      setIdFront(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdFrontPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdBack(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdBackPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      setIdFront(null);
      setIdFrontPreview(null);
    } else {
      setIdBack(null);
      setIdBackPreview(null);
    }
  };

  const handleInputChange = (field: keyof typeof personalDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPersonalDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleDocumentsNext = () => {
    if (idFront && idBack) {
      setStep('details');
    }
  };

  const handleDetailsNext = () => {
    // Validate all required fields
    if (!personalDetails.fullName || !personalDetails.dateOfBirth || !personalDetails.nationality || 
        !personalDetails.idNumber || !personalDetails.address || !personalDetails.city || 
        !personalDetails.postalCode || !personalDetails.country) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setStep('review');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Validate all required fields
    if (!personalDetails.fullName || !personalDetails.dateOfBirth || !personalDetails.nationality || 
        !personalDetails.idNumber || !personalDetails.address || !personalDetails.city || 
        !personalDetails.postalCode || !personalDetails.country || !idFront || !idBack) {
      toast.error('Please fill in all required fields and upload both ID photos.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add personal details
      formData.append('fullName', personalDetails.fullName);
      formData.append('dateOfBirth', personalDetails.dateOfBirth);
      formData.append('nationality', personalDetails.nationality);
      formData.append('idNumber', personalDetails.idNumber);
      formData.append('address', personalDetails.address);
      formData.append('city', personalDetails.city);
      formData.append('postalCode', personalDetails.postalCode);
      formData.append('country', personalDetails.country);
      
      // Add photo files
      if (idFront) {
        formData.append('idFrontPhoto', idFront);
      }
      if (idBack) {
        formData.append('idBackPhoto', idBack);
      }
      
      // Submit to API
      const response = await apiClient.post('/api/kyc/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('KYC submission successful:', response.data);
      setIsLoading(false);
      
      // Show success message
      toast.success('KYC submission successful! Your verification is being processed.');
      
      // Update status to pending
      setKycStatus('pending');
      
      // You can also refresh the KYC status by calling the API again
      // or navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('KYC submission failed:', error);
      setIsLoading(false);
      
      // Show error message
      toast.error('KYC submission failed. Please try again.');
    }
  };

  const FileUploadBox = ({ 
    file, 
    preview,
    onFileChange, 
    onRemove,
    title, 
    description 
  }: { 
    file: File | null; 
    preview: string | null;
    onFileChange: (file: File) => void; 
    onRemove: () => void;
    title: string; 
    description: string; 
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-banking-primary transition-colors">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) onFileChange(selectedFile);
        }}
        className="hidden"
        id={title.toLowerCase().replace(' ', '-')}
      />
      
      {preview ? (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={preview} 
              alt={title}
              className="w-full h-48 object-contain rounded-lg border"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{file?.name}</p>
            <label htmlFor={title.toLowerCase().replace(' ', '-')} className="text-xs text-banking-primary cursor-pointer hover:underline">
              Click to change file
            </label>
          </div>
        </div>
      ) : (
        <label htmlFor={title.toLowerCase().replace(' ', '-')} className="cursor-pointer">
          <div className="text-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-secondary via-white to-orange-50 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16  rounded-xl flex items-center justify-center">
             <img src="/orbinw.png" alt="Logo" className="h-14" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {kycStatus === 'loading' && 'Loading...'}
              {kycStatus === 'pending' && 'KYC Verification Pending'}
              {kycStatus === 'rejected' && 'KYC Verification Rejected'}
              {kycStatus === 'approved' && 'KYC Verification Approved'}
              {kycStatus === 'none' && (
                <>
                  {step === 'documents' && 'Upload ID Documents'}
                  {step === 'details' && 'Personal Information'}
                  {step === 'review' && 'Review & Submit'}
                </>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {kycStatus === 'loading' && 'Checking your KYC status...'}
              {kycStatus === 'pending' && 'Your KYC documents are being reviewed. This may take 1-3 business days.'}
              {kycStatus === 'rejected' && 'Your KYC verification was rejected. Please resubmit with correct information.'}
              {kycStatus === 'approved' && 'Your account has been verified successfully!'}
              {kycStatus === 'none' && (
                <>
                  {step === 'documents' && 'Please upload clear photos of both sides of your ID'}
                  {step === 'details' && 'Complete your personal information for verification'}
                  {step === 'review' && 'Review your information before submitting'}
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {kycStatus === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-banking-primary"></div>
            </div>
          )}

          {kycStatus === 'pending' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Verification in Progress</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  We're reviewing your documents. You'll receive an email notification once the review is complete.
                </p>
                <div className="text-xs text-yellow-600">
                  <p>Submitted on: {new Date(existingKyc?.submittedAt).toLocaleDateString()}</p>
                  <p>Status: {existingKyc?.status}</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    logout();
                    navigate('/signin');
                  }}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </div>
          )}

          {kycStatus === 'rejected' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Verification Rejected</h3>
                <p className="text-sm text-red-700 mb-4">
                  Your KYC verification was rejected. Please check your information and documents, then resubmit.
                </p>
                <div className="text-xs text-red-600">
                  <p>Submitted on: {new Date(existingKyc?.submittedAt).toLocaleDateString()}</p>
                  <p>Status: {existingKyc?.status}</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setKycStatus('none')}
                  className="bg-banking-primary hover:bg-banking-primaryDark text-white"
                >
                  Resubmit KYC Documents
                </Button>
              </div>
            </div>
          )}

          {kycStatus === 'approved' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Verification Approved</h3>
                <p className="text-sm text-green-700 mb-4">
                  Congratulations! Your account has been successfully verified. You can now access all banking features.
                </p>
                <div className="text-xs text-green-600">
                  <p>Verified on: {new Date(existingKyc?.submittedAt).toLocaleDateString()}</p>
                  <p>Status: {existingKyc?.status}</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/customer/dashboard')}
                  className="bg-banking-primary hover:bg-banking-primaryDark text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}

          {kycStatus === 'none' && (
            <>
              {step === 'documents' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadBox
                      file={idFront}
                      preview={idFrontPreview}
                      onFileChange={(file) => handleFileUpload(file, 'front')}
                      onRemove={() => removeFile('front')}
                      title="ID Front"
                      description="Upload front side of your ID"
                    />
                    <FileUploadBox
                      file={idBack}
                      preview={idBackPreview}
                      onFileChange={(file) => handleFileUpload(file, 'back')}
                      onRemove={() => removeFile('back')}
                      title="ID Back"
                      description="Upload back side of your ID"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Document Requirements:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Clear, high-quality images</li>
                      <li>• All text must be readable</li>
                      <li>• No shadows or glare</li>
                      <li>• Accepted formats: JPG, PNG</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <Link to="/signup">
                      <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleDocumentsNext}
                      disabled={!idFront || !idBack}
                      className="bg-banking-primary hover:bg-banking-primaryDark text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-900">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={personalDetails.fullName}
                        onChange={handleInputChange('fullName')}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center text-sm font-medium text-gray-900">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalDetails.dateOfBirth}
                        onChange={handleInputChange('dateOfBirth')}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality" className="text-sm font-medium text-gray-900">
                        Nationality
                      </Label>
                      <Input
                        id="nationality"
                        value={personalDetails.nationality}
                        onChange={handleInputChange('nationality')}
                        placeholder="Your nationality"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="flex items-center text-sm font-medium text-gray-900">
                        <CreditCard className="w-4 h-4 mr-2" />
                        ID Number
                      </Label>
                      <Input
                        id="idNumber"
                        value={personalDetails.idNumber}
                        onChange={handleInputChange('idNumber')}
                        placeholder="Enter your ID number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center text-sm font-medium text-gray-900">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={personalDetails.address}
                      onChange={handleInputChange('address')}
                      placeholder="Enter your full address"
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-900">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={personalDetails.city}
                        onChange={handleInputChange('city')}
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium text-gray-900">
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        value={personalDetails.postalCode}
                        onChange={handleInputChange('postalCode')}
                        placeholder="Postal code"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-gray-900">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={personalDetails.country}
                        onChange={handleInputChange('country')}
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep('documents')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleDetailsNext}
                      className="bg-banking-primary hover:bg-banking-primaryDark text-white"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {idFrontPreview && (
                          <div className="space-y-2">
                            <img 
                              src={idFrontPreview} 
                              alt="ID Front"
                              className="w-full h-32 object-contain rounded border"
                            />
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-700">ID Front: {idFront?.name}</span>
                            </div>
                          </div>
                        )}
                        {idBackPreview && (
                          <div className="space-y-2">
                            <img 
                              src={idBackPreview} 
                              alt="ID Back"
                              className="w-full h-32 object-contain rounded border"
                            />
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-700">ID Back: {idBack?.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Name:</span> {personalDetails.fullName}</div>
                        <div><span className="font-medium">Date of Birth:</span> {personalDetails.dateOfBirth}</div>
                        <div><span className="font-medium">Nationality:</span> {personalDetails.nationality}</div>
                        <div><span className="font-medium">ID Number:</span> {personalDetails.idNumber}</div>
                        <div className="md:col-span-2"><span className="font-medium">Address:</span> {personalDetails.address}</div>
                        <div><span className="font-medium">City:</span> {personalDetails.city}</div>
                        <div><span className="font-medium">Country:</span> {personalDetails.country}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Please ensure all information is accurate. 
                      Your account verification may take 1-3 business days to complete.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep('details')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-banking-primary hover:bg-banking-primaryDark text-white"
                    >
                      {isLoading ? 'Submitting...' : 'Submit KYC'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYC;
