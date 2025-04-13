import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProofUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => 
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf']}
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all 
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-primary/30'}`}
      >
        <input {...getInputProps()} />
        <DocumentIcon className="h-12 w-12 text-primary mx-auto mb-4" />
        <p className="text-gray-600">
          {isDragActive ? 'Drop files here' : 'Drag & drop proofs, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">PNG, JPG, PDF (max 5 files)</p>
      </div>

      {files.length > 0 && (
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="space-y-4"
        >
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-primary/5 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-5 w-5 text-primary" />
                <span className="text-sm">{file.name}</span>
              </div>
              <button
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="pt-4">
            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {uploadProgress === 100 ? 'Upload Complete!' : 'Uploading...'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProofUploader;