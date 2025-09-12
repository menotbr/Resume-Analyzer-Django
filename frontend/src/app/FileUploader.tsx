import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, X, Check, Shield, Zap, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxFileSize = 20 * 1024 * 1024; // 20MB

    // Enhanced upload simulation with realistic progress
    const simulateUpload = useCallback((file: File) => {
        setError(null);
        setIsUploading(true);
        setUploadProgress(0);
        
        const fileSize = file.size;
        const duration = Math.max(1500, Math.min(4000, fileSize / 1000)); // Dynamic duration based on file size
        const intervals = 50;
        const incrementTime = duration / intervals;
        
        let currentProgress = 0;
        const timer = setInterval(() => {
            // Realistic progress curve - starts fast, slows down, then finishes
            const remaining = 100 - currentProgress;
            const increment = remaining > 20 ? 
                (Math.random() * 3 + 1.5) : // Fast initial progress
                (Math.random() * 1 + 0.5);  // Slower final progress
            
            currentProgress = Math.min(currentProgress + increment, 100);
            setUploadProgress(currentProgress);
            
            if (currentProgress >= 100) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsUploading(false);
                    setSelectedFile(file);
                    setShowSuccess(true);
                    onFileSelect?.(file);
                    
                    // Hide success message after 3 seconds
                    setTimeout(() => setShowSuccess(false), 3000);
                }, 500);
            }
        }, incrementTime);
    }, [onFileSelect]);

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are allowed';
        }
        if (file.size > maxFileSize) {
            return `File size must be less than ${formatSize(maxFileSize)}`;
        }
        return null;
    };

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
        setError(null);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const file = files[0];

        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            simulateUpload(file);
        }
    }, [simulateUpload]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            simulateUpload(file);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [simulateUpload]);

    const removeFile = useCallback(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setShowSuccess(false);
        setError(null);
        onFileSelect?.(null);
    }, [onFileSelect]);

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // Auto-hide error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* Error notification */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Success notification */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-700 font-medium">File uploaded successfully!</p>
                </div>
            )}

            {/* Main upload area */}
            <div 
                className={`
                    relative overflow-hidden border-2 border-dashed rounded-3xl p-8 
                    transition-all duration-300 ease-out cursor-pointer group
                    ${dragActive 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 scale-[1.02] shadow-xl shadow-blue-500/10' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-50'
                    }
                    ${isUploading ? 'pointer-events-none border-blue-400 bg-blue-50' : ''}
                    ${error ? 'border-red-300 bg-red-50' : ''}
                    ${showSuccess ? 'border-green-300 bg-green-50' : ''}
                `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={!selectedFile && !isUploading ? triggerFileSelect : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                />
                
                {/* Enhanced animated background */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-tl from-cyan-400 via-blue-400 to-indigo-400 animate-pulse delay-1000"></div>
                </div>

                <div className="relative space-y-8">
                    {isUploading ? (
                        <div className="text-center space-y-6">
                            {/* Enhanced upload animation */}
                            <div className="mx-auto w-24 h-24 relative">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                <div 
                                    className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                                    style={{
                                        background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)',
                                        borderRadius: '50%',
                                        mask: 'radial-gradient(circle at center, transparent 70%, black 71%)',
                                    }}
                                ></div>
                                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <Upload className="w-8 h-8 text-blue-500 animate-bounce" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xl font-bold text-gray-800 mb-2">Processing your file...</p>
                                    <p className="text-gray-600">Hang tight, we're almost done!</p>
                                </div>
                                
                                <div className="w-full max-w-sm mx-auto space-y-3">
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div 
                                            className="h-3 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 relative overflow-hidden"
                                            style={{ width: `${uploadProgress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{Math.round(uploadProgress)}% complete</span>
                                        <span className="text-gray-500 font-mono">{selectedFile?.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : selectedFile ? (
                        <div 
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                {/* Enhanced PDF icon with glow effect */}
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative group">
                                    <FileText className="w-8 h-8 text-white" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                </div>
                                
                                {/* Enhanced file info */}
                                <div className="flex-1 ml-6 space-y-2">
                                    <p className="text-lg font-bold text-gray-800 truncate max-w-md">
                                        {selectedFile.name}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                                            {formatSize(selectedFile.size)}
                                        </span>
                                        <span className="flex items-center gap-2 text-green-600 font-semibold">
                                            <Check className="w-4 h-4" />
                                            Successfully uploaded
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Enhanced remove button */}
                                <button 
                                    className="group p-3 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200"
                                    onClick={removeFile}
                                    type="button"
                                >
                                    <X className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8">
                            {/* Enhanced upload icon with multiple animations */}
                            <div className="mx-auto w-32 h-32 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                    <Upload className="w-16 h-16 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                                </div>
                                {dragActive && (
                                    <>
                                        <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-ping"></div>
                                        <div className="absolute inset-2 border-2 border-blue-400 rounded-full animate-pulse"></div>
                                    </>
                                )}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse"></div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Drop your PDF here, or{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 underline decoration-2 underline-offset-4 decoration-blue-400">
                                            browse files
                                        </span>
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        Support for PDF files up to{' '}
                                        <span className="font-bold text-gray-800 bg-yellow-100 px-2 py-1 rounded-lg">
                                            {formatSize(maxFileSize)}
                                        </span>
                                    </p>
                                </div>

                                {/* Enhanced feature badges */}
                                <div className="flex flex-wrap justify-center gap-4 pt-6">
                                    <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                                        <Shield className="w-4 h-4" />
                                        Secure & Private
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                                        <Zap className="w-4 h-4" />
                                        Lightning Fast
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced drag overlay */}
                {dragActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-bold text-blue-700">Drop it like it's hot! 🔥</p>
                                <p className="text-blue-600">We're ready to catch your file</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer info */}
            <div className="text-center text-sm text-gray-500 space-y-2">
                <p>Drag and drop or click to upload • PDF files only • Max {formatSize(maxFileSize)}</p>
                <p className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Your files are processed securely and never stored permanently
                </p>
            </div>
        </div>
    );
};

export default FileUploader;