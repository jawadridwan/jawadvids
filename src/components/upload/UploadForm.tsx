import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface UploadFormProps {
  onUploadComplete: (videoData: any) => void;
  onClose: () => void;
}

export const UploadForm = ({ onUploadComplete, onClose }: UploadFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hashtags: "",
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleFileSelect(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      title: file.name.split('.')[0],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const simulateUpload = () => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your video",
        variant: "destructive",
      });
      return;
    }

    simulateUpload();

    const videoUrl = URL.createObjectURL(selectedFile);
    const videoData = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      hashtags: formData.hashtags.split(' ').filter(tag => tag.startsWith('#')),
      views: "0",
      thumbnail: videoUrl,
      file: selectedFile,
      uploadDate: new Date().toISOString(),
      status: 'processing',
    };

    setTimeout(() => {
      onUploadComplete(videoData);
      setFormData({
        title: "",
        description: "",
        hashtags: "",
      });
      setSelectedFile(null);
      setUploadProgress(0);
      onClose();
      
      toast({
        title: "Success",
        description: "Your video has been uploaded successfully",
      });
    }, 5000);
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    toast({
      title: "Upload cancelled",
      description: "Your video upload has been cancelled",
    });
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <div className="text-lg font-medium mb-2">
            Drag and drop your video here
          </div>
          <div className="text-sm text-gray-500 mb-4">
            or
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Uploading: {selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelUpload}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description"
                className="h-32"
                maxLength={5000}
              />
            </div>

            <div>
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                placeholder="#youtube #video"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  );
};