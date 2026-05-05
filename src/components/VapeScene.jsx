import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import VapeModel from './VapeModel';

export default function VapeScene() {
  return (
    <div className="w-full h-full min-h-125 cursor-grab active:cursor-grabbing relative z-10">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        
        {/* Luces sutiles para generar alto contraste con los LEDs */}
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#c084fc" intensity={0.5} />

        <VapeModel />

        {/* Sombra oscura y nítida en el suelo */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4.5} color="#000000" />
        
        {/* El Environment 'city' da reflejos hiperrealistas al metal y cristal */}
        <Environment preset="city" />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}