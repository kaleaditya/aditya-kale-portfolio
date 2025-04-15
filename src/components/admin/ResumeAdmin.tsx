
import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, Trash2, Save, Loader2 } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { useResumes, Resume } from '@/hooks/useResumes';

const ResumeAdmin = () => {
  const { resumes, loading, error, uploadProgress, fetchResumes, uploadResume, setActiveResume, deleteResume } = useResumes();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await uploadResume(file);
    
    // Clear the input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVisibilityChange = async (resume: Resume) => {
    await setActiveResume(resume.id);
  };

  const handleDeleteClick = (resume: Resume) => {
    setCurrentResume(resume);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteResume = async () => {
    if (currentResume) {
      const success = await deleteResume(currentResume.id, currentResume.file_path);
      if (success) {
        setIsDeleteDialogOpen(false);
        setCurrentResume(null);
      }
    }
  };

  const activeResume = resumes.find(r => r.is_active);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resume</h1>
        <Button onClick={fetchResumes} className="flex items-center gap-2" variant="outline">
          <Save size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-6">Upload Your Resume</h2>

        {loading && uploadProgress > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Uploading resume... {uploadProgress}%</p>
            <Progress value={uploadProgress} />
          </div>
        )}

        {loading && uploadProgress === 0 && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
            <p>Error: {error}</p>
            <Button variant="outline" onClick={fetchResumes} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {!loading && resumes.length > 0 ? (
          <div className="space-y-6">
            {resumes.map(resume => (
              <div key={resume.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-md">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{resume.file_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={resume.file_path} download={resume.file_name} className="flex items-center gap-1">
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(resume)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <h3 className="font-medium">Public Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  {activeResume 
                    ? 'Your resume is visible on your portfolio' 
                    : 'Your resume is hidden from your portfolio'}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <select 
                  className="bg-background border border-input px-3 py-2 rounded-md"
                  value={activeResume?.id || ''}
                  onChange={(e) => {
                    const resumeId = e.target.value;
                    if (resumeId) {
                      const resume = resumes.find(r => r.id === resumeId);
                      if (resume) handleVisibilityChange(resume);
                    }
                  }}
                  disabled={loading || resumes.length === 0}
                >
                  <option value="">None (Hidden)</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>
                      {resume.file_name}
                    </option>
                  ))}
                </select>
                <Switch 
                  checked={!!activeResume}
                  onCheckedChange={(checked) => {
                    if (checked && resumes.length > 0) {
                      handleVisibilityChange(resumes[0]);
                    } else if (!checked && activeResume) {
                      setActiveResume('');
                    }
                  }}
                  disabled={loading || resumes.length === 0}
                />
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg">
              <h3 className="font-medium mb-3">Upload New Resume</h3>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                  disabled={loading}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="whitespace-nowrap"
                  disabled={loading}
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
                disabled={loading}
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Resume
                  </>
                )}
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
            Are you sure you want to delete your resume "{currentResume?.file_name}"? This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteResume}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeAdmin;
