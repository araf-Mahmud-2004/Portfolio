import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ContactSection from '../components/ContactSection';
import ParallaxBackground from '../components/ParallaxBackground';
import { useScroll } from '../contexts/ScrollContext';
import ErrorBoundary from '../components/ErrorBoundary';

const HomePage: React.FC = () => {
  const { scrollY } = useScroll();

  return (
    <div className="bg-charcoal text-off-white overflow-x-hidden">
      <ErrorBoundary>
        <ParallaxBackground scrollY={scrollY} />
        <Navigation />
        <main>
          <HeroSection scrollY={scrollY} />
          <SkillsSection scrollY={scrollY} />
          <ProjectsSection scrollY={scrollY} />
          <ContactSection scrollY={scrollY} />
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;