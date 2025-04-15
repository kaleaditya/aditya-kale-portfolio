
import React, { useState } from 'react';
import { Upload, Download, FileText, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResumeData {
  fileName: string;
  url: string;
  uploadDate: string;
  isPublic: boolean;
}

const ResumeAdmin = () => {
  const [resume, setResume] = useState<ResumeData | null>({
    fileName: 'john_doe_resume.pdf',
    url: '/sample-resume.pdf',
    uploadDate: '2023-10-15',
    isPublic: true
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you'd upload the file to a server or storage service
    // For demo purposes, we'll just create a local URL
    const newResume: ResumeData = {
      fileName: file.name,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString().split('T')[0],
      isPublic: true
    };
    
    setResume(newResume);
    toast({
      title: "Resume Uploaded",
      description: `${file.name} has been uploaded successfully.`
    });

    // Clear the input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    if (resume) {
      setResume({...resume, isPublic});
      toast({
        title: `Resume ${isPublic ? 'Published' : 'Hidden'}`,
        description: `Your resume is now ${isPublic ? 'visible to the public' : 'hidden from the public'}.`
      });
    }
  };

  const handleDeleteResume = () => {
    setResume(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Resume Deleted",
      description: "Your resume has been removed.",
      variant: "destructive"
    });
  };

  const saveChanges = () => {
    console.log('Saving resume data:', resume);
    toast({
      title: "Changes saved",
      description: "Your resume settings have been updated successfully"
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resume</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2">
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-6">Upload Your Resume</h2>

        {resume ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-md">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{resume.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={resume.url} download={resume.fileName} className="flex items-center gap-1">
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <h3 className="font-medium">Public Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  {resume.isPublic 
                    ? 'Your resume is visible on your portfolio' 
                    : 'Your resume is hidden from your portfolio'}
                </p>
              </div>
              <Switch checked={resume.isPublic} onCheckedChange={handleVisibilityChange} />
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg">
              <h3 className="font-medium mb-3">Replace Resume</h3>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="whitespace-nowrap"
                >
                  <Upload size={14} className="mr-2" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Allowed formats: PDF, DOC, DOCX. Max file size: 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-lg bg-secondary/30">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resume uploaded</h3>
            <p className="text-muted-foreground text-center mb-6">
              Upload your resume to make it available on your portfolio
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} className="mr-2" />
                Upload Resume
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p className="text-muted-foreground">
            Are you sure you want to delete your resume? This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteResume}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeAdmin;
