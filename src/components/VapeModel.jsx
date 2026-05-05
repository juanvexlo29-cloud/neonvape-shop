/**
 * VapeModel.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Componente 3D procedural para NeonVape — estilo "Cyberpunk Premium".
 * Renderiza un vape de altísima gama construido 100% con geometrías básicas
 * de Three.js y materiales hiperrealistas de @react-three/drei.
 *
 * DEPENDENCIAS REQUERIDAS:
 *   npm install three @react-three/fiber @react-three/drei
 *
 * USO:
 *   Importa este componente DENTRO de un <Canvas> que ya tenga luces,
 *   <Environment> y <ContactShadows> configurados.
 *
 *   import VapeModel from './VapeModel'
 *   // Dentro de tu <Canvas>:
 *   <VapeModel />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Float,
  Sparkles,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
} from '@react-three/drei'
import * as THREE from 'three'

// ─── PALETA DE COLORES (alineada con la identidad NeonVape) ───────────────────
const COLORS = {
  bodyDark:    '#1a1f2e',   // Metal oscuro del cuerpo principal
  bodyMid:     '#252b3d',   // Variación para detalles de metal
  neonGreen:   '#86efac',   // Acento verde neón (tanque / núcleo)
  neonPurple:  '#c084fc',   // Acento morado neón (anillos LED)
  glassTint:   '#a5f3fc',   // Tinte azul hielo del cristal del tanque
  tipBlack:    '#080b12',   // Boquilla negra mate
  panelAccent: '#334155',   // Panel lateral decorativo
}

// ─── SUBCOMPONENTE: Panel decorativo lateral (líneas grabadas) ────────────────
// Simula los grabados láser / ranuras de ventilación que tienen los vapes premium
function BodyPanel({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      {/* Caja muy delgada y alargada → franja decorativa */}
      <boxGeometry args={[0.02, 0.35, 0.18]} />
      <meshStandardMaterial
        color={COLORS.panelAccent}
        metalness={0.9}
        roughness={0.15}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

// ─── SUBCOMPONENTE: Anillo LED (TorusGeometry) ────────────────────────────────
// Cada anillo emite luz morada neón y tiene un segundo aro de brillo exterior
function NeonRing({ positionY, scale = 1 }) {
  return (
    <group position={[0, positionY, 0]} scale={scale}>
      {/* Aro principal — emisivo morado */}
      <mesh castShadow>
        <torusGeometry args={[0.195, 0.018, 16, 80]} />
        <meshStandardMaterial
          color={COLORS.neonPurple}
          emissive={COLORS.neonPurple}
          emissiveIntensity={3.5}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
      {/* Aro exterior de halo — más grande y semitransparente */}
      <mesh>
        <torusGeometry args={[0.202, 0.008, 12, 80]} />
        <meshStandardMaterial
          color={COLORS.neonPurple}
          emissive={COLORS.neonPurple}
          emissiveIntensity={1.5}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ─── SUBCOMPONENTE: Ranura de ventilación horizontal ─────────────────────────
function VentSlot({ positionY }) {
  return (
    <mesh position={[0, positionY, 0.195]} castShadow>
      <boxGeometry args={[0.22, 0.012, 0.015]} />
      <meshStandardMaterial
        color={'#111827'}
        metalness={0.95}
        roughness={0.05}
      />
    </mesh>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function VapeModel() {
  // Ref para el grupo raíz → rotación en useFrame
  const groupRef = useRef()

  // ─── Animación: rotación lenta en eje Y ─────────────────────────────────────
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.28   // ~16 rpm muy suave
    }
  })

  return (
    /**
     * <Float> de @react-three/drei
     * Proporciona levitación orgánica sin escribir matemáticas de seno manualmente.
     * speed        → velocidad del ciclo de flotación
     * rotationIntensity → cuánto rota al flotar (lo mantenemos bajo para que
     *                     la rotación de useFrame sea la protagonista)
     * floatIntensity   → amplitud vertical del movimiento
     */
    <Float
      speed={1.6}
      rotationIntensity={0.12}
      floatIntensity={0.6}
    >
      {/* ── Partículas tipo aura / humo brillante alrededor del vape ─────────
          count  → número de partículas
          scale  → radio de la nube de partículas
          size   → tamaño de cada partícula
          color  → mezcla entre verde y morado usando array (drei acepta ambos)
          speed  → velocidad de movimiento de las partículas
          noise  → turbulencia del movimiento
      ─────────────────────────────────────────────────────────────────────── */}
      <Sparkles
        count={55}
        scale={[1.1, 2.2, 1.1]}
        size={0.6}
        speed={0.35}
        noise={0.5}
        color={COLORS.neonGreen}
        opacity={0.7}
      />
      <Sparkles
        count={35}
        scale={[0.9, 2.0, 0.9]}
        size={0.45}
        speed={0.25}
        noise={0.8}
        color={COLORS.neonPurple}
        opacity={0.55}
      />

      {/* ── GRUPO RAÍZ — recibe la rotación Y de useFrame ──────────────────── */}
      <group ref={groupRef}>

        {/* ══════════════════════════════════════════════════════════════════
            1. CUERPO PRINCIPAL (BATERÍA)
            Cilindro central de metal oscuro cepillado.
            Alto metalness (0.95) + bajo roughness (0.12) = aspecto de acero
            inoxidable de alta calidad.  envMapIntensity amplifica los reflejos
            del <Environment preset="city" />.
        ══════════════════════════════════════════════════════════════════ */}
        <mesh castShadow receiveShadow>
          {/* args: [radioTop, radioBottom, altura, segRadiales, segAltura] */}
          <cylinderGeometry args={[0.19, 0.20, 1.55, 64, 1]} />
          <meshStandardMaterial
            color={COLORS.bodyDark}
            metalness={0.95}
            roughness={0.12}
            envMapIntensity={2.2}
          />
        </mesh>

        {/* Tapa inferior redondeada (cilindro corto más ancho = base) */}
        <mesh position={[0, -0.805, 0]} castShadow>
          <cylinderGeometry args={[0.20, 0.185, 0.04, 64]} />
          <meshStandardMaterial
            color={'#0f1420'}
            metalness={0.98}
            roughness={0.08}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* Tapa superior del cuerpo (transición al tanque) */}
        <mesh position={[0, 0.805, 0]} castShadow>
          <cylinderGeometry args={[0.175, 0.19, 0.04, 64]} />
          <meshStandardMaterial
            color={COLORS.bodyMid}
            metalness={0.97}
            roughness={0.1}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* ─── Paneles decorativos laterales grabados ────────────────────── */}
        {/* Se distribuyen simétricamente en 4 lados */}
        <BodyPanel position={[ 0.195, 0,     0    ]} rotation={[0,  0,      0]} />
        <BodyPanel position={[-0.195, 0,     0    ]} rotation={[0,  Math.PI, 0]} />
        <BodyPanel position={[ 0,     0,  0.195   ]} rotation={[0,  Math.PI / 2, 0]} />
        <BodyPanel position={[ 0,     0, -0.195   ]} rotation={[0, -Math.PI / 2, 0]} />

        {/* ─── Ranuras de ventilación decorativas en la parte baja ─────── */}
        <VentSlot positionY={-0.45} />
        <VentSlot positionY={-0.52} />
        <VentSlot positionY={-0.59} />

        {/* ══════════════════════════════════════════════════════════════════
            2. ANILLOS LED (TorusGeometry)
            Dos aros morados neón incrustados en el cuerpo:
              - Superior: justo debajo del tanque (y = 0.55)
              - Inferior: en la zona media-baja del cuerpo (y = -0.3)
            Un tercer aro más sutil en la base aporta profundidad.
        ══════════════════════════════════════════════════════════════════ */}
        <NeonRing positionY={ 0.60} />
        <NeonRing positionY={-0.30} />
        <NeonRing positionY={-0.70} scale={0.95} />

        {/* ══════════════════════════════════════════════════════════════════
            3. TANQUE DE LÍQUIDO (Cristal real con MeshTransmissionMaterial)
            Cilindro de vidrio ubicado entre el cuerpo y la boquilla.
            MeshTransmissionMaterial simula refracción física real del cristal.
        ══════════════════════════════════════════════════════════════════ */}
        <group position={[0, 1.075, 0]}>

          {/* Pared exterior de cristal */}
          <mesh castShadow>
            <cylinderGeometry args={[0.165, 0.168, 0.48, 64, 1, true]} />
            {/*
              MeshTransmissionMaterial (drei)
              transmission    → 1.0 = completamente transparente como vidrio
              thickness       → profundidad óptica de la refracción
              roughness       → 0 = vidrio perfecto sin imperfecciones
              chromaticAberration → dispersión cromática (arcoíris en bordes)
              ior             → índice de refracción (1.5 = vidrio estándar)
              color           → tinte del cristal
            */}
            <MeshTransmissionMaterial
              transmission={0.96}
              thickness={0.4}
              roughness={0.0}
              chromaticAberration={0.06}
              ior={1.5}
              backside={true}
              color={COLORS.glassTint}
              envMapIntensity={1.8}
            />
          </mesh>

          {/* Tapa superior del tanque (metal) */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.155, 0.165, 0.03, 64]} />
            <meshStandardMaterial
              color={COLORS.bodyMid}
              metalness={0.97}
              roughness={0.08}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* Tapa inferior del tanque (metal) */}
          <mesh position={[0, -0.26, 0]} castShadow>
            <cylinderGeometry args={[0.165, 0.155, 0.03, 64]} />
            <meshStandardMaterial
              color={COLORS.bodyMid}
              metalness={0.97}
              roughness={0.08}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* ── NÚCLEO INTERIOR EMISIVO (corazón verde neón) ───────────────
              Cilindro interno dentro del tanque que brilla en verde.
              emissiveIntensity alta hace que "ilumine" el cristal desde dentro,
              creando el efecto de líquido fluorescente característico del cyberpunk.
          ─────────────────────────────────────────────────────────────────── */}
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.42, 32]} />
            <meshStandardMaterial
              color={COLORS.neonGreen}
              emissive={COLORS.neonGreen}
              emissiveIntensity={4.5}
              roughness={0.1}
              metalness={0.0}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Halo del núcleo — cilindro semitransparente más ancho para el bloom */}
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.40, 32]} />
            <meshStandardMaterial
              color={COLORS.neonGreen}
              emissive={COLORS.neonGreen}
              emissiveIntensity={1.8}
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>

          {/* Alambre de calentamiento (coil) — toro aplastado en el centro del tanque */}
          <mesh position={[0, -0.05, 0]}>
            <torusGeometry args={[0.07, 0.012, 8, 24]} />
            <meshStandardMaterial
              color={'#d97706'}
              emissive={'#f59e0b'}
              emissiveIntensity={2.0}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* ══════════════════════════════════════════════════════════════════
            4. BOQUILLA / DRIP TIP
            Cilindro delgado en la cima, negro mate.
            Tiene una ligera conicidad (radio inferior > radio superior)
            para el perfil ergonómico característico de los drip tips.
        ══════════════════════════════════════════════════════════════════ */}
        <group position={[0, 1.595, 0]}>

          {/* Base de la boquilla (conector de metal entre tanque y tip) */}
          <mesh castShadow>
            <cylinderGeometry args={[0.10, 0.145, 0.08, 48]} />
            <meshStandardMaterial
              color={COLORS.bodyMid}
              metalness={0.95}
              roughness={0.1}
              envMapIntensity={1.8}
            />
          </mesh>

          {/* Cuerpo de la boquilla (drip tip propiamente dicho) */}
          <mesh position={[0, 0.185, 0]} castShadow>
            <cylinderGeometry args={[0.062, 0.095, 0.29, 48]} />
            <meshStandardMaterial
              color={COLORS.tipBlack}
              metalness={0.1}
              roughness={0.88}
              envMapIntensity={0.3}
            />
          </mesh>

          {/* Boca de la boquilla (agujero simulado con un disco oscuro) */}
          <mesh position={[0, 0.335, 0]}>
            <cylinderGeometry args={[0.038, 0.055, 0.01, 32]} />
            <meshStandardMaterial
              color={'#020408'}
              metalness={0.0}
              roughness={1.0}
            />
          </mesh>

          {/* Anillo LED mínimo en la base del drip tip */}
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.118, 0.009, 12, 60]} />
            <meshStandardMaterial
              color={COLORS.neonGreen}
              emissive={COLORS.neonGreen}
              emissiveIntensity={3.0}
              metalness={0.4}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* ══════════════════════════════════════════════════════════════════
            5. BOTÓN DE FUEGO (Fire Button)
            Rectángulo metálico en el costado del cuerpo, detalle premium.
        ══════════════════════════════════════════════════════════════════ */}
        <group position={[0.205, 0.1, 0]}>
          {/* Botón principal */}
          <mesh castShadow>
            <boxGeometry args={[0.018, 0.22, 0.14]} />
            <meshStandardMaterial
              color={'#1e293b'}
              metalness={0.92}
              roughness={0.15}
              envMapIntensity={2.0}
            />
          </mesh>
          {/* Línea luminosa decorativa en el botón */}
          <mesh position={[0.008, 0, 0]}>
            <boxGeometry args={[0.004, 0.18, 0.005]} />
            <meshStandardMaterial
              color={COLORS.neonPurple}
              emissive={COLORS.neonPurple}
              emissiveIntensity={4.0}
            />
          </mesh>
        </group>

        {/* ══════════════════════════════════════════════════════════════════
            6. DISPLAY OLED (simulado con geometría plana + emisivo)
            Pequeña pantalla en el lado opuesto al botón de fuego.
        ══════════════════════════════════════════════════════════════════ */}
        <group position={[-0.205, -0.05, 0]} rotation={[0, 0, 0]}>
          {/* Marco del display */}
          <mesh>
            <boxGeometry args={[0.012, 0.28, 0.18]} />
            <meshStandardMaterial
              color={'#111827'}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Pantalla activa con tinte verde */}
          <mesh position={[-0.004, 0, 0]}>
            <boxGeometry args={[0.005, 0.22, 0.13]} />
            <meshStandardMaterial
              color={COLORS.neonGreen}
              emissive={COLORS.neonGreen}
              emissiveIntensity={1.2}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Líneas de datos en el display (barras horziontales) */}
          {[-0.07, -0.01, 0.05, 0.09].map((y, i) => (
            <mesh key={i} position={[-0.006, y, 0]}>
              <boxGeometry args={[0.003, 0.008, 0.09 - i * 0.01]} />
              <meshStandardMaterial
                color={'#ffffff'}
                emissive={'#ffffff'}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>

      </group>
      {/* ── FIN del grupo con rotación ── */}

    </Float>
  )
}