'use client';
import { Canvas } from '@react-three/fiber';
import { Billboard, OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

const techs = [
  'Python',
  'C++',
  'Go',
  'TypeScript',
  'JavaScript',
  'MATLAB',
  'Hugging Face',
  'TensorFlow',
  'scikit-learn',
  'LLAMA',
  'React',
  'Node.js',
  'Docker',
  'PostgreSQL',
  'Redis',
  'Pinecone',
  'MongoDB',
  'GSAP',
  'Framer Motion',
  'Tailwind',
  'Figma'
];

function fibonacciSphere(n: number, radius: number) {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

function Labels() {
  const points = useMemo(() => fibonacciSphere(techs.length, 2.4), []);
  return (
    <>
      {techs.map((t, i) => (
        <Billboard key={t} position={points[i]}>
          <Text
            fontSize={0.24}
            color="#f5f5f2"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor="#0a0a0a"
          >
            {t}
          </Text>
        </Billboard>
      ))}
    </>
  );
}

export default function ToolkitCloud() {
  return (
    <div className="h-[520px] w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <Labels />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
}
