import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Loader2, Upload } from "lucide-react";
import { ProfileAPI, ProfileUtils } from "@/lib/profileApi";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
  userInitials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  onAvatarChange,
  userInitials,
  size = 'md',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const handleFileUpload = async (file: File) => {
    const validation = ProfileUtils.validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const response = await ProfileAPI.uploadProfilePicture(file);
      
      if (response.success) {
        const avatarUrl = ProfileUtils.getAvatarUrl(response);
        if (avatarUrl) {
          onAvatarChange(avatarUrl);
          toast.success(response.message || "Profile picture updated successfully!");
          setUploadDialogOpen(false);
        } else {
          toast.error("Failed to get profile picture URL");
        }
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setIsUploading(true);
    try {
      const response = await ProfileAPI.deleteProfilePicture();
      
      if (response.message || response.success !== false) {
        onAvatarChange(null);
        toast.success(response.message || "Profile picture deleted successfully!");
        setUploadDialogOpen(false);
      } else {
        toast.error("Failed to delete profile picture");
      }
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} cursor-pointer border border-gray-200 dark:border-gray-200`}>
        <AvatarImage src={avatarUrl || "/placeholder.svg"} className="object-cover " />
        <AvatarFallback className="bg-purple-600 text-white text-xl">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      {/* Avatar upload controls */}
      <div className="absolute -bottom-2 -right-2 flex space-x-1">
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`${buttonSizeClasses[size]} p-0 bg-white shadow-sm`}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
              ) : (
                <Camera className={iconSizeClasses[size]} />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Profile Picture</DialogTitle>
              <DialogDescription>
                Choose a new profile picture. Only JPG, JPEG, and PNG files are supported.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Drag and drop area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your image here, or click to select
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mt-2"
                >
                  Select Image
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 5MB
                </p>
              </div>
              
              {/* Current avatar preview */}
              {avatarUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Current picture</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={isUploading}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
