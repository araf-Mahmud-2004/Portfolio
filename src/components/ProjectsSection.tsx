import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Filter,
  Globe,
  Code,
  Loader,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface ProjectsSectionProps {
  scrollY: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  type: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl?: string;
  featured: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ scrollY }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "personal" | "official"
  >("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } else if (data) {
        const mappedProjects = data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.type,
          techStack: p.tech_stack || [],
          liveUrl: p.live_url || "",
          githubUrl: p.github_url || "",
          imageUrl: p.image_url || undefined,
          featured: p.featured || false,
        }));
        setProjects(mappedProjects);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    activeFilter === "all" ? true : project.type === activeFilter
  );

  const filters = [
    { key: "all" as const, label: "All Projects", count: projects.length },
    {
      key: "personal" as const,
      label: "Personal",
      count: projects.filter((p) => p.type === "personal").length,
    },
    {
      key: "official" as const,
      label: "Official",
      count: projects.filter((p) => p.type === "official").length,
    },
  ];

  return (
    <section
      id="projects"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-charcoal to-olive/10 min-h-screen"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FCE300' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-4">
            Featured <span className="text-neon">Projects</span>
          </h2>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto mb-8">
            A collection of projects showcasing modern web development with live
            previews
          </p>

          {/* Filter Buttons */}
          {!loading && !error && (
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? "bg-neon text-charcoal shadow-lg shadow-neon/25"
                      : "bg-olive/20 text-light-gray hover:bg-olive/30 border border-olive/30"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {filter.label}
                  <span className="bg-charcoal/30 px-2 py-1 rounded-full text-xs">
                    {filter.count}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-neon animate-spin" />
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500 bg-red-500/10 border border-red-500/30 px-6 py-4 rounded-lg">
              {error}
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className={`rounded-2xl overflow-hidden bg-charcoal/50 border backdrop-blur-sm transition-all duration-500 ${
                    project.featured
                      ? "border-neon/30 shadow-lg shadow-neon/10"
                      : "border-olive/30"
                  } ${
                    hoveredProject === project.id
                      ? "scale-[1.02] shadow-2xl shadow-neon/20"
                      : ""
                  }`}
                >
                  {/* Project Preview */}
                  <div className="relative h-64 bg-gradient-to-br from-olive/20 to-charcoal/80 overflow-hidden group">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive/30 to-charcoal/60">
                        <div className="text-center">
                          <Code className="w-16 h-16 text-neon/50 mx-auto mb-4" />
                          <p className="text-muted-gray text-sm">
                            No image uploaded
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 bg-charcoal/80 backdrop-blur-sm px-3 py-2 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-light-gray">
                          Live Preview
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          project.type === "official"
                            ? "bg-neon/20 text-neon border border-neon/30"
                            : "bg-olive/20 text-light-gray border border-olive/30"
                        }`}
                      >
                        {project.type}
                      </span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredProject === project.id ? 1 : 0,
                      }}
                      className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center gap-4"
                    >
                      {project.liveUrl && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{
                            scale: hoveredProject === project.id ? 1 : 0,
                          }}
                          onClick={() => window.open(project.liveUrl, "_blank")}
                          className="bg-neon text-charcoal px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                          View Live Site
                        </motion.button>
                      )}
                    </motion.div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-off-white group-hover:text-neon transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <div className="flex items-center gap-1 text-neon">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            ⭐
                          </motion.div>
                          <span className="text-xs font-medium">Featured</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-gray mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-olive/20 text-light-gray rounded-full text-sm border border-olive/30 hover:border-neon/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(project.liveUrl, "_blank")}
                          className="flex-1 bg-neon text-charcoal py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </motion.button>
                      )}
                      {project.githubUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            window.open(project.githubUrl, "_blank")
                          }
                          className="px-4 py-3 bg-olive/20 text-light-gray rounded-lg border border-olive/30 hover:border-neon/30 hover:text-neon transition-all"
                        >
                          <Github className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              window.open("https://github.com/araf-Mahmud-2004", "_blank")
            }
            className="bg-olive/20 text-light-gray px-8 py-4 rounded-full font-bold border border-olive/30 hover:border-neon/30 hover:text-neon transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Code className="w-5 h-5" />
            View All Projects on GitHub
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
