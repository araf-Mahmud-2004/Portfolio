import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Palette, 
  Database, 
  Zap, 
  Layers, 
  Globe,
  Terminal,
  Star,
  Award,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SkillsSectionProps {
  scrollY: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  created_at?: string;
  updated_at?: string;
}

const skillCategories = [
  {
    title: "Frontend Development",
    icon: Code2,
    color: "text-neon",
    bgColor: "from-neon/10 to-neon/5",
    borderColor: "border-neon/30",
    description: "Building responsive, interactive user interfaces"
  },
  {
    title: "Styling & Design",
    icon: Palette,
    color: "text-olive",
    bgColor: "from-olive/10 to-olive/5",
    borderColor: "border-olive/30",
    description: "Creating beautiful, accessible designs"
  },
  {
    title: "Backend & Database",
    icon: Database,
    color: "text-light-gray",
    bgColor: "from-light-gray/10 to-light-gray/5",
    borderColor: "border-light-gray/30",
    description: "Full-stack development with modern tools"
  },
  {
    title: "Development Tools",
    icon: Terminal,
    color: "text-muted-gray",
    bgColor: "from-muted-gray/10 to-muted-gray/5",
    borderColor: "border-muted-gray/30",
    description: "Professional development workflow"
  }
];

const SkillsSection: React.FC<SkillsSectionProps> = ({ scrollY }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Fetch skills from Supabase
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setSkills(data || []);
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        setError(err.message || 'Failed to load skills');
        
        // Fallback to some default skills if fetch fails
        setSkills([
          { id: '1', name: 'React', category: 'Frontend Development', proficiency: 90 },
          { id: '2', name: 'TypeScript', category: 'Frontend Development', proficiency: 85 },
          { id: '3', name: 'Tailwind CSS', category: 'Styling & Design', proficiency: 88 },
          { id: '4', name: 'Supabase', category: 'Backend & Database', proficiency: 80 },
          { id: '5', name: 'Git', category: 'Development Tools', proficiency: 90 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Memoize background particles to prevent re-renders
  const backgroundParticles = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.4,
      duration: 6 + i * 0.5
    })), []
  );

  const getSkillsByCategory = (categoryTitle: string) => {
    return skills.filter(skill => skill.category === categoryTitle);
  };

  const getProficiencyLevel = (proficiency: number): string => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 50) return 'Intermediate';
    return 'Learning';
  };

  const getLevelIcon = (proficiency: number) => {
    const level = getProficiencyLevel(proficiency);
    switch (level) {
      case 'Expert':
        return <Star className="w-4 h-4 text-neon fill-current" />;
      case 'Advanced':
        return <Award className="w-4 h-4 text-olive fill-current" />;
      case 'Intermediate':
        return <CheckCircle className="w-4 h-4 text-light-gray fill-current" />;
      case 'Learning':
        return <Zap className="w-4 h-4 text-muted-gray" />;
      default:
        return <CheckCircle className="w-4 h-4 text-muted-gray" />;
    }
  };

  const getLevelColor = (proficiency: number) => {
    const level = getProficiencyLevel(proficiency);
    switch (level) {
      case 'Expert':
        return 'text-neon bg-neon/10 border-neon/30';
      case 'Advanced':
        return 'text-olive bg-olive/10 border-olive/30';
      case 'Intermediate':
        return 'text-light-gray bg-light-gray/10 border-light-gray/30';
      case 'Learning':
        return 'text-muted-gray bg-muted-gray/10 border-muted-gray/30';
      default:
        return 'text-muted-gray bg-muted-gray/10 border-muted-gray/30';
    }
  };

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-charcoal/50">
      {/* Simplified Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FCE300' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          transform: `translateY(${scrollY * 0.05}px)`,
          willChange: 'transform'
        }}
      />

      {/* Optimized floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={`skill-particle-${particle.id}`}
            className="absolute w-2 h-2 bg-neon/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-4">
            Technical <span className="text-neon">Arsenal</span>
          </h2>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <motion.div 
                className="w-12 h-12 border-t-2 border-neon rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-muted-gray">Loading skills...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-400 mb-2">Failed to load skills from database</p>
            <p className="text-red-300/80 text-sm">Showing fallback skills</p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => {
            const categorySkills = getSkillsByCategory(category.title);
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className={`bg-olive/20 rounded-2xl p-8 border ${category.borderColor} backdrop-blur-sm hover:border-neon/30 transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <motion.div 
                    className={`p-3 rounded-xl bg-charcoal/50 group-hover:scale-105 transition-transform duration-300`}
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <category.icon className={`w-8 h-8 ${category.color}`} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-off-white group-hover:text-neon transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-gray text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-3 relative z-10">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (skillIndex * 0.05) }}
                      viewport={{ once: true }}
                      onHoverStart={() => setHoveredSkill(skill.id)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      className="group/skill cursor-pointer"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal/30 hover:bg-charcoal/50 transition-all duration-300 border border-transparent hover:border-neon/20">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-2 h-2 bg-neon rounded-full"
                            animate={{
                              scale: hoveredSkill === skill.id ? [1, 1.3, 1] : [1, 1.1, 1],
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="text-light-gray group-hover/skill:text-off-white transition-colors duration-200 font-medium">
                            {skill.name}
                          </span>
                        </div>
                        
                        <motion.div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getLevelColor(skill.proficiency)}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getLevelIcon(skill.proficiency)}
                          <span>{getProficiencyLevel(skill.proficiency)}</span>
                          <span className="text-xs opacity-75">({skill.proficiency}%)</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;