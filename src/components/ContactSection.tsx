import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  MapPin,
  Coffee,
  Github,
  Linkedin,
  Twitter,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useSocialLinks } from "../hooks/useSocialLinks";

interface ContactSectionProps {
  scrollY: number;
}

const ContactSection: React.FC<ContactSectionProps> = ({ scrollY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const { socialLinks, loading: socialLoading } = useSocialLinks();

  const myEmail = "arafmahmud028@gmail.com";

  const handleGmailClick = () => {
    const subject = encodeURIComponent("Hello from your portfolio!");
    const body = encodeURIComponent(`Hi Araf,

I came across your portfolio and would like to connect with you.

Best regards`);

    // Use Gmail compose URL without specifying account (u/0) to trigger account selection
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${myEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const handleSimpleEmailClick = () => {
    const mailtoLink = `mailto:${myEmail}`;
    window.location.href = mailtoLink;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(myEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Email address copied to clipboard';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = myEmail;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  // Get icon for social platform
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'whatsapp':
        return MessageCircle;
      default:
        return Mail;
    }
  };

  // Get color for social platform
  const getSocialColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return "hover:text-gray-400";
      case 'linkedin':
        return "hover:text-blue-400";
      case 'twitter':
        return "hover:text-sky-400";
      case 'whatsapp':
        return "hover:text-green-400";
      default:
        return "hover:text-neon";
    }
  };

  // Get description for social platform
  const getSocialDescription = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return "View my code repositories and open source contributions";
      case 'linkedin':
        return "Connect with me on LinkedIn for professional networking";
      case 'twitter':
        return "Follow me on Twitter for tech updates and insights";
      case 'whatsapp':
        return "Send me a message on WhatsApp for quick communication";
      default:
        return "Connect with me on this platform";
    }
  };

  // Fallback social links if database is empty or loading
  const fallbackSocialLinks = [
    {
      id: 'github-fallback',
      platform: 'github',
      url: 'https://github.com/araf-Mahmud-2004',
      is_active: true,
      display_order: 1
    },
    {
      id: 'linkedin-fallback',
      platform: 'linkedin',
      url: '#',
      is_active: true,
      display_order: 2
    },
    {
      id: 'twitter-fallback',
      platform: 'twitter',
      url: '.',
      is_active: true,
      display_order: 3
    },
    {
      id: 'whatsapp-fallback',
      platform: 'whatsapp',
      url: 'https://wa.me/1234567890',
      is_active: true,
      display_order: 4
    }
  ];

  const displaySocialLinks = socialLinks.length > 0 ? socialLinks.filter(link => link.is_active) : fallbackSocialLinks;

  // Memoize background elements to prevent re-renders
  const backgroundElements = useMemo(
    () => ({
      circles: Array.from({ length: 4 }, (_, i) => ({
        left: 15 + i * 20,
        top: 25 + (i % 2) * 35,
        duration: 15 + i * 3,
      })),
      codeElements: Array.from({ length: 5 }, (_, i) => ({
        left: 8 + i * 18,
        top: 15 + (i % 2) * 40,
        text: [
          'console.log("hello");',
          "const connect = true;",
          "function collaborate() {}",
          "return success;",
          "let's code!",
        ][i],
        delay: i * 1.5,
      })),
    }),
    []
  );

  return (
    <section
      id="contact"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-olive/5 to-charcoal"
      aria-label="Contact section - Get in touch with Araf Mahmud"
    >
      {/* Optimized Background Elements */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Simplified Floating Circles */}
        {backgroundElements.circles.map((circle, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute w-24 h-24 border border-neon/10 rounded-full"
            style={{
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              transform: `translateY(${scrollY * (0.01 + i * 0.005)}px)`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: circle.duration,
                repeat: Infinity,
                ease: "linear",
              },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Optimized Code Rain Effect */}
        {backgroundElements.codeElements.map((element, i) => (
          <motion.div
            key={`code-rain-${i}`}
            className="absolute text-neon/5 font-mono text-sm"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
            }}
            animate={{
              y: [-10, 50, -10],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: element.delay,
            }}
          >
            {element.text}
          </motion.div>
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
            Let's <span className="text-neon">Connect</span>
          </h2>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your next project
            over coffee ☕
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Main CTA */}
            <div className="bg-olive/20 rounded-2xl p-8 border border-olive/30 backdrop-blur-sm hover:border-neon/30 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-neon/10 rounded-xl group-hover:bg-neon/20 transition-colors">
                  <Mail className="w-8 h-8 text-neon" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-off-white group-hover:text-neon transition-colors">
                    Get In Touch
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.button
                      onClick={handleSimpleEmailClick}
                      whileHover={{ scale: 1.01 }}
                      className="text-muted-gray hover:text-neon transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-1 focus:ring-offset-charcoal rounded-sm"
                      aria-label="Open email client to send email to arafmahmud028@gmail.com"
                    >
                      {myEmail}
                    </motion.button>
                    <motion.button
                      onClick={handleCopyEmail}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-muted-gray hover:text-neon transition-colors focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-1 focus:ring-offset-charcoal rounded-sm"
                      aria-label={emailCopied ? "Email address copied to clipboard" : "Copy email address to clipboard"}
                    >
                      {emailCopied ? (
                        <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                    </motion.button>
                  </div>
                  {emailCopied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-green-400 text-sm mt-1"
                      role="status"
                      aria-live="polite"
                    >
                      Email copied to clipboard!
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={() => setShowEmailOptions(!showEmailOptions)}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-neon text-charcoal py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-2 focus:ring-offset-charcoal"
                  aria-expanded={showEmailOptions}
                  aria-controls="email-options"
                  aria-label="Show email contact options"
                >
                  <Send
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isHovered ? "translate-x-1" : ""
                    }`}
                    aria-hidden="true"
                  />
                  Send me an email
                  <span
                    className={`transition-transform duration-300 ${
                      isHovered ? "rotate-12" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ✨
                  </span>
                </motion.button>

                {/* Email Options Dropdown */}
                <motion.div
                  id="email-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: showEmailOptions ? 1 : 0, 
                    height: showEmailOptions ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  role="region"
                  aria-label="Email contact options"
                >
                  <div className="bg-charcoal/50 rounded-xl p-4 border border-muted-gray/20 space-y-2">
                    <p className="text-sm text-muted-gray text-center mb-3">Choose your preferred email method:</p>
                    
                    <motion.button
                      onClick={handleGmailClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-red-500/20 text-red-300 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-1 focus:ring-offset-charcoal"
                      aria-label="Open Gmail in web browser to compose email"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      Open Gmail Web
                      <span className="text-xs opacity-75">(Browser)</span>
                    </motion.button>

                    <motion.button
                      onClick={handleSimpleEmailClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-500/20 text-blue-300 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-1 focus:ring-offset-charcoal"
                      aria-label="Open default email application like Outlook or Mail"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Default Email App
                      <span className="text-xs opacity-75">(Outlook, Mail, etc.)</span>
                    </motion.button>

                    <motion.button
                      onClick={handleCopyEmail}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-500/20 text-green-300 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-1 focus:ring-offset-charcoal"
                      aria-label={emailCopied ? "Email address has been copied to clipboard" : "Copy email address to clipboard"}
                    >
                      {emailCopied ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                      {emailCopied ? "Email Copied!" : "Copy Email Address"}
                    </motion.button>
                  </div>
                </motion.div>

                <div className="text-center">
                  <p className="text-sm text-muted-gray">
                    {showEmailOptions 
                      ? "Choose the option that works best for you" 
                      : "Click to see email options"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-charcoal/50 rounded-xl p-6 border border-muted-gray/20 hover:border-neon/30 transition-all duration-300 text-center"
              >
                <MapPin className="w-8 h-8 text-neon mx-auto mb-3" aria-hidden="true" />
                <h4 className="text-lg font-bold text-off-white mb-2">
                  Location
                </h4>
                <p className="text-muted-gray">
                  Available for remote work worldwide
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="bg-charcoal/50 rounded-xl p-6 border border-muted-gray/20 hover:border-neon/30 transition-all duration-300 text-center"
              >
                <Coffee className="w-8 h-8 text-neon mx-auto mb-3" aria-hidden="true" />
                <h4 className="text-lg font-bold text-off-white mb-2">
                  Response Time
                </h4>
                <p className="text-muted-gray">Usually within 24 hours</p>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-off-white">
                Find me elsewhere
              </h4>
              <div className="flex gap-4" role="list">
                {socialLoading ? (
                  <div className="flex gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-14 h-14 bg-olive/20 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  displaySocialLinks.map((social, index) => {
                    const IconComponent = getSocialIcon(social.platform);
                    const colorClass = getSocialColor(social.platform);
                    const description = getSocialDescription(social.platform);
                    
                    return (
                      <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 bg-olive/20 rounded-xl border border-olive/30 hover:border-neon/30 transition-all duration-300 group ${colorClass} focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-1 focus:ring-offset-charcoal`}
                        aria-label={`${social.platform} - ${description}`}
                        role="listitem"
                      >
                        <IconComponent className="w-6 h-6 text-muted-gray group-hover:text-current transition-colors" aria-hidden="true" />
                      </motion.a>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Simplified Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
            aria-hidden="true"
          >
            <div className="relative h-96 flex items-center justify-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon/10 via-neon/5 to-transparent rounded-full blur-2xl" />

              {/* Main Contact Visual */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="relative">
                  {/* Message 1 */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    animate={{ y: [-3, 3, -3] }}
                    transition={{
                      default: { duration: 0.5, delay: 0.3 },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="absolute -top-16 -left-20 bg-neon text-charcoal px-4 py-2 rounded-2xl rounded-bl-sm font-bold shadow-lg"
                  >
                    Hello! 👋
                  </motion.div>

                  {/* Message 2 */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    animate={{ y: [3, -3, 3] }}
                    transition={{
                      default: { duration: 0.5, delay: 0.5 },
                      y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                    viewport={{ once: true }}
                    className="absolute -bottom-16 -right-24 bg-olive text-off-white px-4 py-2 rounded-2xl rounded-br-sm shadow-lg"
                  >
                    Let's collaborate! ✨
                  </motion.div>

                  {/* Central Avatar */}
                  <motion.button
                    onClick={handleGmailClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-32 h-32 bg-gradient-to-br from-neon/20 to-olive/40 rounded-full p-2 shadow-2xl shadow-neon/20 cursor-pointer transition-all duration-300 hover:shadow-neon/30 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-1 focus:ring-offset-charcoal"
                    aria-label="Click to send me an email via Gmail"
                  >
                    <div className="w-full h-full bg-charcoal rounded-full flex items-center justify-center">
                      <Mail className="w-16 h-16 text-neon transition-all duration-300 hover:text-yellow-300" aria-hidden="true" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Simplified Orbiting Elements */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-3 h-3 bg-neon/30 rounded-full"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8 + i * 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: `${70 + i * 25}px center`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-muted-gray/20"
        >
          <p className="text-lg text-muted-gray mb-6">
            Open to freelance opportunities, collaborations, and exciting
            projects
          </p>
          <motion.button
            onClick={handleGmailClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-neon to-yellow-300 text-charcoal px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-neon transition-all duration-300 shadow-lg hover:shadow-neon/30 focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-1 focus:ring-offset-charcoal"
            aria-label="Start a conversation by sending an email"
          >
            Start a Conversation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;