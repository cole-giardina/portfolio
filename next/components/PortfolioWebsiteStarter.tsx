"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";

const SunsetCanvas = dynamic(() => import("./SunsetCanvas"), { ssr: false });

type Project = {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image?: string;
  link?: string;
};

const projects: Project[] = [
  {
    title: "Ultra Ux",
    subtitle: "Software development intern \u2014 Barcelona, Spain",
    description:
      "Contributed to a personalized sports nutrition and wellness app, collaborating with cross-functional teams in an agile environment to improve usability and performance across frontend and backend.",
    tag: "Internship",
    image: "/ultra-ux-logo.png",
  },
  {
    title: "Intel & Grammys",
    subtitle: "Data analysis for Intel sustainability and The Recording Academy",
    description:
      "Used Python, SQL, and Tableau to analyze sustainability data for Intel and audience engagement across Recording Academy websites, delivering actionable insights and data-driven recommendations.",
    tag: "Data Analysis",
  },
  {
    title: "Risk Radar",
    subtitle: "AI-powered email threat analysis",
    description:
      "A FastAPI service that extracts security features from email text and classifies phishing threats using Claude, with explainable signals and structured detection results.",
    tag: "Cybersecurity",
    link: "https://cole-giardina.github.io/riskradar/",
  },
];

export default function PortfolioWebsiteStarter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.96, 0.92]);
  const sunsetOpacity = useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [1, 1, 0.72, 0.6]);

  return (
    <div ref={containerRef} className="text-white">
      <SunsetCanvas />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#home" className="text-lg font-semibold tracking-tight text-white/95">
            Cole Giardina
          </a>
          <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.2em] text-white/70 md:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#projects" className="transition hover:text-white">
              Projects
            </a>
            <a href="#focus" className="transition hover:text-white">
              Focus
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section id="home" className="relative min-h-screen overflow-hidden px-6 pt-28 lg:px-10">
          <div className="mx-auto grid min-h-screen max-w-7xl items-end gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              style={{ y: heroY, scale: titleScale, opacity: sunsetOpacity }}
              className="self-center"
            >
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/60 md:text-sm">
                Tempe • Arizona
              </p>
              <div className="max-w-3xl">
                <div className="mb-3 flex items-start gap-3">
                  <span className="mt-4 hidden h-px w-12 bg-white/50 md:block" />
                  <p className="text-2xl font-medium leading-none text-white/90 md:text-4xl">
                    Cole Giardina
                  </p>
                </div>
                <h1
                  className="max-w-5xl text-7xl font-semibold leading-[0.9] tracking-tight md:text-9xl lg:text-[9rem]"
                  style={{
                    background:
                      "linear-gradient(90deg, #ffffff 25%, #f0a050 60%, #e06878 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Portfolio
                </h1>
              </div>
              <p className="mt-8 max-w-xl text-sm leading-7 text-white/75 md:text-base">
                Computer Information Systems student at Arizona State University with hands-on experience in software development, data analysis, and cybersecurity governance — building at the intersection of technology and business.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-white/20"
                >
                  View Work
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  Contact
                </a>
              </div>
            </motion.div>

            <div className="relative flex min-h-[32rem] items-end justify-end">
              <div className="relative w-full max-w-[32rem]">
                <div className="absolute left-0 top-0 h-24 w-24 border border-white/15" />
                <div className="absolute right-3 top-10 text-[10px] uppercase tracking-[0.4em] text-white/45 [writing-mode:vertical-rl]">
                  2026 Portfolio
                </div>
                <div className="relative rounded-[2rem] border border-white/15 bg-black/10 p-6 backdrop-blur-md">
                  <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
                    <span>W.P. Carey School of Business</span>
                    <span>ASU &apos;26</span>
                  </div>
                  <div className="aspect-[3/4] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                    <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-white/10 p-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/45">B.S. Computer Information Systems</p>
                        <h2 className="mt-3 text-4xl font-semibold leading-none md:text-5xl">
                          Cole
                          <br />
                          Giardina
                        </h2>
                      </div>
                      <div>
                        <p className="max-w-xs text-sm leading-7 text-white/70">
                          Cybersecurity-minded builder with experience in software development, data analysis, and GRC.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">About</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                Technology meets
                <br />
                business thinking.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                [
                  "Education",
                  "B.S. in Computer Information Systems from the W.P. Carey School of Business at Arizona State University, graduating May 2026.",
                ],
                [
                  "Experience",
                  "Software development intern at Ultra Ux in Barcelona, SQL & Python trainee at The Global Career Accelerator, and hands-on management at Vito\u2019s Italian Ristorante.",
                ],
                [
                  "Certifications",
                  "GRC Mastery Course in Governance, Risk & Compliance. Arizona State University Coding for Data Track.",
                ],
                [
                  "Technical Skills",
                  "Python, SQL, Java, JavaScript, HTML/CSS, Tableau, Excel. Frameworks include NIST CSF, ISO 27001, HIPAA, GDPR, and PCI-DSS.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[2rem] border border-white/10 bg-black/10 p-6 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">{title}</p>
                  <p className="mt-4 text-sm leading-7 text-white/75">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="relative px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Projects</p>
                <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Selected Work</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/70">
                Professional experience, data projects, and personal ventures spanning software development, analytics, and brand building.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`group rounded-[2rem] border border-white/10 bg-black/10 p-5 backdrop-blur-sm${project.link ? " cursor-pointer" : ""}`}
                  onClick={project.link ? () => window.open(project.link, "_blank") : undefined}
                >
                  <div className="mb-5 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))] p-4 transition duration-300 group-hover:scale-[1.01]">
                    <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-white/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">{project.tag}</p>
                      {project.image && (
                        <div className="flex flex-1 items-center justify-center py-4">
                          <img src={project.image} alt={project.title} className="max-h-20 max-w-[70%] object-contain" />
                        </div>
                      )}
                      <div>
                        <p className="text-3xl font-semibold leading-none">{project.title}</p>
                        <p className="mt-3 text-sm text-white/65">{project.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-white/75">{project.description}</p>
                  {project.link && (
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/40">View Project &rarr;</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="focus" className="relative px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-black/10 p-8 backdrop-blur-sm md:grid-cols-3">
            {[
              "Cybersecurity & GRC",
              "Software Development",
              "Data Analysis & Visualization",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Focus Area</p>
                <h3 className="mt-4 text-2xl font-medium">{item}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="relative px-6 pb-24 pt-10 lg:px-10">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-black/10 p-10 text-center backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Contact</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Let&apos;s connect.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75">
              Open to opportunities in cybersecurity, software development, and data-driven roles. Based in Tempe, Arizona.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:cvgiardi@asu.edu"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
              >
                Email
              </a>
              <a
                href="https://linkedin.com/in/cole-giardina-166454302"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/cole-giardina"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
