"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Gamepad2, Code2, GraduationCap, Briefcase, X, User } from "lucide-react"
import { useEffect, useState } from "react"

type Project = {
  title: string
  description: string
  tags: string[]
  imageUrl: string
  screenshots: string[]
}

// Lightbox modal for viewing project images
function Lightbox({ 
  isOpen, 
  onClose, 
  project 
}: { 
  isOpen: boolean
  onClose: () => void
  project: Project | null
}) {
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setActiveScreenshot(project.screenshots[0] ?? null)
    }
  }, [project])

  if (!isOpen || !project || !activeScreenshot) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full bg-card border border-border rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="bg-background px-4 pt-6 pb-4 sm:px-6">
          <div className="relative h-[min(60vh,520px)] overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image
              src={activeScreenshot}
              alt={`${project.title} active screenshot`}
              fill
              className="object-contain"
            />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">Click a thumbnail below to preview the full-screen image.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {project.screenshots.map((screenshot) => (
              <button
                key={screenshot}
                type="button"
                onClick={() => setActiveScreenshot(screenshot)}
                className={`overflow-hidden rounded-lg border transition ${screenshot === activeScreenshot ? "border-primary" : "border-border"}`}
              >
                <div className="relative aspect-[4/3] h-full w-full">
                  <Image
                    src={screenshot}
                    alt={`${project.title} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Project info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-mono bg-primary/20 text-primary rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
      </motion.div>
    </motion.div>
  )
}

// Animated pixel cursor component
function PixelCursor() {
  return (
    <motion.span
      className="inline-block w-3 h-5 bg-primary ml-1"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    />
  )
}

// Animated stat bar like in games
function StatBar({ label, value, maxValue = 100 }: { label: string; value: number; maxValue?: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground font-mono">{label}</span>
        <span className="text-primary font-mono">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-secondary rounded-sm overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}

// Project card with hover effects and click to open lightbox
function ProjectCard({ 
  title, 
  description, 
  tags, 
  imageUrl,
  index,
  onClick
}: { 
  title: string
  description: string
  tags: string[]
  imageUrl: string
  index: number
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg border border-border bg-card aspect-video hover:border-primary transition-colors">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>
        
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-background/90 flex flex-col justify-end p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-50" />
      </div>
    </motion.div>
  )
}

// Navigation link with gaming-style hover
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative px-4 py-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors group"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.2 }}
      />
    </a>
  )
}

export default function Portfolio() {
  const projects: Project[] = [
    {
      title: "Chillingan Reservation",
      description: "A restaurant reservation and ordering interface with a polished game-inspired UI.",
      tags: ["React", "UI Design", "Reservation"],
      imageUrl: "/Chillingan/ChillinganReservation.png",
      screenshots: [
        "/Chillingan/ChillinganReservation.png",
        "/Chillingan/ChillinganOrdering.png",
        "/Chillingan/ChillingaOrder.png",
      ],
    },
    {
      title: "Auth UI Screens",
      description: "Login, register, and account screens built for a polished authentication flow.",
      tags: ["UI/UX", "Authentication", "Design"],
      imageUrl: "/login/Log%20in.png",
      screenshots: [
        "/login/Log%20in.png",
        "/login/Logged%20in.png",
        "/login/Register.png",
      ],
    },
    {
      title: "Simple Lending",
      description: "A lending platform dashboard with screenshot previews of the core flows.",
      tags: ["Dashboard", "Web App", "Design"],
      imageUrl: "/SimpleLending/Screenshot%202026-05-15%20094335.png",
      screenshots: [
        "/SimpleLending/Screenshot%202026-05-15%20094335.png",
        "/SimpleLending/Screenshot%202026-05-15%20094346.png",
        "/SimpleLending/Screenshot%202026-05-15%20094353.png",
        "/SimpleLending/Screenshot%202026-05-15%20094359.png",
        "/SimpleLending/Screenshot%202026-05-15%20094405.png",
        "/SimpleLending/Screenshot%202026-05-15%20094410.png",
      ],
    },
  ]

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const skills = [
    { name: "HTML", level: 85 },
    { name: "CSS", level: 80 },
    { name: "JavaScript", level: 75 },
    { name: "Python", level: 70 },
    { name: "SQL (Database)", level: 72 },
  ]

  const openLightbox = (project: typeof projects[0]) => {
    setSelectedProject(project)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Lightbox Modal */}
      <Lightbox isOpen={lightboxOpen} onClose={closeLightbox} project={selectedProject} />

      {/* Pixel grid overlay */}
      <div className="fixed inset-0 pixel-grid pointer-events-none opacity-30" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm text-primary">&lt;dev/&gt;</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-1"
          >
            <NavLink href="#about">_about</NavLink>
            <NavLink href="#skills">_skills</NavLink>
            <NavLink href="#projects">_projects</NavLink>
            <NavLink href="#contact">_contact</NavLink>
          </motion.div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden px-4 py-2 bg-primary text-primary-foreground text-sm font-mono rounded"
          >
            Contact
          </motion.a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-col items-center"
          >
            {/* Profile Picture */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-card border-4 border-primary overflow-hidden">
                <Image
                  src="/ME.png"
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Gaming-style level badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-mono rounded-full">
                LVL 3
              </div>
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />
            </div>
            
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-mono rounded-full border border-primary/30">
              PLAYER 1 READY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
          >
            <span className="text-glow">Computer Science</span>
            <br />
            <span className="text-muted-foreground">Student & Developer</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 font-mono"
          >
            <span className="text-primary">&gt;</span> Loading portfolio
            <PixelCursor />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">University of Bohol</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">2023 - 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-muted-foreground">OJT Intern: June 8</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              View Projects
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-secondary text-secondary-foreground font-mono text-sm rounded hover:bg-secondary/80 transition-colors border border-border"
            >
              Get in Touch
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-primary font-mono">01.</span> About Me
            </h2>
            <div className="h-px bg-border flex-1 mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-muted-foreground leading-relaxed">
                Hello! I&apos;m a passionate Computer Science student at the{" "}
                <span className="text-primary">University of Bohol</span>, currently in my journey 
                from 2023 to 2026. I love building things that live on the internet and exploring 
                new technologies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m excited to start my <span className="text-accent">OJT internship on June 8</span>, 
                where I&apos;ll be applying everything I&apos;ve learned and gaining real-world experience in 
                software development.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me gaming, learning new programming languages, 
                or working on personal projects to expand my skills.
              </p>

              {/* Quest status box */}
              <div className="mt-6 p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <span className="font-mono text-sm text-primary">CURRENT QUEST</span>
                </div>
                <p className="text-foreground font-semibold mb-1">Complete OJT Internship</p>
                <p className="text-muted-foreground text-sm">Starting June 8, 2026</p>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: "15%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Progress: 15%</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Character stats card */}
              <div className="p-6 bg-card border border-border rounded-lg relative overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">CS</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Developer</h3>
                    <p className="text-sm text-muted-foreground font-mono">LVL 3 • Student</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <StatBar label="Programming" value={85} />
                  <StatBar label="Problem Solving" value={80} />
                  <StatBar label="Creativity" value={88} />
                  <StatBar label="Teamwork" value={82} />
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-mono mb-2">ACHIEVEMENTS</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded">🎓 CS Student</span>
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-mono rounded">💻 Developer</span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-mono rounded">🎮 Gamer</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-primary font-mono">02.</span> Skills & Tech
            </h2>
            <div className="h-px bg-border flex-1 mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Technical Skills
              </h3>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <StatBar key={skill.name} label={skill.name} value={skill.level} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                Technologies I Use
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {["HTML", "CSS", "JavaScript", "Python", "SQL", "Git"].map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="p-3 bg-secondary/50 border border-border rounded text-center hover:border-primary hover:bg-primary/10 transition-colors cursor-default"
                  >
                    <span className="text-sm font-mono text-muted-foreground">{tech}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-mono">&gt;</span> Always learning and exploring new technologies to level up my skills!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-primary font-mono">03.</span> My Projects
            </h2>
            <p className="text-muted-foreground mt-4">
              Here are some of my works and projects. Hover over each to see more details.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.title} 
                {...project} 
                index={index} 
                onClick={() => openLightbox(project)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground font-mono text-sm">
              <span className="text-primary">&gt;</span> More projects coming soon...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-card/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-mono text-sm">04. What&apos;s Next?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Get In Touch
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              I&apos;m currently looking for opportunities and my inbox is always open. 
              Whether you have a question, want to collaborate, or just want to say hi, 
              I&apos;ll do my best to get back to you!
            </p>

            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-mono rounded hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Say Hello
            </a>

            <div className="flex justify-center gap-6 mt-12">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-card border border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-card border border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-3 bg-card border border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">&lt;/&gt;</span> Built with Next.js & Tailwind CSS
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2026 • University of Bohol • CS Student
          </p>
        </div>
      </footer>
    </div>
  )
}
