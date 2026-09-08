import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { PlatformEvent, platformEvents } from "@/data/events";

const InteractiveProjector = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, radius: 300 }; // Expanded interaction radius

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      density: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5; // Constant slow drift
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1.5;
        this.density = Math.random() * 80 + 20;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(2, 132, 199, 0.4)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(2, 132, 199, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update(width: number, height: number) {
        // Constant movement
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * (this.density / 5); // Smooth repulsion
          const directionY = forceDirectionY * force * (this.density / 5);

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    const init = () => {
      particles = [];
      const density = window.innerWidth < 768 ? 12000 : 7000; // Lower density for mobile
      const numberOfParticles = (canvas.width * canvas.height) / density;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw();
      }
      connect();
    };

    let animationFrameId: number | null = null;
    let running = false;

    const animate = () => {
      if (!running) return;
      drawFrame();
      animationFrameId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (running) return;
      running = true;
      animate();
    };

    const stopAnimation = () => {
      running = false;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Longer connection lines
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(2, 132, 199, ${opacity * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.touches[0].clientX - rect.left;
        mouse.y = event.touches[0].clientY - rect.top;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleTouchEnd);
    canvas.addEventListener("touchstart", handleTouchMove, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);
    
    handleResize();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !prefersReducedMotion) startAnimation();
      else stopAnimation();
    }, { rootMargin: "100px" });
    observer.observe(canvas);
    if (prefersReducedMotion) drawFrame();

    return () => {
      stopAnimation();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleTouchEnd);
      canvas.removeEventListener("touchstart", handleTouchMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-auto opacity-45" />;
};

export function Events({ events = platformEvents }: { events?: PlatformEvent[] }) {
  const { t } = useLanguage();

  return (
    <section id="events" className="scroll-mt-28 py-16 md:py-24 relative overflow-hidden">
      <InteractiveProjector />
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 md:mb-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center border border-border">
               {/* ICON: events-icon.svg */}
              <Image src="/assets/events-icon.svg" alt="Events Icon" width={32} height={32} />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-2">{t("Events &", "Événements et")} <span className="text-highlight">{t("Archives", "archives")}</span></h2>
              <p className="text-textSecondary">{t("Verified dates and official event resources.", "Dates vérifiées et ressources officielles des événements.")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((event, index) => {
            return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl glow-border relative group shadow-xl flex flex-col h-full"
            >
              <div className="flex-grow">
                <div className="flex flex-col mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <time dateTime={event.startsAt} className="text-highlight font-bold text-lg">{t(event.dateEn, event.dateFr)}</time>
                    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-textSecondary">
                      {event.isPast ? t("Past event", "Événement passé") : t("Upcoming event", "Événement à venir")}
                    </span>
                  </div>
                  <span className="text-textSecondary text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {t(event.locationEn, event.locationFr)}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{t(event.titleEn, event.titleFr)}</h3>
                <p className="text-textSecondary leading-relaxed mb-8">{t(event.descriptionEn, event.descriptionFr)}</p>
              </div>
              
              <a 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-surface border border-border text-textPrimary hover:border-highlight hover:text-highlight hover:bg-highlight/5 py-4 rounded-xl font-bold transition-all mt-auto"
              >
                {t("View official event page", "Voir la page officielle")}
              </a>
            </motion.div>
            );
          })}
        </div>

        </div>
      </div>
    </section>
  );
}
