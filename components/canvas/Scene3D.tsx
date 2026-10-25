// FILE PATH: components/canvas/Scene3D.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HolographicNexusCore() {
  const outerGroup = useRef<THREE.Group>(null);
  const innerCore = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerGroup.current) {
      outerGroup.current.rotation.y += delta * 0.18;
      outerGroup.current.rotation.x = THREE.MathUtils.lerp(
        outerGroup.current.rotation.x,
        state.mouse.y * 0.35,
        0.05
      );
      outerGroup.current.rotation.z = THREE.MathUtils.lerp(
        outerGroup.current.rotation.z,
        -state.mouse.x * 0.35,
        0.05
      );
    }
    if (innerCore.current) {
      innerCore.current.rotation.y -= delta * 0.45;
      innerCore.current.rotation.z += delta * 0.25;
    }
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.4;
    }
  });

  return (
    <group ref={outerGroup}>
      {/* Outer Geodesic Transparent Wireframe Sphere */}
      <mesh>
        <icosahedronGeometry args={[2.25, 2]} />
        <meshStandardMaterial
          color="#dc2626"
          wireframe
          transparent
          opacity={0.28}
          emissive="#dc2626"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Secondary Structural Wireframe Lattice */}
      <mesh ref={innerCore}>
        <octahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Core Energy Nucleus */}
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={1.6}
          wireframe
        />
      </mesh>

      {/* Orbital HUD Telemetry Ring 01 */}
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.85, 0.008, 16, 120]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.55} />
      </mesh>

      {/* Orbital HUD Telemetry Ring 02 */}
      <mesh ref={ring2} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[3.2, 0.005, 16, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dynamic Non-Uniform Crimson Glowing Gradients (As per Reference 1) */}
      <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-red-600/15 blur-[150px] animate-pulse" />
      <div className="absolute top-[28%] -right-24 w-[32rem] h-[44rem] rounded-full bg-red-700/12 blur-[170px]" />
      <div className="absolute -bottom-40 left-[22%] w-[45rem] h-[28rem] rounded-full bg-red-900/20 blur-[160px]" />

      {/* 3D WebGL Viewport */}
      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#dc2626" />
        <pointLight position={[-5, -5, -3]} intensity={1.2} color="#ffffff" />
        <HolographicNexusCore />
      </Canvas>

      {/* Subtle Architectural Grid & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030303_90%)]" />
    </div>
  );
}