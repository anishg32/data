'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DataPoints() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const radius = 2.02;

    for (let i = 0; i < count; i++) {
      // Distribute points on sphere surface
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Cyan-ish to indigo colors
      const t = Math.random();
      col[i * 3] = 0.3 + t * 0.1;       // R
      col[i * 3 + 1] = 0.5 + t * 0.3;    // G
      col[i * 3 + 2] = 0.8 + t * 0.2;    // B
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlobeWireframe() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Main sphere wireframe */}
      <mesh>
        <sphereGeometry args={[2, 48, 48]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.98, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.02}
        />
      </mesh>

      {/* Latitude rings */}
      {[-1, -0.5, 0, 0.5, 1].map((y, i) => {
        const r = Math.sqrt(4 - y * y);
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.002, r + 0.002, 128]} />
            <meshBasicMaterial
              color="#6366f1"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const radius = 2.02;

    // Create some connection arcs between random points
    const locations = [
      [40.7, -74.0],   // New York
      [51.5, -0.1],    // London
      [35.7, 139.7],   // Tokyo
      [28.6, 77.2],    // Delhi
      [-23.5, -46.6],  // São Paulo
      [37.5, 127.0],   // Seoul
      [1.3, 103.8],    // Singapore
      [48.8, 2.3],     // Paris
      [-33.8, 151.2],  // Sydney
      [55.7, 37.6],    // Moscow
    ];

    for (let i = 0; i < locations.length - 1; i += 2) {
      const [lat1, lng1] = locations[i];
      const [lat2, lng2] = locations[i + 1];

      const phi1 = (90 - lat1) * (Math.PI / 180);
      const theta1 = (lng1 + 180) * (Math.PI / 180);
      const phi2 = (90 - lat2) * (Math.PI / 180);
      const theta2 = (lng2 + 180) * (Math.PI / 180);

      conns.push({
        start: new THREE.Vector3(
          radius * Math.sin(phi1) * Math.cos(theta1),
          radius * Math.cos(phi1),
          radius * Math.sin(phi1) * Math.sin(theta1)
        ),
        end: new THREE.Vector3(
          radius * Math.sin(phi2) * Math.cos(theta2),
          radius * Math.cos(phi2),
          radius * Math.sin(phi2) * Math.sin(theta2)
        ),
        color: i % 4 === 0 ? '#6366f1' : '#22d3ee',
      });
    }
    return conns;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {connections.map((conn, i) => {
        const mid = new THREE.Vector3()
          .addVectors(conn.start, conn.end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.8);

        const curve = new THREE.QuadraticBezierCurve3(conn.start, mid, conn.end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i}>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial
              color={conn.color}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </line>
        );
      })}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#818cf8"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Globe3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Need to import useState
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.1} />
        <GlobeWireframe />
        <DataPoints />
        <ConnectionLines />
        <Particles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  );
}
