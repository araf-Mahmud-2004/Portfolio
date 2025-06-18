import React from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  isLoading?: boolean;
  isLoaded?: boolean;
  priority?: 'high' | 'low' | 'auto';
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  containerClassName?: string;
  imageClassName?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  isLoading = false,
  isLoaded = false,
  priority = 'auto',
  loadingComponent,
  errorComponent,
  containerClassName = '',
  imageClassName = '',
  onImageLoad,
  onImageError,
  ...imgProps
}) => {
  const defaultLoadingComponent = (
    <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full"
      />
    </div>
  );

  const defaultErrorComponent = (
    <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center z-10">
      <div className="text-center text-muted-gray">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-sm">Image not available</div>
      </div>
    </div>
  );

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Loading state */}
      {isLoading && !isLoaded && (loadingComponent || defaultLoadingComponent)}
      
      {/* Optimized image */}
      <motion.img
        src={src}
        alt={alt}
        className={`transition-all duration-500 ${imageClassName}`}
        initial={{ opacity: isLoaded ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: isLoaded ? 0 : 0.5 }}
        loading={priority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: 'auto 400px' // Adjust based on your needs
        }}
        onLoad={() => {
          onImageLoad?.();
        }}
        onError={() => {
          onImageError?.();
        }}
        {...imgProps}
      />
    </div>
  );
};

export default OptimizedImage;