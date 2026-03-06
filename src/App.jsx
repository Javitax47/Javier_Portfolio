import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  // UI General
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  Download,
  ArrowUpRight,

  // Categoría: Software & Tech
  Terminal,
  Blocks,
  Database,
  Binary,
  Code2,
  Wifi,

  // Categoría: Hardware & Electrónica
  Cpu,
  Microchip,
  Zap,
  Radar,

  // Categoría: Física & Ciencia
  Atom,
  Activity,
  Flame,
  Waves,
  FlaskConical,
  Magnet,
  Aperture,
  Sigma,
  FileText,

  // Categoría: Espacio & Naturaleza
  Orbit,
  Rocket,
  Globe,
  Mountain,
  Sparkles,

  // Categoría: IA & Datos
  Network,
  Bot,
  Layers,

  // Otros
  CheckCircle2,
  Copy,
  Briefcase,
  GraduationCap,
  Shield,
  TrendingUp
} from 'lucide-react';

// 1. Revelar al hacer scroll
const useScrollReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return { ref, isVisible };
};

// Componente Reveal
const Reveal = ({ children, delay = 0, className = "" }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 is-revealed' : 'opacity-0 translate-y-12'
        } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Efecto Magnético (Atrae el elemento al cursor)
const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return React.cloneElement(children, {
    ref,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    style: { transform: `translate(${position.x}px, ${position.y}px)`, transition: 'transform 0.1s ease-out' }
  });
};

const LiquidContainer = ({ children, className = "", Element = "div", ...props }) => {
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Element
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`group/liquid relative liquid-glass ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover/liquid:opacity-100 transition-opacity duration-300 z-0 rounded-[inherit]" style={{ background: `radial-gradient(600px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.1), transparent 40%)` }} />
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover/liquid:opacity-100 transition-opacity duration-500 z-0 rounded-[inherit]" style={{ background: `radial-gradient(800px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.02), transparent 40%)` }} />
      {children}
    </Element>
  );
};

// --- COMPONENTES VISUALES ---

// Fondo de Partículas (Optimizado)
const ParticleNetworkCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const configRef = useRef({ particleCount: 200, connectionDistance: 250, mouseRepulsion: 200, baseSpeed: 0.15 });
  const lastSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const getConfig = (width) => {
      // Continuous linear scaling
      const particleCount = Math.floor(Math.max(120, Math.min(250, width / 6)));
      const connectionDistance = Math.floor(Math.max(120, Math.min(500, width / 5)));
      const mouseRepulsion = Math.floor(Math.max(120, Math.min(250, width / 7)));
      return { particleCount, connectionDistance, mouseRepulsion, baseSpeed: 0.15 };
    };

    const getQuadrantsCount = (width, height) => {
      const counts = [0, 0, 0, 0]; // TL, TR, BL, BR
      particles.forEach(p => {
        if (p.fadingOut) return;
        const col = p.x < width / 2 ? 0 : 1;
        const row = p.y < height / 2 ? 0 : 1;
        counts[row * 2 + col]++;
      });
      return counts;
    };

    const updateParticles = (targetCount) => {
      const width = canvas.width;
      const height = canvas.height;
      const activeParticles = particles.filter(p => !p.fadingOut);

      if (activeParticles.length > targetCount) {
        let toRemove = activeParticles.length - targetCount;
        while (toRemove > 0) {
          const counts = getQuadrantsCount(width, height);
          const maxIdx = counts.indexOf(Math.max(...counts));

          // Find an active particle in that quadrant to remove
          const pIdx = particles.findIndex(p => {
            if (p.fadingOut) return false;
            const col = p.x < width / 2 ? 0 : 1;
            const row = p.y < height / 2 ? 0 : 1;
            return (row * 2 + col) === maxIdx;
          });

          if (pIdx !== -1) {
            particles[pIdx].fadingOut = true;
            toRemove--;
          } else {
            // Fallback if no particle found in target quadrant (shouldn't happen)
            const fallbackIdx = particles.findIndex(p => !p.fadingOut);
            if (fallbackIdx !== -1) {
              particles[fallbackIdx].fadingOut = true;
              toRemove--;
            } else break;
          }
        }
      }
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const newConfig = getConfig(width);
      configRef.current = newConfig;
      updateParticles(newConfig.particleCount);
      lastSizeRef.current = { width, height };
    };

    window.addEventListener('resize', resizeCanvas);

    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;
    canvas.width = initialWidth;
    canvas.height = initialHeight;
    configRef.current = getConfig(initialWidth);
    updateParticles(configRef.current.particleCount);
    lastSizeRef.current = { width: initialWidth, height: initialHeight };

    let frameCount = 0;

    const animate = () => {
      const config = configRef.current;
      const fadeSpeed = 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      const activeParticles = particles.filter(p => !p.fadingOut);
      const counts = getQuadrantsCount(width, height);

      // Balancing Spawn: Pick the sparsest quadrant
      if (activeParticles.length < config.particleCount) {
        const toAdd = Math.min(config.particleCount - activeParticles.length, 2);
        for (let i = 0; i < toAdd; i++) {
          const minIdx = counts.indexOf(Math.min(...counts));
          counts[minIdx]++; // Update local count for the next iteration of the loop

          const col = minIdx % 2;
          const row = Math.floor(minIdx / 2);

          const px = (col * width / 2) + Math.random() * (width / 2);
          const py = (row * height / 2) + Math.random() * (height / 2);

          particles.push({
            x: px, y: py,
            vx: (Math.random() - 0.5) * config.baseSpeed, vy: (Math.random() - 0.5) * config.baseSpeed,
            radius: Math.random() * 1.5 + 0.5, baseAlpha: Math.random() * 0.5 + 0.1,
            currentAlpha: 0, fadingOut: false
          });
        }
      }

      // Slow Migration: Periodically move particles from dense to sparse areas
      frameCount++;
      if (frameCount % 60 === 0 && particles.length > 0) {
        const maxVal = Math.max(...counts);
        const minVal = Math.min(...counts);
        if (maxVal - minVal > config.particleCount * 0.1) { // 10% tolerance
          const maxIdx = counts.indexOf(maxVal);
          const pIdx = particles.findIndex(p => {
            if (p.fadingOut) return false;
            const c = p.x < width / 2 ? 0 : 1;
            const r = p.y < height / 2 ? 0 : 1;
            return (r * 2 + c) === maxIdx;
          });
          if (pIdx !== -1) particles[pIdx].fadingOut = true;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        if (p.fadingOut) {
          p.currentAlpha -= fadeSpeed;
          if (p.currentAlpha <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
          }
        } else if (p.currentAlpha < p.baseAlpha) {
          p.currentAlpha += fadeSpeed;
          if (p.currentAlpha > p.baseAlpha) p.currentAlpha = p.baseAlpha;
        }

        p.x += p.vx; p.y += p.vy;

        if (!p.fadingOut) {
          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.fadingOut = true;
          }
        }

        let dx = mouseRef.current.x - p.x;
        let dy = mouseRef.current.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.mouseRepulsion) {
          let force = (config.mouseRepulsion - dist) / config.mouseRepulsion;
          p.x -= (dx / dist) * force * 0.5;
          p.y -= (dy / dist) * force * 0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.currentAlpha})`;
        ctx.fill();

        // Constellation Effect: Connect to 1-2 nearest neighbors instead of all within radius
        if (config.connectionDistance > 0) {
          const neighbors = [];
          for (let j = 0; j < particles.length; j++) {
            if (i === j) continue;
            const p2 = particles[j];
            const dist2 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (dist2 < config.connectionDistance) {
              neighbors.push({ index: j, dist: dist2, alpha: p2.currentAlpha });
            }
          }

          // Sort by distance and connect only to the nearest 2
          neighbors.sort((a, b) => a.dist - b.dist);
          const maxConnections = 2;

          for (let k = 0; k < Math.min(neighbors.length, maxConnections); k++) {
            const n = neighbors[k];
            const p2 = particles[n.index];

            // To avoid drawing the same line twice (improves performance and prevents color stacking)
            if (i < n.index) {
              const lineAlpha = Math.min(p.currentAlpha, n.alpha);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              // Increased base visibility (from 0.1 to 0.3) for the "stronger connections" request
              ctx.strokeStyle = `rgba(160, 200, 255, ${(1 - (n.dist / config.connectionDistance)) * 0.3 * (lineAlpha / Math.max(p.baseAlpha, p2.baseAlpha))})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Tarjeta con efecto Spotlight
const ProjectCard = ({ title, category, icon: Icon, description, techStack, githubLink, liveLink, status, metrics }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case 'Terminado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'En Proceso': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Planeado': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <LiquidContainer className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-white/20">
      <div className="relative flex flex-col h-full p-8 z-10">
        <div className="relative z-20 flex-grow">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-2">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] text-zinc-400 group-hover:text-blue-400 transition-colors shadow-inner">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              {status && (
                <span className={`text-[9px] h-fit font-mono tracking-widest uppercase px-2 py-0.5 rounded-md border ${getStatusColor(status)}`}>
                  {status}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-white/[0.03] text-zinc-400 rounded-full border border-white/[0.05]">
              {category}
            </span>
          </div>
          <h4 className="text-xl font-semibold text-zinc-100 mb-3 tracking-tight group-hover:text-white transition-colors">{title}</h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-light mb-4">{description}</p>
          {metrics && (
            <div className="flex items-start gap-2 mb-6 px-3 py-2 bg-blue-500/[0.04] border border-blue-500/10 rounded-lg">
              <TrendingUp size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <span className="text-xs text-blue-300/80 font-medium leading-relaxed">{metrics}</span>
            </div>
          )}
        </div>
        <div className="relative z-20 mt-auto border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-1 bg-white/[0.03] text-zinc-500 border border-white/[0.05] rounded-md">{tech}</span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            {githubLink && githubLink !== "#" && <a href={githubLink} className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"><Github size={16} className="mr-2" /> Repositorio</a>}
            {liveLink && liveLink !== "#" && <a href={liveLink} className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Ver Detalles <ExternalLink size={16} className="ml-1" /></a>}
          </div>
        </div>
      </div>
    </LiquidContainer>
  );
};

const FILTER_CATEGORIES = ['Todos', 'Software & IA', 'Hardware', 'Física', 'Aeroespacial', 'Otras'];

const PROJECTS = [
  {
    title: "Detección y Caracterización de Ondas Gravitacionales",
    category: "Deep Learning & Astrofísica",
    filterGroup: "Software & IA",
    icon: Network,
    description: "Entrenamiento y comparación de IAs (2D-CNN y Transformers) para identificación y caracterización de colisiones de agujeros negros en ondas gravitacionales, con interfaz web user-friendly. Incluye análisis comparativo entre 1D-ResNet y Transformers, regresión para estimación de parámetros astrofísicos y técnicas de XAI.",
    techStack: ['Deep Learning', 'Vision Transformers', 'Procesamiento de Señales', 'PyTorch', 'UI/UX', 'Astrofísica Computacional'],
    metrics: "2 arquitecturas DL comparadas (CNN vs ViT) · Regresión de parámetros astrofísicos",
    status: "En Proceso",
    githubLink: "https://github.com/Javitax47/TFG_GravitationalWaves_AI"
  },
  {
    title: "Solver Espacio-Temporal Verificador de Métricas Originales",
    category: "Computación Científica & Física",
    filterGroup: "Física",
    icon: Activity,
    description: "Solver en Python (Google Colab) para verificar, resolver numéricamente y probar métricas espacio-temporales originales de Relatividad General, con pruebas de estrés y cálculo tensorial.",
    techStack: ['Python', 'Relatividad General', 'Cálculo Tensorial', 'Métodos Numéricos'],
    metrics: "Verificación tensorial automatizada · Pruebas de estrés numéricas",
    status: "En Proceso",
    githubLink: "https://github.com/Javier/spacetime-solver"
  },
  {
    title: "Cámara de Niebla con Enfriamiento Peltier",
    category: "Hardware & Física de Partículas",
    filterGroup: "Hardware",
    icon: Cpu,
    description: "Cámara de niebla mediante placas Peltier con cronómetro y alarma para ciclos térmicos, diseñado y soldado en una PCB personalizada para detección de partículas.",
    techStack: ['Diseño PCB', 'Soldadura', 'Termodinámica', 'Física de Partículas'],
    metrics: "PCB custom diseñada y soldada · Ciclos térmicos automatizados",
    status: "Terminado",
    githubLink: "https://github.com/Javier/cloud-chamber"
  },
  {
    title: "Physdeck: Kit de Simuladores Físicos",
    category: "Física Computacional & VFX",
    filterGroup: "Física",
    icon: Layers,
    description: "Ecosistema modular que integra simulaciones de cascadas de rayos cósmicos (CORSIKA), dinámica de fluidos para explosiones y predicción de reacciones químicas moleculares con visualización avanzada.",
    techStack: ['CORSIKA', 'VFX', 'Dinámica de Fluidos', 'Química Computacional', 'GUI Dev'],
    metrics: "3 motores de simulación · Visualización en tiempo real · Predicción molecular",
    status: "Terminado",
    githubLink: "https://github.com/Javier/physdeck"
  },
  /*
  {
    title: "Bot de Arbitraje MEV",
    category: "DeFi, Rust & Análisis Formal",
    filterGroup: "Software & IA",
    icon: Bot,
    description: "Bot de arbitraje MEV explotando nichos desaprovechados en tokens con impuestos complejos, liquidez media y nuevos, usando Rust y Z3 para rutas rentables.",
    techStack: ['Rust', 'Web3 / Smart Contracts', 'Z3 Theorem Prover', 'Algoritmos HFT'],
    metrics: "Implementado en Rust para latencia <50ms · Z3 para verificación formal de rutas",
    status: "En Proceso",
    githubLink: "https://github.com/Javier/mev-bot"
  },
  */
  {
    title: "Misión de Exploración a Trappist-1 y Motor de Optimización",
    category: "Ingeniería Aeroespacial",
    filterGroup: "Aeroespacial",
    icon: Orbit,
    description: "Plan detallado para misión de exploración espacial a Trappist-1, con motor de optimización para determinar características de la nave, incluyendo mecánica orbital y propulsión.",
    techStack: ['Mecánica Orbital', 'Optimización', 'Ingeniería Aeroespacial', 'Física de Plasma'],
    metrics: "Motor de optimización multi-parámetro · Simulación de trayectorias orbitales",
    status: "Terminado",
    githubLink: "https://github.com/Javier/trappist-mission"
  },
  {
    title: "Videojuego de Exploración Espacial (Proyecto Cosmos)",
    category: "Simulación & Unity3D",
    filterGroup: "Software & IA",
    icon: Globe,
    description: "Videojuego de exploración espacial con universo a escala real, transiciones sin costuras en Unity, simulación geológica de escala planetaria y más de 80 tipos de formaciones geológicas únicas, usando Compute Shaders y origen flotante.",
    techStack: ['Unity3D', 'Compute Shaders', 'Generación Procedimental', 'Matemáticas 3D', 'Geofísica'],
    metrics: "80+ formaciones geológicas únicas · Escala planetaria real · Compute Shaders",
    status: "En Proceso",
    githubLink: "https://github.com/Javier/cosmos-project"
  },
  {
    title: "Proyecto Diophantus",
    category: "Matemáticas Computacionales",
    filterGroup: "Otras",
    icon: Sigma,
    description: "Herramienta que compila algoritmos en C en polinomios de Ecuaciones Diofánticas basadas en el Teorema MRDP, transformando lógica dinámica en verdades matemáticas estáticas.",
    techStack: ['Matemáticas Computacionales', 'Diseño de Algoritmos', 'Resolución de Problemas'],
    metrics: "Compilador C → Polinomios Diofánticos · Basado en Teorema MRDP",
    status: "En Proceso",
    githubLink: "https://github.com/Javier/diophantus"
  },
  {
    title: "Proyecto AURA Pin",
    category: "Sistemas Embebidos & Edge AI",
    filterGroup: "Hardware",
    icon: Cpu,
    description: "Ecosistema modular de captura contextual (audio/vídeo) con privacidad por diseño, procesamiento local y esquemáticos electrónicos para el wearable Aura Capture Pin.",
    techStack: ['Diseño de Esquemáticos', 'Sistemas Embebidos', 'Edge AI', 'Criptografía'],
    metrics: "Privacidad por diseño · Procesamiento Edge local",
    status: "Planeado",
    githubLink: "https://github.com/Javier/aura-pin"
  },
  {
    title: "Spike-101: Núcleo Neuromórfico Open-Source",
    category: "Microelectrónica Analógica",
    filterGroup: "Hardware",
    icon: Zap,
    description: "Diseño a nivel de transistor de un núcleo neuromórfico analógico de señal mixta para Spiking Neural Networks (SNN), usando SkyWater 130nm PDK.",
    techStack: ['VLSI (SkyWater 130nm)', 'Computación Neuromórfica', 'Diseño Analógico', 'SNN'],
    metrics: "Diseño transistor-level · SkyWater 130nm PDK",
    status: "Planeado",
    githubLink: "https://github.com/Javier/spike-101"
  },
  {
    title: "Modelo Escala de Central Nuclear Funcional (PWR)",
    category: "Termohidráulica & Mecatrónica",
    filterGroup: "Física",
    icon: Flame,
    description: "Modelo a escala funcional de Reactor de Agua a Presión (PWR) que ejecuta procesos termodinámicos reales para generar vapor y electricidad, sin material fisible.",
    techStack: ['Termohidráulica', 'Mecatrónica', 'Ciencia de Materiales', 'Sistemas de Control'],
    metrics: "Procesos termodinámicos reales · Generación de electricidad",
    status: "Planeado",
    githubLink: "https://github.com/Javier/nuclear-model"
  },
  {
    title: "MDFC-Alpha: Medidor de Divergencia de Flujo Cósmico",
    category: "Física Experimental & Estadística",
    filterGroup: "Física",
    icon: Radar,
    description: "Instrumento para metrología multiversal detectando divergencia cósmica vía análisis de muones, con electrónica de alta tensión y análisis criptográfico/estadístico.",
    techStack: ['Electrónica Alta Tensión', 'Metrología Cuántica', 'Análisis Estadístico', 'Sensores'],
    metrics: "Electrónica de alta tensión custom · Análisis estadístico avanzado",
    status: "Planeado",
    githubLink: "https://github.com/Javier/mdfc-alpha"
  },
  {
    title: "MARVIER-1: Simulante de Regolito Marciano",
    category: "Ciencias Planetarias & Geoquímica",
    filterGroup: "Aeroespacial",
    icon: Mountain,
    description: "Desarrollo de simulante de regolito marciano de bajo coste para pruebas ISRU, con configuraciones química, geológica y balanceada.",
    techStack: ['Geoquímica', 'ISRU', 'Metodología Científica', 'Ciencia de Materiales'],
    metrics: "3 configuraciones de simulante · Bajo coste para pruebas ISRU",
    status: "En Proceso",
    githubLink: "https://github.com/Javier/marvier-1"
  },
  {
    title: "Procesador Cuántico de 2 Qubits basado en RMN",
    category: "Computación Cuántica & Hardware",
    filterGroup: "Hardware",
    icon: Atom,
    description: "Procesador cuántico de 2 qubits a temperatura ambiente usando RMN con imanes de neodimio y detección de acoplamiento J, en bajo presupuesto.",
    techStack: ['Computación Cuántica', 'Espectroscopía RMN', 'Diseño de Hardware', 'Física Analítica'],
    metrics: "2 qubits a temperatura ambiente · Presupuesto mínimo",
    status: "Planeado",
    githubLink: "https://github.com/Javier/quantum-processor"
  },
  {
    title: "Agujero Negro Análogo en un Chip",
    category: "Física Teórica & Electrónica",
    filterGroup: "Física",
    icon: Aperture,
    description: "Agujero negro análogo usando Línea de Transmisión No Lineal (NLTL) en PCB para estudiar horizonte de eventos, radiación Hawking y superradiancia.",
    techStack: ['Gravedad Análoga', 'Diseño de PCBs (NLTL)', 'Electrónica No Lineal', 'Física Teórica'],
    metrics: "Simulación de radiación Hawking analógica · PCB NLTL custom",
    status: "Planeado",
    githubLink: "https://github.com/Javier/blackhole-analog"
  },
  {
    title: "Universo en un Chip",
    category: "Metamateriales & Cosmología",
    filterGroup: "Física",
    icon: Microchip,
    description: "Realización física de micro-universos en estado sólido usando metamateriales y redes de calibración para simular fuerzas fundamentales y campos topológicos.",
    techStack: ['Metamateriales', 'Teoría de Campos (Lattice)', 'Electromagnetismo', 'Materia Condensada'],
    metrics: "Simulación de fuerzas fundamentales en estado sólido",
    status: "Planeado",
    githubLink: "https://github.com/Javier/universe-chip"
  },
  {
    title: "Catálogo de Minerales Avanzado (PWA Offline-First)",
    category: "Ingeniería Web Avanzada",
    filterGroup: "Software & IA",
    icon: Wifi,
    description: "PWA para gestión de colecciones de minerales con arquitectura offline-first, sincronización en Firebase y generación de QR/PDF.",
    techStack: ['PWA / Service Workers', 'IndexedDB', 'Firebase', 'Arquitectura Offline-First'],
    metrics: "Arquitectura offline-first · Sync Firebase · Generación QR/PDF",
    status: "Terminado",
    githubLink: "https://github.com/Javier/mineral-catalog"
  },
  {
    title: "Análisis de Levitación Magnética y Superconductores",
    category: "Ciencia de Materiales",
    filterGroup: "Física",
    icon: Magnet,
    description: "Investigación sobre levitación magnética minimalista y superconductores a temperatura ambiente, analizando avances hasta 2026 y materiales como LK-99.",
    techStack: ['Electromagnetismo', 'Física del Estado Sólido', 'Análisis Tecnológico'],
    metrics: "Análisis comparativo de materiales superconductores",
    status: "Planeado",
    githubLink: "https://github.com/Javier/levitation-research"
  },
  {
    title: "Espectrometría de Resonancia Magnética Nuclear (EFNMR)",
    category: "Física Experimental & Hardware",
    filterGroup: "Hardware",
    icon: Atom,
    description: "Configuración de bajo coste para EFNMR usando campo terrestre, con pre-polarización y detección en rango de audiofrecuencia.",
    techStack: ['Espectroscopía RMN', 'Diseño de Hardware', 'Física Analítica', 'Electrónica de Audio'],
    metrics: "Detección en audiofrecuencia · Pre-polarización custom",
    status: "Planeado",
    githubLink: "https://github.com/Javier/efnmr-spectrometer"
  }
];

// Componente Terminal Bio
const CodeSnippetBio = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("contacto@javier.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#050505] border border-white/[0.08] overflow-hidden font-mono text-sm shadow-2xl relative group">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0a0a0a]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
        <span className="text-xs text-zinc-500">perfil.ts</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group/copy"
        >
          <span className={`text-[10px] font-medium overflow-hidden transition-all duration-300 whitespace-nowrap max-w-0 group-hover/copy:max-w-[100px] ${copied ? 'text-green-400' : ''}`}>
            {copied ? '¡Copiado!' : 'Copiar Email'}
          </span>
          {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-6 text-zinc-400 leading-relaxed overflow-x-auto">
        <p><span className="text-purple-400">const</span> <span className="text-blue-400">engineer</span> <span className="text-white">=</span> {'{'}</p>
        <p className="pl-4">name: <span className="text-emerald-400">'Javier'</span>,</p>
        <p className="pl-4">role: <span className="text-emerald-400">'Software & Systems Engineer'</span>,</p>
        <p className="pl-4">focus: [<span className="text-emerald-400">'Architecture'</span>, <span className="text-emerald-400">'Performance'</span>, <span className="text-emerald-400">'Scalability'</span>],</p>
        <p className="pl-4">email: <span className="text-emerald-400">'contacto@javier.dev'</span>,</p>
        <p className="pl-4">solve: <span className="text-purple-400">function</span>(problem: <span className="text-yellow-400">Problem</span>) {'{'}</p>
        <p className="pl-8"><span className="text-purple-400">return</span> <span className="text-red-400">this</span>.analyze(problem).<span className="text-blue-400">buildRobustSolution</span>();</p>
        <p className="pl-4">{'}'}</p>
        <p>{'};'}</p>
      </div>
    </div>
  );
};

// --- APLICACIÓN PRINCIPAL ---
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPlanned, setShowPlanned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | sent | error

  // Navbar Visibility Logic
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(`${(currentScrollY / windowHeight) * 100}%`);

      // Show navbar if at the very top
      if (currentScrollY < 50) {
        setNavVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        return;
      }

      // Hide on scroll down, Show on scroll up
      if (currentScrollY > lastScrollY.current) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentScrollY;

      // Inactivity hiding (only if not at top and menu is closed)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (!mobileMenuOpen) {
        scrollTimeout.current = setTimeout(() => {
          if (window.scrollY > 100) setNavVisible(false);
        }, 2500);
      }
    };

    const handleMouseMove = (e) => {
      // Show navbar if mouse is near the top (e.g., top 80px)
      if (e.clientY < 80) {
        setNavVisible(true);
        // Reset inactivity timer when hovering the top zone
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        if (!mobileMenuOpen) {
          scrollTimeout.current = setTimeout(() => {
            if (window.scrollY > 100) setNavVisible(false);
          }, 3000); // Slightly longer timeout when triggered by mouse
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [mobileMenuOpen]);

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Robust detection: the section in the center of the viewport is the active one
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-45% 0px -45% 0px'
      }
    );
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  // Filter + search logic
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchesFilter = activeFilter === 'Todos' || p.filterGroup === activeFilter;
      const matchesSearch = searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const activeProjects = filteredProjects.filter(p => p.status === 'Terminado' || p.status === 'En Proceso');
  const plannedProjects = filteredProjects.filter(p => p.status === 'Planeado');

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id); // Immediate feedback
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const formData = new FormData(e.target);
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setFormStatus('sent'); e.target.reset(); }
      else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  const navLinks = [
    { id: 'about', label: 'Perfil' },
    { id: 'experience', label: 'Trayectoria' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden relative">
      {/* Textura de ruido premium */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Barra de progreso de lectura */}
      <div className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-emerald-400 z-[60] transition-all duration-150 ease-out" style={{ width: scrollProgress }}></div>

      <ParticleNetworkCanvas />

      {/* NAVBAR */}
      <div className={`
        fixed w-full top-6 z-50 px-4 flex justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform
        ${navVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-32'}
      `}>
        <LiquidContainer Element="nav" className={`
          flex items-center transition-all duration-500 ease-in-out liquid-glass
          bg-[#0a0a0a]/80 backdrop-blur-[40px]
          ${(navVisible || mobileMenuOpen) ? 'nav-visible' : ''}
          ${mobileMenuOpen ? 'rounded-3xl px-8 py-5 w-full max-w-sm' : 'rounded-full px-4 md:px-6 py-2 md:py-3 w-fit'}
        `}>
          {/* Logo - Hidden when menu is open on mobile to focus on the island feel */}
          <a href="#" className={`font-semibold text-lg text-white tracking-tight hover:opacity-80 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-95 pointer-events-none w-0' : 'opacity-100 scale-100'}`}>
            Javier<span className="text-blue-500">.</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center">
            <div className="h-4 w-px bg-white/10 mx-6"></div>
            <div className="flex gap-8 text-sm font-medium text-zinc-400">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`transition-colors relative py-1 ${activeSection === link.id ? 'text-white' : 'hover:text-white'}`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-500 rounded-full animate-in fade-in zoom-in duration-300" />
                  )}
                </a>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10 mx-6"></div>
            <div className="flex items-center gap-5">
              <a href="https://linkedin.com/in/javier" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-400 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com/Javitax47" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle - Centered when open */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              md:hidden flex items-center gap-2 transition-all duration-300 focus:outline-none active:outline-none
              ${mobileMenuOpen ? 'w-full justify-between' : 'ml-3 md:ml-4 p-0.5 md:p-1'}
            `}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen && (
              <span className="text-sm font-mono tracking-widest uppercase text-zinc-500 animate-in fade-in slide-in-from-left-4 duration-500">Navegación</span>
            )}
            <div className={`p-1.5 md:p-2 rounded-full transition-colors ${mobileMenuOpen ? 'bg-white/5 text-white' : 'text-zinc-400 hover:text-white'}`}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </div>
          </button>
        </LiquidContainer>
      </div>

      {/* PREMIUM MOBILE OVERLAY MENU */}
      <div className={`
        fixed inset-0 z-[45] md:hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${mobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}
      `}>
        {/* Extreme Blur Background */}
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[40px]" onClick={() => setMobileMenuOpen(false)} />

        {/* Dynamic Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center px-8">
          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="group relative flex items-center justify-center w-full py-4 overflow-hidden"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className={`
                  text-4xl font-bold tracking-tight transition-all duration-500
                  ${activeSection === link.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'}
                  ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                  {link.label}
                </span>
                {activeSection === link.id && (
                  <span className="absolute bottom-2 w-12 h-[2px] bg-blue-500 rounded-full animate-in zoom-in duration-500" />
                )}
              </a>
            ))}

            <div className={`
              w-full h-px bg-white/5 my-4 transition-all duration-1000 delay-300
              ${mobileMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `}></div>

            <div className={`
              flex justify-center gap-8 transition-all duration-700 delay-400
              ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}>
              <a href="https://linkedin.com/in/javier" className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-blue-400 transition-all hover:scale-110">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Javitax47" className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Github size={24} />
              </a>
            </div>

            <p className={`
              mt-12 text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-600 transition-all duration-700 delay-500
              ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}
            `}>
              Systems Engineering &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <main className="relative z-10 lg:pl-12 max-w-6xl mx-auto px-6 pt-32 pb-20">

        {/* HERO SECTION */}
        <section className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] text-zinc-300 rounded-full text-xs font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                Buscando nuevos retos
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-white leading-[1.05] mb-8">
                Ingeniería de software para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-200">sistemas críticos.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="max-w-xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-10">
                Diseño arquitecturas escalables y desarrollo soluciones full-stack donde el rendimiento, la seguridad y la ciencia convergen.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a href="#projects" className="inline-flex items-center justify-center font-medium text-sm text-[#050505] bg-white px-8 py-4 rounded-xl transition-all hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    Explorar Trabajo
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#" className="inline-flex items-center justify-center gap-2 font-medium text-sm text-zinc-300 hover:text-white px-8 py-4 border border-white/10 hover:border-white/20 rounded-xl transition-all bg-white/[0.02] backdrop-blur-sm">
                    <FileText size={16} /> Descargar CV
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <Reveal delay={400}>
              <CodeSnippetBio />
            </Reveal>
          </div>
        </section>

        {/* SKILLS: BENTO GRID — Now appears FIRST (Software/IA emphasis) */}
        <section id="about" className="py-24 border-t border-white/[0.05]">
          <Reveal>
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Core Competencies</h2>
              <p className="text-zinc-400 font-light text-lg">
                Perfil técnico multidisciplinar operando en la intersección entre el software avanzado, el hardware físico y la investigación científica.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Bloque 1: Software & Sistemas */}
            <Reveal delay={0} className="md:col-span-2">
              <LiquidContainer className="p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/20 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Terminal className="text-blue-400" size={24} />
                    <h3 className="text-lg font-medium text-white">Software & Sistemas Críticos</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Rust (Advanced)', 'C++20', 'TypeScript', 'React / Next.js', 'Tailwind CSS', 'Firebase', 'PWA / IndexedDB'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </LiquidContainer>
            </Reveal>

            {/* Bloque 2: IA & HPC */}
            <Reveal delay={100} className="md:col-span-2">
              <LiquidContainer className="p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/20 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-medium text-white">IA & HPC</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['PyTorch / JAX', 'CUDA (C++)', 'Optimizadores Evolutivos', 'Transformers', 'Reinforcement Learning', 'Sistemas de Control'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </LiquidContainer>
            </Reveal>

            {/* Bloque 3: Hardware */}
            <Reveal delay={200} className="md:col-span-2">
              <LiquidContainer className="p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/20 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-medium text-white">Hardware & Física Experimental</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['SkyWater 130nm (VLSI)', 'Custom PCB Design', 'Sistemas Peltier', 'Analog Mixed-Signal', 'NMR Hardware', 'Metrología Cuántica'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </LiquidContainer>
            </Reveal>

            {/* Bloque 4: Ingeniería Avanzada */}
            <Reveal delay={300} className="md:col-span-2">
              <LiquidContainer className="p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/20 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Orbit className="text-orange-400" size={24} />
                    <h3 className="text-lg font-medium text-white">Ingeniería Avanzada & Modelado</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Mecánica Orbital', 'Optimización (SciPy)', 'Química Computacional', 'NLTL Electronics', 'Cálculo Tensorial', 'Termohidráulica'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </LiquidContainer>
            </Reveal>
          </div>
        </section>

        {/* TRAYECTORIA / EXPERIENCE TIMELINE */}
        <section id="experience" className="py-24 border-t border-white/[0.05]">
          <Reveal>
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Trayectoria</h2>
              <p className="text-zinc-400 font-light text-lg">Historial de mi evolución académica y desarrollo de proyectos en el ámbito de la ingeniería y el software.</p>
            </div>
          </Reveal>

          <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-8">

            {/* Item 1: UPV */}
            <Reveal delay={0}>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-[#050505] border-2 border-blue-500 rounded-full -left-[8.5px] top-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Grado en Tecnologías Interactivas</h3>
                  <span className="text-sm font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">2022 - 2027 (Esp.)</span>
                </div>
                <h4 className="text-zinc-300 font-medium mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-blue-400" /> Universitat Politècnica de València (UPV)</h4>
                <p className="text-zinc-400 font-light leading-relaxed max-w-3xl">
                  Especialización en programación y desarrollo web Full Stack. Diseño e implementación de múltiples proyectos interactivos combinando software y hardware.
                  Destaca la obtención de <strong>Matrícula de Honor</strong> en la asignatura de Programación 1.
                </p>
              </div>
            </Reveal>

            {/* Item 2: Erasmus Austria */}
            <Reveal delay={100}>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-3 h-3 bg-zinc-600 rounded-full -left-[6px] top-2"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Programa Erasmus+ y Estancia de Investigación</h3>
                  <span className="text-sm font-mono text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">Feb 2025 - Jun 2025</span>
                </div>
                <h4 className="text-zinc-300 font-medium mb-4 flex items-center gap-2"><Globe size={16} /> TU Graz & UniGraz (Austria)</h4>
                <p className="text-zinc-400 font-light leading-relaxed max-w-3xl">
                  Inmersión internacional cursando materias avanzadas en Inteligencia Computacional y Física Técnica.
                  Desarrollo del proyecto interdisciplinar de planificación de misión espacial al sistema <strong>TRAPPIST-1</strong> y creación del motor de optimización de parámetros <strong>Legacy</strong>. Obtención de certificación en idioma alemán (A1).
                </p>
              </div>
            </Reveal>

            {/* Item 3: Bachillerato */}
            <Reveal delay={200}>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-3 h-3 bg-zinc-700 rounded-full -left-[6px] top-2"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Bachillerato Científico</h3>
                  <span className="text-sm font-mono text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">2020 - 2022</span>
                </div>
                <h4 className="text-zinc-400 font-medium mb-4 flex items-center gap-2"><Code2 size={16} /> IES Tirant Lo Blanc, Gandía</h4>
                <p className="text-zinc-500 font-light leading-relaxed max-w-3xl">
                  Formación base en ciencias exactas, matemáticas y física, estableciendo los fundamentos analíticos para el posterior desarrollo en la ingeniería de software y computación.
                </p>
              </div>
            </Reveal>

          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 border-t border-white/[0.05]">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Proyectos & Publicaciones Destacadas</h2>
              <p className="text-zinc-400 font-light text-lg">
                Investigación aplicada, desarrollo de hardware experimental y soluciones de software diseñadas desde la arquitectura conceptual hasta su implementación empírica.
              </p>
            </div>
          </Reveal>

          {/* FILTER PILLS + SEARCH */}
          <Reveal delay={100}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
              <div className="flex gap-2 overflow-x-auto filter-scroll pb-2 md:pb-0">
                {FILTER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all duration-300 ${activeFilter === cat
                      ? 'bg-white text-[#050505] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white backdrop-blur-md'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative md:ml-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 pr-4 py-2.5 rounded-full text-sm w-full md:w-64 bg-[#0a0a0e] border-white/[0.08]"
                />
              </div>
            </div>
          </Reveal>

          {/* Resultado count */}
          <div className="mb-6">
            <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase">
              {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* CONTENEDOR DE PROYECTOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {activeProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 50}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
          </div>

          {/* SECCIÓN DESPLEGABLE: PLANEADOS */}
          <div className="mt-16">
            <button
              onClick={() => setShowPlanned(!showPlanned)}
              className="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${showPlanned ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-[#0a0a0a] text-zinc-500 border-white/[0.05]'} border transition-all duration-300`}>
                  <Blocks size={22} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Iniciativas en Fase de Planificación</h3>
                  <p className="text-sm text-zinc-500 font-light">Explorar conceptos, investigación y futuros desarrollos ({plannedProjects.length} proyectos adicionales)</p>
                </div>
              </div>
              <div className="text-zinc-500 group-hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10">
                {showPlanned ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {showPlanned && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {plannedProjects.map((project, index) => (
                  <Reveal key={project.title} delay={index * 50}>
                    <ProjectCard {...project} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24">
          <Reveal>
            <LiquidContainer className="relative rounded-[2rem] p-8 md:p-16 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <Shield className="w-10 h-10 text-zinc-500 mx-auto mb-6 opacity-50" strokeWidth={1} />
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                    Iniciemos una <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">conversación.</span>
                  </h2>
                  <p className="text-base text-zinc-400 font-light max-w-xl mx-auto">
                    Ya sea para una posición full-time, consultoría de arquitectura o simplemente hablar de tecnología.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Contact Form */}
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 h-full">
                    <input name="name" type="text" required placeholder="Tu nombre" className="form-input" />
                    <input name="email" type="email" required placeholder="tu@email.com" className="form-input" />
                    <textarea name="message" required rows={5} placeholder="Cuéntame sobre tu proyecto o propuesta..." className="form-input resize-none" />
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className={`flex items-center justify-center gap-2 font-medium text-sm px-8 py-4 rounded-xl transition-all mt-auto ${formStatus === 'sent'
                        ? 'bg-emerald-500 text-white'
                        : formStatus === 'error'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white text-[#050505] hover:bg-zinc-200 shadow-lg'
                        }`}
                    >
                      {formStatus === 'sending' && <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
                      {formStatus === 'sent' && <><CheckCircle2 size={16} /> ¡Mensaje enviado!</>}
                      {formStatus === 'error' && <>Error, intenta de nuevo</>}
                      {formStatus === 'idle' && <><Send size={16} /> Enviar Mensaje</>}
                    </button>
                  </form>

                  {/* Social Links & CV */}
                  <div className="flex flex-col gap-4 h-full">
                    <a href="mailto:contacto@javier.dev" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all group">
                      <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400"><Mail size={18} /></div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-white">Email</p>
                        <p className="text-xs text-zinc-500">contacto@javier.dev</p>
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </a>
                    <a href="https://github.com/Javitax47" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all group">
                      <div className="p-2.5 bg-zinc-500/10 rounded-lg text-zinc-300"><Github size={18} /></div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-white">GitHub</p>
                        <p className="text-xs text-zinc-500">github.com/Javitax47</p>
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </a>
                    <a href="https://linkedin.com/in/javier" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all group">
                      <div className="p-2.5 bg-blue-600/10 rounded-lg text-blue-400"><Linkedin size={18} /></div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-white">LinkedIn</p>
                        <p className="text-xs text-zinc-500">linkedin.com/in/javier</p>
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </a>
                    <a href="#" download className="flex items-center justify-center gap-2 font-medium text-sm text-zinc-300 bg-white/[0.03] border border-white/[0.1] px-8 py-4 rounded-xl hover:bg-white/[0.08] transition-all mt-auto">
                      <Download size={16} /> Descargar CV (PDF)
                    </a>
                  </div>
                </div>
              </div>
            </LiquidContainer>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] bg-[#020202]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-semibold text-lg text-white tracking-tight">Javier<span className="text-blue-500">.</span></span>
            <p className="text-zinc-600 text-sm font-light">
              &copy; {new Date().getFullYear()} Ingeniería y Desarrollo de Software.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-full">
            <span className="flex relative w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400">Estado: Activamente buscando oportunidades</span>
          </div>
        </div>
      </footer>
    </div>
  );
}