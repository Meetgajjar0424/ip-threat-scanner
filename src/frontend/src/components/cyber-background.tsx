import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 80;
const COLORS = {
  cyan: new THREE.Color(0x00d4ff),
  purple: new THREE.Color(0xb84fff),
  green: new THREE.Color(0x00ff88),
};

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
}

function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => {
      const colorKeys = Object.keys(COLORS) as Array<keyof typeof COLORS>;
      const color =
        COLORS[
          colorKeys[Math.floor(Math.random() * colorKeys.length)]!
        ]!.clone();
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.005,
        ),
        color,
      };
    });
  }, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
    });
    return { positions, colors };
  }, [particles]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const linePositions: number[] = [];

    particles.forEach((p, i) => {
      p.position.add(p.velocity);
      if (p.position.x > 10 || p.position.x < -10) p.velocity.x *= -1;
      if (p.position.y > 6 || p.position.y < -6) p.velocity.y *= -1;
      if (p.position.z > 4 || p.position.z < -4) p.velocity.z *= -1;

      posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);

      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        if (!other) continue;
        const dist = p.position.distanceTo(other.position);
        if (dist < 3.5) {
          linePositions.push(
            p.position.x,
            p.position.y,
            p.position.z,
            other.position.x,
            other.position.y,
            other.position.z,
          );
        }
      }
    });
    posAttr.needsUpdate = true;

    const lineGeo = linesRef.current.geometry;
    const lineAttr = lineGeo.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (!lineAttr || lineAttr.array.length !== linePositions.length) {
      lineGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(linePositions), 3),
      );
    } else {
      lineAttr.set(linePositions);
      lineAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={0x00d4ff} transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

interface ShapeDef {
  type: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  rotSpeed: THREE.Vector3;
  color: number;
  scale: number;
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshes = useMemo<ShapeDef[]>(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      type: i % 2 === 0 ? "ico" : "oct",
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        -3 - Math.random() * 4,
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0,
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.006,
        0,
      ),
      color: i % 3 === 0 ? 0x00d4ff : i % 3 === 1 ? 0xb84fff : 0x00ff88,
      scale: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const mesh = meshes[i];
      if (!mesh) return;
      child.rotation.x += mesh.rotSpeed.x;
      child.rotation.y += mesh.rotSpeed.y;
    });
  });

  return (
    <group ref={groupRef}>
      {meshes.map((m) => (
        <mesh
          key={`shape-${m.color}-${m.scale.toFixed(4)}`}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
        >
          {m.type === "ico" ? (
            <icosahedronGeometry args={[1, 0]} />
          ) : (
            <octahedronGeometry args={[1, 0]} />
          )}
          <meshBasicMaterial
            color={m.color}
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <ParticleNetwork />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
