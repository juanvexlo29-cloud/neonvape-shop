import { useEffect, useRef } from "react";

/**
 * Hero — Neon · NeonVape
 * Stack : React (Vite) · Tailwind CSS v4
 */
export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Forzamos el play por si el navegador se pone estricto
    v.play().catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&display=swap');

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-stagger > * {
          animation: riseIn 1.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hero-stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .hero-stagger > *:nth-child(2) { animation-delay: 0.20s; }
        .hero-stagger > *:nth-child(3) { animation-delay: 0.38s; }
        .hero-stagger > *:nth-child(4) { animation-delay: 0.52s; }
      `}</style>

      {/* SOLUCIÓN 1: bg-[#030308] evita el pantallazo blanco mientras carga el video */}
      <section className="relative h-screen w-full overflow-hidden bg-[#030308]">

        {/* ── 1. VIDEO BACKGROUND ── */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          src="https://res.cloudinary.com/djbcgcmma/video/upload/f_auto,q_auto/v1778307222/Video_Project_11_1_svmkig.mp4"
          autoPlay
          loop
          muted
          defaultMuted /* SOLUCIÓN 2: Obligatorio en React para garantizar Autoplay */
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* ── 2. OVERLAY INTELIGENTE (Mucho más transparente) ── */}
        {/* SOLUCIÓN 3: Reducimos la oscuridad al final para que el video brille */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom," +
              "rgba(0,0,0,0) 0%,"  +
              "rgba(0,0,0,0.1) 50%," +
              "rgba(0,0,0,0.4) 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── 3. CONTENIDO PRINCIPAL ── */}
        <div className="relative z-10 flex h-full items-center">
          <div className="hero-stagger mx-auto w-full max-w-368 px-6 pt-36 sm:px-10 lg:px-20">

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(0.7rem, 1vw, 1rem)",
                fontWeight: 700,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.95)",
                marginBottom: "clamp(1rem, 2vw, 1.6rem)",
                textShadow: "0px 2px 10px rgba(0,0,0,0.5)", // Sombra para legibilidad
              }}
            >
              NeonVape &nbsp;·&nbsp; Neon
            </p>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "clamp(2.6rem, 7vw, 7.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: "24ch",
                textShadow: "0px 4px 20px rgba(0,0,0,0.6)", // Sombra para legibilidad
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.95)" }}>
                Vapers en Colombia:{" "}
              </span>

              <span
                style={{
                  background:
                    "linear-gradient(135deg," +
                    "#7A5B10 0%,"  +
                    "#D4AF37 25%," +
                    "#F3E5AB 52%," +
                    "#D4AF37 76%," +
                    "#9A6F18 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: "drop-shadow(0px 4px 15px rgba(0,0,0,0.4))", // Sombra especial para texto con degradado
                }}
              >
                somos la tienda #1 de vapeo.
              </span>
            </h1>

            <div
              style={{
                width: "clamp(2.5rem, 5vw, 4rem)",
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(212,175,55,0.75), rgba(212,175,55,0))",
                margin: "clamp(1.4rem, 2.5vw, 2rem) 0",
              }}
              aria-hidden="true"
            />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.8vw, 1.65rem)",
                lineHeight: 1.6,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.8)", // Más brillante
                maxWidth: "42ch",
                textShadow: "0px 2px 10px rgba(0,0,0,0.6)", // Sombra para legibilidad
              }}
            >
              Calidad y servicio insuperable.{" "}
              <span
                style={{
                  color: "rgba(212,175,55,0.9)", // Toque dorado en la frase final
                  fontStyle: "normal",
                  fontWeight: 600,
                }}
              >
                Tu experiencia premium definitiva.
              </span>
            </p>

          </div>
        </div>

      </section>
    </>
  );
}
