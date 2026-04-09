"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FloatingHeader } from "./floating-header";
import { AnimatedCard, CardBody, CardDescription, CardTitle, CardVisual, Visual1 } from "./animated-card";
import { Entropy } from "./entropy";

export const SmoothScrollHero = () => {
  return (
    <div className="bg-zinc-950">
      <FloatingHeader />
      <Hero />

      <Features />
      <Benefits />
      <Footer />
    </div>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <ParallaxImages />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10 px-4">
          <motion.h1
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-6"
          >
            Klaro
          </motion.h1>
          <motion.p
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto"
          >
            AI-Powered Issue Tracking for Modern Teams
          </motion.p>
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75, delay: 0.6 }}
          >
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
            >
              Get Started <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2670&auto=format&fit=crop"
        alt="Team collaboration"
        start={-200}
        end={200}
        className="w-1/3 rounded-lg"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
        alt="Project management"
        start={200}
        end={-250}
        className="mx-auto w-2/3 rounded-lg"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop"
        alt="Issue tracking"
        start={-200}
        end={200}
        className="ml-auto w-1/3 rounded-lg"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop"
        alt="Analytics dashboard"
        start={0}
        end={-500}
        className="ml-24 w-5/12 rounded-lg"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }: any) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const EntropySection = () => {
  console.log('🔵 EntropySection rendering')
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:py-32 bg-red-500/10">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Order Meets Chaos
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
          Watch as structured planning and dynamic execution dance together in perfect harmony
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75, delay: 0.2 }}
        className="flex flex-col items-center bg-yellow-500/10 p-8"
      >
        <div className="relative w-full max-w-xl flex justify-center bg-green-500/10 p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full" />
          <Entropy className="rounded-2xl shadow-2xl relative z-10" size={500} />
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.75, delay: 0.4 }}
          className="mt-12 text-center max-w-2xl px-4"
        >
          <p className="text-zinc-400 text-base md:text-lg italic leading-relaxed">
            &ldquo;In every project, there's a delicate balance between order and chaos. 
            Klaro helps you embrace both.&rdquo;
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 py-32 text-white"
    >
      <motion.h2
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-16 text-4xl md:text-5xl font-black uppercase text-center"
      >
        Powerful Features
      </motion.h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.1 }}
        >
          <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#3b82f6" secondaryColor="#2563eb" />
            </CardVisual>
            <CardBody>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Get intelligent suggestions and automated issue categorization with advanced AI that understands your workflow
              </CardDescription>
            </CardBody>
          </AnimatedCard>
        </motion.div>

        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
        >
          {/* <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#8b5cf6" secondaryColor="#7c3aed" />
            </CardVisual>
            <CardBody>
              <CardTitle>Smart Kanban Boards</CardTitle>
              <CardDescription>
                Visualize your workflow with intuitive drag-and-drop boards that adapt to your team's needs
              </CardDescription>
            </CardBody>
          </AnimatedCard> */}
        </motion.div>

        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.3 }}
        >
          <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#10b981" secondaryColor="#059669" />
            </CardVisual>
            <CardBody>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Create groups, assign roles, and collaborate seamlessly with your team in real-time
              </CardDescription>
            </CardBody>
          </AnimatedCard>
        </motion.div>

        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.4 }}
        >
          <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#f59e0b" secondaryColor="#d97706" />
            </CardVisual>
            <CardBody>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Upload, organize, and chat with your project documents using AI-powered search and insights
              </CardDescription>
            </CardBody>
          </AnimatedCard>
        </motion.div>

        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.5 }}
        >
          <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#ec4899" secondaryColor="#db2777" />
            </CardVisual>
            <CardBody>
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>
                Track project metrics, team performance, and issue trends with beautiful visualizations and insights
              </CardDescription>
            </CardBody>
          </AnimatedCard>
        </motion.div>

        <motion.div
          initial={{ y: 48, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.6 }}
        >
          <AnimatedCard>
            <CardVisual>
              <Visual1 mainColor="#06b6d4" secondaryColor="#0891b2" />
            </CardVisual>
            <CardBody>
              <CardTitle>Priority Management</CardTitle>
              <CardDescription>
                Organize issues by priority levels and status tracking to keep your team focused on what matters most
              </CardDescription>
            </CardBody>
          </AnimatedCard>
        </motion.div>
      </div>
    </section>
  );
};

const Benefits = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-32">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 md:p-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Everything you need to manage your projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <BenefitItem title="Priority Management" description="Track issues with LOW, MEDIUM, and HIGH priorities" />
          <BenefitItem title="Status Tracking" description="Monitor progress from TO_DO to IN_PROGRESS to DONE" />
          <BenefitItem title="Real-time Chat" description="Discuss issues with AI-powered assistance" />
          <BenefitItem title="Analytics Dashboard" description="Visualize project metrics and team performance" />
        </div>
      </motion.div>
    </section>
  );
};

const BenefitItem = ({ title, description }: any) => {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-zinc-500">
        <p>&copy; 2025 Klaro. Built with ❤️ using Next.js and TypeScript.</p>
      </div>
    </footer>
  );
};
