import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import profilePhoto from '../assets/WhatsApp Image 2025-06-09 at 00.21.22_859df333.jpg';

interface HeroSectionProps {
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollY }) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageToShow, setImageToShow] = useState<string>('');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_picture_url')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile picture for hero section:', error);
          setImageToShow(profilePhoto);
        } else if (data && data.profile_picture_url) {
          setProfilePictureUrl(data.profile_picture_url);
          setImageToShow(data.profile_picture_url);
        } else {
          setImageToShow(profilePhoto);
        }
      } catch (err) {
        console.error('Error fetching profile picture:', err);
        setImageToShow(profilePhoto);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfilePicture();

    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const newProfile = payload.new as { profile_picture_url: string };
          if (newProfile.profile_picture_url) {
            setProfilePictureUrl(currentUrl => {
              if (newProfile.profile_picture_url !== currentUrl) {
                setImageToShow(newProfile.profile_picture_url);
                return newProfile.profile_picture_url;
              }
              return currentUrl;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Memoize background elements for better performance
  const backgroundElements = useMemo(() => ({
    codeSymbols: Array.from({ length: 6 }, (_, i) => ({
      left: 10 + i * 15,
      top: 20 + (i % 3) * 25,
      symbol: ['<>', '{}', '[]', '/>', '=>', '&&'][i],
      duration: 4 + i * 0.5
    })),
    orbs: Array.from({ length: 4 }, (_, i) => ({
      left: 15 + i * 20,
      top: 30 + (i % 2) * 40,
      duration: 3 + i * 0.7
    }))
  }), []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Optimized Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Code Symbols */}
        {backgroundElements.codeSymbols.map((element, i) => (
          <motion.div
            key={`code-${i}`}
            className="absolute text-neon/10 text-4xl font-mono"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              transform: `translateY(${scrollY * (0.05 + i * 0.01)}px)`,
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {element.symbol}
          </motion.div>
        ))}

        {/* Glowing Orbs */}
        {backgroundElements.orbs.map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-4 h-4 bg-neon/20 rounded-full blur-sm"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              transform: `translateY(${scrollY * (0.1 + i * 0.02)}px)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-32">
        {/* Profile Photo with 3D Effect */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="relative inline-block"
        >
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-neon/20 to-olive/40 p-1 shadow-2xl relative overflow-hidden">
            <motion.div 
              className="w-full h-full rounded-full overflow-hidden border-4 border-charcoal relative"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(252, 227, 0, 0.3)",
                  "0 0 50px rgba(252, 227, 0, 0.5)",
                  "0 0 30px rgba(252, 227, 0, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Loading placeholder */}
              {isLoading && (
                <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full"
                  />
                </div>
              )}
              
              {/* Profile Image */}
              {imageToShow && (
                <motion.img 
                  key={imageToShow}
                  src={imageToShow} 
                  alt="Profile Photo" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    console.error('Failed to load profile image, using fallback');
                    setImageToShow(profilePhoto);
                  }}
                />
              )}
            </motion.div>
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-neon rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-charcoal" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col items-start max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="text-5xl md:text-7xl font-bold mb-4 relative inline-block text-neon"
            style={{
              transform: `translateY(${scrollY * -0.05}px)`,
              textShadow: '0 0 8px rgba(252, 227, 0, 0.5)'
            }}
          >
            Araf
            <motion.span
              className="text-neon"
              animate={{ 
                textShadow: [
                  "0 0 20px #FCE300", 
                  "0 0 40px #FCE300", 
                  "0 0 20px #FCE300"
                ] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              .
            </motion.span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut"
            }}
            className="text-xl md:text-2xl font-light mb-6 text-muted-gray relative inline-block"
            style={{
              transform: `translateY(${scrollY * -0.03}px)`
            }}
          >
            Mahmud
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: "easeOut"
            }}
            className="text-lg md:text-xl mb-8 text-light-gray max-w-2xl leading-relaxed relative inline-block"
            style={{
              transform: `translateY(${scrollY * -0.02}px)`
            }}
          >
            Frontend Developer crafting immersive digital experiences with 
            <span className="text-neon font-semibold"> React</span>, 
            <span className="text-neon font-semibold"> TypeScript</span>, and 
            <span className="text-neon font-semibold"> Modern Web Technologies</span>
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 25px rgba(252, 227, 0, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-neon to-neon/70 text-charcoal px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-300 group shadow-lg hover:shadow-neon/40"
          >
            View My Work
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </motion.div>
          </motion.button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-neon/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-neon rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;