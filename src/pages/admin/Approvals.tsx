
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

interface KYCDocument {
  id: number;
  username: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idFrontPhotoPath: string;
  idBackPhotoPath: string;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

interface KYCImages {
  frontImageUrl: string;
  backImageUrl: string;
  documentId: number;
  username: string;
}

interface KYCImageUrls {
  frontImageUrl: string;
  backImageUrl: string;
  documentId: number;
  username: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  timestamp: number;
  error?: string;
}

const AdminApprovals = () => {
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalCounts, setApprovalCounts] = useState({
    pending: 0,
    highPriority: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [documentImages, setDocumentImages] = useState<KYCImageUrls | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [processingApproval, setProcessingApproval] = useState<number | null>(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [reviewNotesDialogOpen, setReviewNotesDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewDocument, setReviewDocument] = useState<{ username: string; documentId: number } | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');

  // Get current user from JWT token
  const getCurrentUser = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return '';
    
    try {
      // Decode JWT payload (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.sub || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  };

  // Fetch KYC documents
  const fetchKYCDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<KYCDocument[]>>('/api/admin/kyc/documents/status/PENDING');
      
      if (response.data.success) {
        setKycDocuments(response.data.data);
        setApprovalCounts(prev => ({
          ...prev,
          pending: response.data.data.length,
          highPriority: response.data.data.filter(doc => 
            new Date(doc.submittedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length
        }));
      } else {
        toast.error(response.data.error || 'Failed to fetch KYC documents');
      }
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      toast.error('Failed to fetch KYC documents');
    } finally {
      setLoading(false);
    }
  };

  // Fetch authenticated image as blob and create object URL
  const fetchAuthenticatedImage = async (imageUrl: string): Promise<string> => {
    try {
      const response = await apiClient.get(imageUrl, {
        responseType: 'blob',
      });
      const blob = response.data;
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching authenticated image:', error);
      return '/placeholder.svg';
    }
  };

  // Create authenticated image URL
  const createAuthenticatedImageUrl = (imageUrl: string) => {
    console.log('Original imageUrl:', imageUrl);
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      console.log('Image URL is already full URL:', imageUrl);
      return imageUrl;
    }
    
    // If it's a relative path from the API (like /api/admin/kyc/images/filename.jpg)
    // prepend the base URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    console.log('Base URL:', baseUrl);
    
    // If the imageUrl already starts with /api, just prepend the base URL
    if (imageUrl.startsWith('/api')) {
      const finalUrl = `${baseUrl}${imageUrl}`;
      console.log('Final image URL (starts with /api):', finalUrl);
      return finalUrl;
    }
    
    // Otherwise, construct the full path
    const finalUrl = `${baseUrl}/api/admin/kyc/images/${imageUrl}`;
    console.log('Final image URL (constructed):', finalUrl);
    return finalUrl;
  };

  // Fetch document images
  const fetchDocumentImages = async (documentId: number) => {
    try {
      setLoadingImages(true);
      console.log('Fetching images for document ID:', documentId);
      const response = await apiClient.get<ApiResponse<KYCImages>>(`/api/admin/kyc/documents/${documentId}/images`);
      
      if (response.data.success) {
        console.log('API Response data:', response.data.data);
        
        // Fetch the actual images with authentication and create object URLs
        const frontImageUrl = await fetchAuthenticatedImage(response.data.data.frontImageUrl);
        const backImageUrl = await fetchAuthenticatedImage(response.data.data.backImageUrl);
        
        const authenticatedImages: KYCImageUrls = {
          ...response.data.data,
          frontImageUrl,
          backImageUrl
        };
        
        console.log('Authenticated images with object URLs:', authenticatedImages);
        setDocumentImages(authenticatedImages);
      } else {
        toast.error(response.data.error || 'Failed to fetch document images');
      }
    } catch (error) {
      console.error('Error fetching document images:', error);
      toast.error('Failed to fetch document images');
    } finally {
      setLoadingImages(false);
    }
  };

  // Handle approval/rejection with review notes
  const handleApprovalWithNotes = async () => {
    if (!reviewDocument || !reviewAction) return;
    
    try {
      setProcessingApproval(reviewDocument.documentId);
      
      const reviewData = {
        reviewNotes: reviewNotes.trim() || (reviewAction === 'approve' ? 'Document verified and approved' : 'Document rejected'),
        reviewedBy: currentUser
      };
      
      if (reviewAction === 'approve') {
        const response = await apiClient.post(`/api/admin/users/${reviewDocument.username}/approve-kyc`, reviewData);
        
        // API returns { "message": "..." } with HTTP 200
        if (response.status === 200) {
          toast.success(response.data.message || `KYC approved for ${reviewDocument.username}`);
          // Remove the approved document from the list
          setKycDocuments(prev => prev.filter(doc => doc.id !== reviewDocument.documentId));
          setApprovalCounts(prev => ({
            ...prev,
            pending: prev.pending - 1,
            approvedToday: prev.approvedToday + 1
          }));
        } else {
          toast.error('Failed to approve KYC');
        }
      } else {
        // For rejection, use the correct reject endpoint
        const response = await apiClient.post(`/api/admin/users/${reviewDocument.username}/reject-kyc`, reviewData);
        
        // API returns { "message": "..." } with HTTP 200
        if (response.status === 200) {
          toast.success(response.data.message || `KYC rejected for ${reviewDocument.username}`);
          setKycDocuments(prev => prev.filter(doc => doc.id !== reviewDocument.documentId));
          setApprovalCounts(prev => ({
            ...prev,
            pending: prev.pending - 1,
            rejectedToday: prev.rejectedToday + 1
          }));
        } else {
          toast.error('Failed to reject KYC');
        }
      }
      
      // Close dialog and reset state
      setReviewNotesDialogOpen(false);
      setReviewNotes('');
      setReviewAction(null);
      setReviewDocument(null);
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error(`Failed to ${reviewAction} KYC`);
    } finally {
      setProcessingApproval(null);
    }
  };

  // Open review notes dialog
  const openReviewDialog = (username: string, action: 'approve' | 'reject', documentId: number) => {
    setReviewDocument({ username, documentId });
    setReviewAction(action);
    setReviewNotes('');
    
    // For approve, directly process without showing dialog
    if (action === 'approve') {
      handleDirectApproval(username, documentId);
    } else {
      // For reject, show dialog for review notes
      setReviewNotesDialogOpen(true);
    }
  };

  // Handle direct approval without review dialog
  const handleDirectApproval = async (username: string, documentId: number) => {
    try {
      setProcessingApproval(documentId);
      
      const reviewData = {
        reviewNotes: 'Document verified and approved',
        reviewedBy: currentUser
      };
      
      const response = await apiClient.post(`/api/admin/users/${username}/approve-kyc`, reviewData);
      
      // API returns { "message": "..." } with HTTP 200
      if (response.status === 200) {
        toast.success(response.data.message || `KYC approved for ${username}`);
        // Remove the approved document from the list
        setKycDocuments(prev => prev.filter(doc => doc.id !== documentId));
        setApprovalCounts(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approvedToday: prev.approvedToday + 1
        }));
      } else {
        toast.error('Failed to approve KYC');
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast.error('Failed to approve KYC');
    } finally {
      setProcessingApproval(null);
    }
  };

  // Handle approval/rejection (deprecated - keeping for compatibility)
  const handleApproval = async (username: string, action: 'approve' | 'reject', documentId: number) => {
    // Redirect to review dialog
    openReviewDialog(username, action, documentId);
  };

  // View document details
  const viewDocumentDetails = async (document: KYCDocument) => {
    setSelectedDocument(document);
    // Clean up previous object URLs
    if (documentImages) {
      if (documentImages.frontImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(documentImages.frontImageUrl);
      }
      if (documentImages.backImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(documentImages.backImageUrl);
      }
    }
    await fetchDocumentImages(document.id);
    setImageDialogOpen(true);
  };

  useEffect(() => {
    fetchKYCDocuments();
    setCurrentUser(getCurrentUser());
  }, []);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (documentImages) {
        if (documentImages.frontImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(documentImages.frontImageUrl);
        }
        if (documentImages.backImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(documentImages.backImageUrl);
        }
      }
    };
  }, [documentImages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600';
      case 'VERIFIED': return 'bg-green-100 dark:bg-green-900 text-green-600';
      case 'REJECTED': return 'bg-red-100 dark:bg-red-900 text-red-600';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-600';
    }
  };

  const getPriorityFromDate = (submittedAt: string) => {
    const submittedDate = new Date(submittedAt);
    const daysSinceSubmission = Math.floor((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceSubmission >= 3) return 'high';
    if (daysSinceSubmission >= 1) return 'medium';
    return 'low';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Document Approvals</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve pending KYC documents</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={fetchKYCDocuments}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            {/* <Button variant="outline" className="w-full sm:w-auto">
              <Clock className="w-4 h-4 mr-2" />
              View History
            </Button> */}
          </div>
        </div>

        {/* Summary Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-orange-600">{approvalCounts.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-600">{approvalCounts.highPriority}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">{approvalCounts.approvedToday}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved Today</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-gray-600">{approvalCounts.rejectedToday}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Today</p>
            </CardContent>
          </Card>
        </div> */}

        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Pending KYC Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading KYC documents...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {kycDocuments.map((document) => {
                  const priority = getPriorityFromDate(document.submittedAt);
                  const isProcessing = processingApproval === document.id;
                  
                  return (
                    <div key={document.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-full ${getStatusColor(document.status)}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                KYC Document Review
                              </h3>
                              <Badge 
                                variant={
                                  priority === 'high' ? 'destructive' :
                                  priority === 'medium' ? 'secondary' : 'outline'
                                }
                                className="text-xs"
                              >
                                {priority} priority
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              Identity verification for {document.fullName}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div>
                                <span className="font-medium">ID:</span> {document.id}
                              </div>
                              <div>
                                <span className="font-medium">Submitted:</span> {new Date(document.submittedAt).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Nationality:</span> {document.nationality}
                              </div>
                              <div>
                                <span className="font-medium">ID Number:</span> {document.idNumber}
                              </div>
                              <div className="md:col-span-2">
                                <span className="font-medium">Address:</span> {document.address}, {document.city}, {document.postalCode}, {document.country}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {document.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{document.fullName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{document.username}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDocumentDetails(document)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(document.username, 'reject', document.id)}
                            disabled={isProcessing}
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900"
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproval(document.username, 'approve', document.id)}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && kycDocuments.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No pending KYC documents</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">All documents have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Details Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Document Details</DialogTitle>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Full Name:</span> {selectedDocument.fullName}</div>
                      <div><span className="font-medium">Username:</span> {selectedDocument.username}</div>
                      <div><span className="font-medium">Date of Birth:</span> {selectedDocument.dateOfBirth}</div>
                      <div><span className="font-medium">Nationality:</span> {selectedDocument.nationality}</div>
                      <div><span className="font-medium">ID Number:</span> {selectedDocument.idNumber}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Address:</span> {selectedDocument.address}</div>
                      <div><span className="font-medium">City:</span> {selectedDocument.city}</div>
                      <div><span className="font-medium">Postal Code:</span> {selectedDocument.postalCode}</div>
                      <div><span className="font-medium">Country:</span> {selectedDocument.country}</div>
                      <div><span className="font-medium">Submitted:</span> {new Date(selectedDocument.submittedAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Document Images */}
                {loadingImages ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading document images...</p>
                  </div>
                ) : documentImages && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Document Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          ID Front
                        </h4>
                        <img 
                          src={documentImages.frontImageUrl} 
                          alt="ID Front" 
                          className="w-full h-48 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          ID Back
                        </h4>
                        <img 
                          src={documentImages.backImageUrl} 
                          alt="ID Back" 
                          className="w-full h-48 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Notes Dialog - Only for Rejection */}
        <Dialog open={reviewNotesDialogOpen} onOpenChange={setReviewNotesDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reject KYC Document</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                You are about to reject this KYC document. Please provide review notes explaining the reason for rejection.
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviewNotes">Review Notes <span className="text-red-500">*</span></Label>
                <Textarea
                  id="reviewNotes"
                  placeholder="Please provide reason for rejection..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Reviewed by:</span> {currentUser}
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setReviewNotesDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalWithNotes}
                  disabled={processingApproval !== null || !reviewNotes.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {processingApproval !== null ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminApprovals;
