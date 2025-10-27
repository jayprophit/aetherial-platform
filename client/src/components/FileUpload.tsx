import { useState, useRef } from 'react';
import { Upload, X, Image, File, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}

export default function FileUpload({
  onUpload,
  multiple = false,
  accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx',
  maxSize = 10,
  maxFiles = 10
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Validate file count
    if (multiple && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const maxSizeBytes = maxSize * 1024 * 1024;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSizeBytes) {
        setError(`File ${files[i].name} exceeds ${maxSize}MB limit`);
        return;
      }
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      if (multiple) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      } else {
        formData.append('file', files[0]);
      }

      const endpoint = multiple ? '/api/upload/multiple' : '/api/upload/single';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      const newFiles = multiple ? data.files : [data.file];
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUpload(newFiles);
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = async (filename: string) => {
    try {
      const response = await fetch(`/api/upload/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(f => f.filename !== filename));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (mimetype: string) => mimetype.startsWith('image/');

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-slate-400" />
            <div>
              <p className="text-slate-700 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {multiple ? `Up to ${maxFiles} files, ` : ''}Max {maxSize}MB per file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.filename}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                {isImage(file.mimetype) ? (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                    <File className="w-6 h-6 text-slate-600" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.filename);
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

