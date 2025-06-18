import { useState, useEffect, useCallback } from 'react';

interface UseOptimizedImageOptions {
  fallbackSrc: string;
  preload?: boolean;
  priority?: 'high' | 'low' | 'auto';
}

interface UseOptimizedImageReturn {
  src: string;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  retry: () => void;
}

export const useOptimizedImage = (
  initialSrc: string | null,
  options: UseOptimizedImageOptions
): UseOptimizedImageReturn => {
  const { fallbackSrc, preload = true, priority = 'high' } = options;
  
  const [src, setSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((imageSrc: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Set priority for better loading performance
      if (priority === 'high') {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
        resolve();
      };
      
      img.onerror = () => {
        setError(`Failed to load image: ${imageSrc}`);
        reject(new Error(`Failed to load image: ${imageSrc}`));
      };
      
      img.src = imageSrc;
    });
  }, [priority]);

  const retry = useCallback(() => {
    if (initialSrc) {
      setIsLoading(true);
      setError(null);
      loadImage(initialSrc)
        .then(() => setSrc(initialSrc))
        .catch(() => {
          setSrc(fallbackSrc);
          setIsLoading(false);
        });
    }
  }, [initialSrc, fallbackSrc, loadImage]);

  useEffect(() => {
    // Preload fallback image first
    if (preload) {
      loadImage(fallbackSrc)
        .then(() => {
          setIsLoaded(true);
          if (!initialSrc) {
            setIsLoading(false);
          }
        })
        .catch(() => {
          console.error('Failed to load fallback image');
          setIsLoading(false);
        });
    }

    // Load the main image if provided
    if (initialSrc && initialSrc !== fallbackSrc) {
      loadImage(initialSrc)
        .then(() => {
          setSrc(initialSrc);
        })
        .catch(() => {
          console.error('Failed to load main image, using fallback');
          setSrc(fallbackSrc);
          setIsLoading(false);
        });
    } else if (!initialSrc) {
      setIsLoading(false);
    }
  }, [initialSrc, fallbackSrc, loadImage, preload]);

  return {
    src,
    isLoading,
    isLoaded,
    error,
    retry
  };
};