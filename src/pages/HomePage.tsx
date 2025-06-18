import React, { Suspense, lazy } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ParallaxBackground from '../components/ParallaxBackground';
import { useScroll } from '../contexts/ScrollContext';
import ErrorBoundary from '../components/ErrorBoundary';
import LazySection from '../components/LazySection';

// Lazy load non-critical sections
const SkillsSection = lazy(() => import('../components/SkillsSection'));
const ProjectsSection = lazy(() => import('../components/ProjectsSection'));
const ContactSection = lazy(() => import('../components/ContactSection'));

// Loading fallback component
const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-neon border-t-transparent"></div>
  </div>
);

const HomePage: React.FC = () => {
  const { scrollY } = useScroll();

  return (
    <div className="bg-charcoal text-off-white overflow-x-hidden">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neon text-charcoal px-4 py-2 rounded-md font-bold z-50"
      >
        Skip to main content
      </a>
      
      <ErrorBoundary>
        <ParallaxBackground scrollY={scrollY} />
        <Navigation />
        <main id="main-content">
          {/* Hero section loads immediately */}
          <HeroSection scrollY={scrollY} />
          
          {/* Lazy load other sections */}
          <LazySection
            threshold={0.1}
            rootMargin="100px"
            fallback={<SectionFallback />}
          >
            <Suspense fallback={<SectionFallback />}>
              <SkillsSection scrollY={scrollY} />
            </Suspense>
          </LazySection>

          <LazySection
            threshold={0.1}
            rootMargin="100px"
            fallback={<SectionFallback />}
          >
            <Suspense fallback={<SectionFallback />}>
              <ProjectsSection scrollY={scrollY} />
            </Suspense>
          </LazySection>

          <LazySection
            threshold={0.1}
            rootMargin="100px"
            fallback={<SectionFallback />}
          >
            <Suspense fallback={<SectionFallback />}>
              <ContactSection scrollY={scrollY} />
            </Suspense>
          </LazySection>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;