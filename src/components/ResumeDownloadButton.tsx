import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Download, FileText } from 'lucide-react';

interface ResumeDownloadButtonProps {
  className?: string;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({ className = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Try different file extensions
      const possibleFiles = ['resume.pdf', 'resume.doc', 'resume.docx'];
      let downloadData = null;
      let fileName = '';
      let mimeType = '';

      for (const file of possibleFiles) {
        const { data, error } = await supabase.storage
          .from('resume')
          .download(file);

        if (!error && data) {
          downloadData = data;
          fileName = file;
          
          // Set appropriate MIME type
          if (file.endsWith('.pdf')) {
            mimeType = 'application/pdf';
          } else if (file.endsWith('.doc')) {
            mimeType = 'application/msword';
          } else if (file.endsWith('.docx')) {
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }
          break;
        }
      }

      if (!downloadData) {
        throw new Error('No resume file found. Please contact the site owner.');
      }

      // Create download link
      const blob = new Blob([downloadData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isDownloading}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 25px rgba(59, 74, 61, 0.4)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center gap-2 
        bg-olive/40 hover:bg-olive/50 text-off-white hover:text-neon
        border-2 border-olive/70 hover:border-neon/70
        rounded-full font-bold transition-all duration-300 group
        backdrop-blur-sm shadow-lg hover:shadow-olive/30
        ring-1 ring-olive/50 hover:ring-neon/50
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none disabled:shadow-none
        ${className}
      `}
    >
      {isDownloading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-neon border-t-transparent" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Download Resume</span>
          <motion.div
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </motion.div>
        </>
      )}
    </motion.button>
  );
};

export default ResumeDownloadButton;