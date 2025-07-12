
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Upload, Check, ArrowLeft, Calendar, MapPin, User, CreditCard } from "lucide-react";

const KYC = () => {
  const [step, setStep] = useState<'documents' | 'details' | 'review'>('documents');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    occupation: '',
    sourceOfIncome: '',
    monthlyIncome: '',
    idNumber: '',
    idType: 'passport'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    if (type === 'front') {
      setIdFront(file);
    } else {
      setIdBack(file);
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
    setStep('review');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    console.log('KYC submission successful');
    // Redirect to dashboard would happen here
  };

  const FileUploadBox = ({ 
    file, 
    onFileChange, 
    title, 
    description 
  }: { 
    file: File | null; 
    onFileChange: (file: File) => void; 
    title: string; 
    description: string; 
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-banking-primary transition-colors">
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) onFileChange(selectedFile);
        }}
        className="hidden"
        id={title.toLowerCase().replace(' ', '-')}
      />
      <label htmlFor={title.toLowerCase().replace(' ', '-')} className="cursor-pointer">
        {file ? (
          <div className="space-y-2">
            <Check className="w-8 h-8 text-green-500 mx-auto" />
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">Click to change file</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-secondary via-white to-orange-50 flex items-center justify-center p-4 font-geist">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-banking-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'documents' && 'Upload ID Documents'}
              {step === 'details' && 'Personal Information'}
              {step === 'review' && 'Review & Submit'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'documents' && 'Please upload clear photos of both sides of your ID'}
              {step === 'details' && 'Complete your personal information for verification'}
              {step === 'review' && 'Review your information before submitting'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'documents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadBox
                  file={idFront}
                  onFileChange={(file) => handleFileUpload(file, 'front')}
                  title="ID Front"
                  description="Upload front side of your ID"
                />
                <FileUploadBox
                  file={idBack}
                  onFileChange={(file) => handleFileUpload(file, 'back')}
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
                  <li>• Accepted formats: JPG, PNG, PDF</li>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-medium text-gray-900">
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    value={personalDetails.occupation}
                    onChange={handleInputChange('occupation')}
                    placeholder="Your occupation"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-900">
                    Monthly Income
                  </Label>
                  <Input
                    id="monthlyIncome"
                    value={personalDetails.monthlyIncome}
                    onChange={handleInputChange('monthlyIncome')}
                    placeholder="Monthly income"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceOfIncome" className="text-sm font-medium text-gray-900">
                  Source of Income
                </Label>
                <Input
                  id="sourceOfIncome"
                  value={personalDetails.sourceOfIncome}
                  onChange={handleInputChange('sourceOfIncome')}
                  placeholder="e.g., Employment, Business, Investments"
                  required
                />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">ID Front: {idFront?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">ID Back: {idBack?.name}</span>
                    </div>
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
                    <div><span className="font-medium">Occupation:</span> {personalDetails.occupation}</div>
                    <div><span className="font-medium">Monthly Income:</span> {personalDetails.monthlyIncome}</div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default KYC;
