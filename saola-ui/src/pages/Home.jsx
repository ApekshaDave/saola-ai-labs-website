import { motion } from 'framer-motion';
import { Zap, Shield, Rocket } from 'lucide-react';
import './Home.css';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Vite for instant reloads and optimal performance',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with best practices built-in',
    },
    {
      icon: Rocket,
      title: 'Ready to Scale',
      description: 'Modern architecture designed for growth and scalability',
    },
  ];

  return (
    <div className="home">
      <motion.section
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1>Welcome to SAOLA UI</h1>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="subtitle">
            A modern, clean React + Vite frontend for your SaaS application
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="cta-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </motion.div>
      </motion.section>

      <motion.section
        className="features-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
              >
                <Icon size={32} className="feature-icon" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants}>
          <h2>Ready to build something amazing?</h2>
          <p>Start building your next great project with SAOLA UI</p>
          <button className="btn-primary">Start Building</button>
        </motion.div>
      </motion.section>
    </div>
  );
}
