import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  // Categoría: Software & Tech
  Terminal,
  Blocks,
  Database,
  Binary,
  Code2,
  Wifi, // Para la PWA Offline-First

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
  FileText, // Para el TFG/Paper

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

  // Otros (Faltantes)
  CheckCircle2,
  Copy,
  Briefcase,
  GraduationCap,
  Shield
} from 'lucide-react';

// --- HOOKS PERSONALIZADOS ---

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
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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

// --- COMPONENTES VISUALES ---

// Fondo de Partículas (Optimizado)
const ParticleNetworkCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const config = { particleCount: 70, connectionDistance: 150, mouseRepulsion: 200, baseSpeed: 0.15 };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.baseSpeed, vy: (Math.random() - 0.5) * config.baseSpeed,
          radius: Math.random() * 1.5 + 0.5, baseAlpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        let dx = mouseRef.current.x - p.x; let dy = mouseRef.current.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRepulsion) {
          let force = (config.mouseRepulsion - dist) / config.mouseRepulsion;
          p.x -= (dx / dist) * force * 0.5; p.y -= (dy / dist) * force * 0.5;
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha})`; ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist2 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist2 < config.connectionDistance) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - (dist2 / config.connectionDistance)) * 0.1})`;
            ctx.lineWidth = 0.6; ctx.stroke();
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
      window.removeEventListener('resize', resizeCanvas); window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave); cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Tarjeta con efecto Spotlight
const ProjectCard = ({ title, category, icon: Icon, description, techStack, githubLink, liveLink, status }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  const getStatusColor = (s) => {
    switch (s) {
      case 'Terminado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'En Proceso': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Planeado': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} className="group relative flex flex-col h-full bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl">
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.15), transparent 40%)` }} />
      <div className="relative flex flex-col h-full m-[1px] bg-[#0c0c0e] rounded-[15px] p-8 z-10">
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[15px]" style={{ background: `radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.03), transparent 40%)` }} />
        <div className="relative z-20 flex-grow">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-2">
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05] text-zinc-400 group-hover:text-blue-400 transition-colors shadow-inner">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              {status && (
                <span className={`text-[9px] h-fit font-mono tracking-widest uppercase px-2 py-0.5 rounded-md border ${getStatusColor(status)}`}>
                  {status}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-white/[0.02] text-zinc-400 rounded-full border border-white/[0.05]">
              {category}
            </span>
          </div>
          <h4 className="text-xl font-semibold text-zinc-100 mb-3 tracking-tight group-hover:text-white transition-colors">{title}</h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-light mb-8">{description}</p>
        </div>
        <div className="relative z-20 mt-auto border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-1 bg-[#050505] text-zinc-500 border border-white/[0.05] rounded-md">{tech}</span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            {githubLink && githubLink !== "#" && <a href={githubLink} className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"><Github size={16} className="mr-2" /> Repositorio</a>}
            {liveLink && liveLink !== "#" && <a href={liveLink} className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Ver Detalles <ExternalLink size={16} className="ml-1" /></a>}
          </div>
        </div>
      </div>
    </div>
  );
};

const PROJECTS = [
  {
    title: "Detección y Caracterización de Ondas Gravitacionales",
    category: "Deep Learning & Astrofísica",
    icon: Network,
    description: "Entrenamiento y comparación de IAs (2D-CNN y Transformers) para identificación y caracterización de colisiones de agujeros negros en ondas gravitacionales, con interfaz web user-friendly. Incluye análisis comparativo entre 1D-ResNet y Transformers, regresión para estimación de parámetros astrofísicos y técnicas de XAI.",
    techStack: ['Deep Learning', 'Vision Transformers', 'Procesamiento de Señales', 'PyTorch', 'UI/UX', 'Astrofísica Computacional'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/gravity-waves-detection"
  },
  {
    title: "Solver Espacio-Temporal Verificador de Métricas Originales",
    category: "Computación Científica & Física",
    icon: Activity,
    description: "Solver en Python (Google Colab) para verificar, resolver numéricamente y probar métricas espacio-temporales originales de Relatividad General, con pruebas de estrés y cálculo tensorial.",
    techStack: ['Python', 'Relatividad General', 'Cálculo Tensorial', 'Métodos Numéricos'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/spacetime-solver"
  },
  {
    title: "Cámara de Niebla con Enfriamiento Peltier",
    category: "Hardware & Física de Partículas",
    icon: Cpu,
    description: "Cámara de niebla mediante placas Peltier con cronómetro y alarma para ciclos térmicos, diseñado y soldado en una PCB personalizada para detección de partículas.",
    techStack: ['Diseño PCB', 'Soldadura', 'Termodinámica', 'Física de Partículas'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/cloud-chamber"
  },
  {
    title: "App Kit para Simulación de Cascadas de Rayos Cósmicos",
    category: "Física Computacional",
    icon: Layers,
    description: "User-friendly app kit para simular cascadas de rayos cósmicos integrando CORSIKA, con GUI interactiva para modelado y ejecución de simulaciones complejas.",
    techStack: ['Integración CORSIKA', 'GUI Dev', 'Física de Astropartículas'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/cosmic-rays-simulator"
  },
  {
    title: "Simulador/Visualizador de Explosiones",
    category: "VFX & Dinámica de Fluidos",
    icon: Sparkles,
    description: "Simulador y visualizador de explosiones de diferentes tipos y tonos, modelando propagación de fluidos, partículas y refracciones basadas en composición química.",
    techStack: ['Computación Gráfica (VFX)', 'Simulación de Fluidos', 'Matemáticas de Renderizado'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/explosions-simulator"
  },
  {
    title: "Simulador de Reacciones Químicas y Predicción de Elementos",
    category: "Química Computacional & Algoritmia",
    icon: FlaskConical,
    description: "Simulador de reacciones químicas a partir de reactivos, con predicción de características de nuevos elementos y sus reacciones con elementos y moléculas existentes.",
    techStack: ['Química Computacional', 'Diseño de Algoritmos', 'Estructuras de Datos'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/chemistry-simulator"
  },
  {
    title: "Bot de Arbitraje MEV",
    category: "DeFi, Rust & Análisis Formal",
    icon: Bot,
    description: "Bot de arbitraje MEV explotando nichos desaprovechados en tokens con impuestos complejos, liquidez media y nuevos, usando Rust y Z3 para rutas rentables.",
    techStack: ['Rust', 'Web3 / Smart Contracts', 'Z3 Theorem Prover', 'Algoritmos HFT'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/mev-bot"
  },
  {
    title: "Misión de Exploración a Trappist-1 y Motor de Optimización",
    category: "Ingeniería Aeroespacial",
    icon: Orbit,
    description: "Plan detallado para misión de exploración espacial a Trappist-1, con motor de optimización para determinar características de la nave, incluyendo mecánica orbital y propulsión.",
    techStack: ['Mecánica Orbital', 'Optimización', 'Ingeniería Aeroespacial', 'Física de Plasma'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/trappist-mission"
  },
  {
    title: "Videojuego de Exploración Espacial (Proyecto Cosmos)",
    category: "Simulación & Unity3D",
    icon: Globe,
    description: "Videojuego de exploración espacial con universo a escala real, transiciones sin costuras en Unity, simulación geológica de escala planetaria y más de 80 tipos de formaciones geológicas únicas, usando Compute Shaders y origen flotante.",
    techStack: ['Unity3D', 'Compute Shaders', 'Generación Procedimental', 'Matemáticas 3D', 'Geofísica'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/cosmos-project"
  },
  {
    title: "Proyecto Diophantus",
    category: "Matemáticas Computacionales",
    icon: Sigma,
    description: "Herramienta que compila algoritmos en C en polinomios de Ecuaciones Diofánticas basadas en el Teorema MRDP, transformando lógica dinámica en verdades matemáticas estáticas.",
    techStack: ['Matemáticas Computacionales', 'Diseño de Algoritmos', 'Resolución de Problemas'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/diophantus"
  },
  {
    title: "Proyecto AURA Pin",
    category: "Sistemas Embebidos & Edge AI",
    icon: Cpu,
    description: "Ecosistema modular de captura contextual (audio/vídeo) con privacidad por diseño, procesamiento local y esquemáticos electrónicos para el wearable Aura Capture Pin.",
    techStack: ['Diseño de Esquemáticos', 'Sistemas Embebidos', 'Edge AI', 'Criptografía'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/aura-pin"
  },
  {
    title: "Spike-101: Núcleo Neuromórfico Open-Source",
    category: "Microelectrónica Analógica",
    icon: Zap,
    description: "Diseño a nivel de transistor de un núcleo neuromórfico analógico de señal mixta para Spiking Neural Networks (SNN), usando SkyWater 130nm PDK.",
    techStack: ['VLSI (SkyWater 130nm)', 'Computación Neuromórfica', 'Diseño Analógico', 'SNN'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/spike-101"
  },
  {
    title: "Modelo Escala de Central Nuclear Funcional (PWR)",
    category: "Termohidráulica & Mecatrónica",
    icon: Flame,
    description: "Modelo a escala funcional de Reactor de Agua a Presión (PWR) que ejecuta procesos termodinámicos reales para generar vapor y electricidad, sin material fisible.",
    techStack: ['Termohidráulica', 'Mecatrónica', 'Ciencia de Materiales', 'Sistemas de Control'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/nuclear-model"
  },
  {
    title: "MDFC-Alpha: Medidor de Divergencia de Flujo Cósmico",
    category: "Física Experimental & Estadística",
    icon: Radar,
    description: "Instrumento para metrología multiversal detectando divergencia cósmica vía análisis de muones, con electrónica de alta tensión y análisis criptográfico/estadístico.",
    techStack: ['Electrónica Alta Tensión', 'Metrología Cuántica', 'Análisis Estadístico', 'Sensores'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/mdfc-alpha"
  },
  {
    title: "MARVIER-1: Simulante de Regolito Marciano",
    category: "Ciencias Planetarias & Geoquímica",
    icon: Mountain,
    description: "Desarrollo de simulante de regolito marciano de bajo coste para pruebas ISRU, con configuraciones química, geológica y balanceada.",
    techStack: ['Geoquímica', 'ISRU', 'Metodología Científica', 'Ciencia de Materiales'],
    status: "En Proceso",
    githubLink: "https://github.com/Javier/marvier-1"
  },
  {
    title: "Procesador Cuántico de 2 Qubits basado en RMN",
    category: "Computación Cuántica & Hardware",
    icon: Atom,
    description: "Procesador cuántico de 2 qubits a temperatura ambiente usando RMN con imanes de neodimio y detección de acoplamiento J, en bajo presupuesto.",
    techStack: ['Computación Cuántica', 'Espectroscopía RMN', 'Diseño de Hardware', 'Física Analítica'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/quantum-processor"
  },
  {
    title: "Agujero Negro Análogo en un Chip",
    category: "Física Teórica & Electrónica",
    icon: Aperture,
    description: "Agujero negro análogo usando Línea de Transmisión No Lineal (NLTL) en PCB para estudiar horizonte de eventos, radiación Hawking y superradiancia.",
    techStack: ['Gravedad Análoga', 'Diseño de PCBs (NLTL)', 'Electrónica No Lineal', 'Física Teórica'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/blackhole-analog"
  },
  {
    title: "Universo en un Chip",
    category: "Metamateriales & Cosmología",
    icon: Microchip,
    description: "Realización física de micro-universos en estado sólido usando metamateriales y redes de calibración para simular fuerzas fundamentales y campos topológicos.",
    techStack: ['Metamateriales', 'Teoría de Campos (Lattice)', 'Electromagnetismo', 'Materia Condensada'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/universe-chip"
  },
  {
    title: "Catálogo de Minerales Avanzado (PWA Offline-First)",
    category: "Ingeniería Web Avanzada",
    icon: Wifi,
    description: "PWA para gestión de colecciones de minerales con arquitectura offline-first, sincronización en Firebase y generación de QR/PDF.",
    techStack: ['PWA / Service Workers', 'IndexedDB', 'Firebase', 'Arquitectura Offline-First'],
    status: "Terminado",
    githubLink: "https://github.com/Javier/mineral-catalog"
  },
  {
    title: "Análisis de Levitación Magnética y Superconductores",
    category: "Ciencia de Materiales",
    icon: Magnet,
    description: "Investigación sobre levitación magnética minimalista y superconductores a temperatura ambiente, analizando avances hasta 2026 y materiales como LK-99.",
    techStack: ['Electromagnetismo', 'Física del Estado Sólido', 'Análisis Tecnológico'],
    status: "Planeado",
    githubLink: "https://github.com/Javier/levitation-research"
  },
  {
    title: "Espectrometría de Resonancia Magnética Nuclear (EFNMR)",
    category: "Física Experimental & Hardware",
    icon: Atom,
    description: "Configuración de bajo coste para EFNMR usando campo terrestre, con pre-polarización y detección en rango de audiofrecuencia.",
    techStack: ['Espectroscopía RMN', 'Diseño de Hardware', 'Física Analítica', 'Electrónica de Audio'],
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

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(`${(totalScroll / windowHeight) * 100}%`);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const finishedProjects = PROJECTS.filter(p => p.status === 'Terminado' || p.status === 'En Proceso');
  const plannedProjects = PROJECTS.filter(p => p.status === 'Planeado');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden relative">
      {/* Textura de ruido premium */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Barra de progreso de lectura */}
      <div className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-emerald-400 z-[60] transition-all duration-150 ease-out" style={{ width: scrollProgress }}></div>

      <ParticleNetworkCanvas />

      {/* NAVBAR */}
      <div className="fixed w-full top-6 z-50 px-6 flex justify-center">
        <nav className="bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/[0.08] rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl transition-all">
          <a href="#" className="font-semibold text-lg text-white tracking-tight hover:opacity-80 transition-opacity">
            Javier<span className="text-blue-500">.</span>
          </a>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">Perfil</a>
            <a href="#experience" className="hover:text-white transition-colors">Trayectoria</a>
            <a href="#projects" className="hover:text-white transition-colors">Proyectos</a>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex items-center">
            <a href="#contact" className="text-sm font-medium text-zinc-100 hover:text-blue-400 transition-colors flex items-center gap-2">
              <Mail size={14} /> Contactar
            </a>
          </div>
        </nav>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">

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

        {/* TRAYECTORIA / EXPERIENCE TIMELINE */}
        <section id="experience" className="py-24 border-t border-white/[0.05]">
          <Reveal>
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Trayectoria</h2>
              <p className="text-zinc-400 font-light text-lg">Historial de mi evolución profesional y académica en el mundo de la ingeniería y la ciencia.</p>
            </div>
          </Reveal>

          <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-8">
            {/* Item 1 */}
            <Reveal delay={0}>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-[#050505] border-2 border-blue-500 rounded-full -left-[8.5px] top-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Ingeniero de Software Senior</h3>
                  <span className="text-sm font-mono text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">2023 - Presente</span>
                </div>
                <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2"><Briefcase size={16} /> TechCorp Innovation</h4>
                <p className="text-zinc-400 font-light leading-relaxed max-w-3xl">
                  Liderazgo técnico en el diseño e implementación de microservicios en la nube. Optimización de bases de datos reduciendo la latencia de consultas complejas en un 40%. Mentoría de desarrolladores junior y establecimiento de directrices CI/CD.
                </p>
              </div>
            </Reveal>

            {/* Item 2 */}
            <Reveal delay={100}>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute w-3 h-3 bg-zinc-600 rounded-full -left-[6px] top-2"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Investigador - Física Computacional</h3>
                  <span className="text-sm font-mono text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">2021 - 2023</span>
                </div>
                <h4 className="text-zinc-300 font-medium mb-4 flex items-center gap-2"><GraduationCap size={16} /> Instituto de Astrofísica</h4>
                <p className="text-zinc-400 font-light leading-relaxed max-w-3xl">
                  Desarrollo de modelos predictivos usando redes neuronales convolucionales para el análisis de ondas gravitacionales. Reducción del tiempo de procesamiento de terabytes de datos de LIGO usando clusters HPC y PyTorch.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS: BENTO GRID REFINADO */}
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
              <div className="bg-[#0c0c0e] border border-white/[0.05] p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="text-blue-400" size={24} />
                  <h3 className="text-lg font-medium text-white">Software & Sistemas Críticos</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Rust (Advanced)', 'C++20', 'TypeScript', 'React / Next.js', 'Tailwind CSS', 'Firebase', 'PWA / IndexedDB'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#050505] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bloque 2: IA & Computación de Alto Rendimiento */}
            <Reveal delay={100} className="md:col-span-2">
              <div className="bg-[#0c0c0e] border border-white/[0.05] p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Network className="text-purple-400" size={24} />
                  <h3 className="text-lg font-medium text-white">IA & High-Performance Computing</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['PyTorch (CNNs/ViT)', 'Z3 Automated Reasoning', 'Signal Processing', 'CUDA / Compute Shaders', 'HPC Clusters', 'Análisis Formal'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#050505] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bloque 3: Física Experimental & Hardware */}
            <Reveal delay={200} className="md:col-span-2">
              <div className="bg-[#0c0c0e] border border-white/[0.05] p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Cpu className="text-emerald-400" size={24} />
                  <h3 className="text-lg font-medium text-white">Hardware & Física Experimental</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['SkyWater 130nm (VLSI)', 'Custom PCB Design', 'Sistemas Peltier', 'Analog Mixed-Signal', 'NMR Hardware', 'Metrología Cuántica'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#050505] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bloque 4: Ingeniería Avanzada & Matemáticas */}
            <Reveal delay={300} className="md:col-span-2">
              <div className="bg-[#0c0c0e] border border-white/[0.05] p-8 rounded-2xl h-full flex flex-col justify-center hover:border-white/[0.1] transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Orbit className="text-orange-400" size={24} />
                  <h3 className="text-lg font-medium text-white">Ingeniería Avanzada & Modelado</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Mecánica Orbital', 'Optimización (SciPy)', 'Química Computacional', 'NLTL Electronics', 'Cálculo Tensorial', 'Termohidráulica'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#050505] border border-white/[0.05] rounded-md text-sm text-zinc-300">{skill}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 border-t border-white/[0.05]">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Proyectos & Publicaciones Destacadas</h2>
              <p className="text-zinc-400 font-light text-lg">
                Investigación aplicada, desarrollo de hardware experimental y soluciones de software diseñadas desde la arquitectura conceptual hasta su implementación empírica.
              </p>
            </div>
          </Reveal>

          {/* CONTENEDOR DE PROYECTOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {finishedProjects.map((project, index) => (
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

        {/* CONTACT SECTION ULTRA PREMIUM */}
        <section id="contact" className="py-24">
          <Reveal>
            <div className="relative bg-gradient-to-b from-[#0c0c0e] to-[#050505] border border-white/[0.05] rounded-[2rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

              <div className="relative z-10">
                <Shield className="w-12 h-12 text-zinc-500 mx-auto mb-8 opacity-50" strokeWidth={1} />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                  Iniciemos una <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">conversación.</span>
                </h2>
                <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-12">
                  Ya sea para una posición full-time, consultoría de arquitectura o simplemente hablar de tecnología, mi bandeja de entrada está abierta.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Magnetic>
                    <a href="mailto:contacto@javier.dev" className="w-full sm:w-auto flex items-center justify-center gap-3 font-medium text-[#050505] bg-white px-10 py-4 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg">
                      <Mail size={18} /> contacto@javier.dev
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href="#" className="w-full sm:w-auto flex items-center justify-center gap-3 font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.1] px-10 py-4 rounded-xl hover:bg-white/[0.08] transition-colors">
                      <Github size={18} /> Perfil de GitHub
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
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