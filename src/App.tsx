import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Text } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { agentRoutes, districtPalette, generateCity, type CityLot } from './world';

function DistrictBlock({ lot, selected, onSelect }: { lot: CityLot; selected: boolean; onSelect: (lot: CityLot) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const color = districtPalette[lot.type];

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const pulse = Math.sin(clock.elapsedTime * 1.4 + lot.x * 0.4 + lot.z * 0.2) * 0.025;
    mesh.current.scale.y = selected ? 1.06 + pulse : 1 + pulse;
  });

  return (
    <group position={[lot.x, lot.height / 2, lot.z]}>
      <mesh ref={mesh} onClick={(event) => { event.stopPropagation(); onSelect(lot); }} castShadow receiveShadow>
        <boxGeometry args={[lot.footprint, lot.height, lot.footprint]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.72} emissive={color} emissiveIntensity={selected ? 0.65 : 0.18 + lot.signal / 900} />
      </mesh>
      {selected && (
        <mesh position={[0, lot.height / 2 + 0.05, 0]}>
          <boxGeometry args={[lot.footprint + 0.14, 0.08, lot.footprint + 0.14]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.88} />
        </mesh>
      )}
    </group>
  );
}

function RoadGrid() {
  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3, string][] = [];
    for (let i = -12; i <= 12; i += 2.4) {
      const strong = Math.abs(Math.round(i / 2.4)) % 3 === 0;
      result.push([new THREE.Vector3(-13, 0.035, i), new THREE.Vector3(13, 0.035, i), strong ? '#35f2ff' : '#173b58']);
      result.push([new THREE.Vector3(i, 0.035, -13), new THREE.Vector3(i, 0.035, 13), strong ? '#ff39c7' : '#173b58']);
    }
    return result;
  }, []);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 32, 32, 32]} />
        <meshStandardMaterial color="#05050d" roughness={0.88} metalness={0.15} emissive="#070012" emissiveIntensity={0.8} />
      </mesh>
      {lines.map(([a, b, color], index) => <Line key={index} points={[a, b]} color={color} lineWidth={strongLine(color)} transparent opacity={color.startsWith('#17') ? 0.4 : 0.95} />)}
    </group>
  );
}

function strongLine(color: string) {
  return color === '#173b58' ? 0.65 : 1.6;
}

function AgentPaths() {
  return (
    <group>
      {agentRoutes.map((route) => (
        <group key={route.id}>
          <Line points={route.points.map((p) => new THREE.Vector3(...p))} color={route.color} lineWidth={3} transparent opacity={0.72} />
          <Text position={route.points[Math.floor(route.points.length / 2)]} fontSize={0.34} color={route.color} anchorX="center" anchorY="middle">
            {route.role}
          </Text>
        </group>
      ))}
    </group>
  );
}

function CoreSpire() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.08;
  });
  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 4.4, 0]} castShadow>
        <octahedronGeometry args={[1.15, 2]} />
        <meshStandardMaterial color="#f7f2ff" metalness={0.9} roughness={0.18} emissive="#6cf7ff" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.88, 4.1, 8]} />
        <meshStandardMaterial color="#12051f" metalness={0.85} roughness={0.22} emissive="#ff4fd8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function CityScene({ selected, setSelected }: { selected: CityLot | null; setSelected: (lot: CityLot) => void }) {
  const lots = useMemo(() => generateCity(64), []);
  return (
    <>
      <color attach="background" args={['#020109']} />
      <fog attach="fog" args={['#020109', 12, 38]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[9, 13, 5]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-7, 5, -8]} color="#6cf7ff" intensity={72} distance={23} />
      <pointLight position={[8, 4, 9]} color="#ff4fd8" intensity={54} distance={22} />
      <RoadGrid />
      <CoreSpire />
      {lots.map((lot) => <DistrictBlock key={lot.id} lot={lot} selected={selected?.id === lot.id} onSelect={setSelected} />)}
      <AgentPaths />
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={8} maxDistance={32} maxPolarAngle={Math.PI * 0.48} />
    </>
  );
}

export default function App() {
  const [selected, setSelected] = useState<CityLot | null>(null);
  const districtCounts = useMemo(() => {
    return generateCity(64).reduce<Record<string, number>>((acc, lot) => {
      acc[lot.type] = (acc[lot.type] || 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <main className="shell">
      <section className="hud hud-left">
        <p className="eyebrow">GLOW WORLD BUILDER / AI AGENT NEOCITY</p>
        <h1>Geo-city generator for autonomous agents.</h1>
        <p className="dek">A first GitHub-backed prototype: procedural districts, live agent route overlays, signal-weighted towers, and an operator HUD ready to evolve into a builder/editor.</p>
        <div className="actions">
          <button>Generate Sector</button>
          <button className="ghost">Assign Agent</button>
        </div>
      </section>

      <Canvas className="canvas" camera={{ position: [13, 13, 15], fov: 48 }} shadows>
        <CityScene selected={selected} setSelected={setSelected} />
      </Canvas>

      <aside className="hud hud-right">
        <p className="eyebrow">District telemetry</p>
        <div className="selected-card">
          <span>Selected lot</span>
          <strong>{selected ? selected.id.toUpperCase() : 'NONE'}</strong>
          <small>{selected ? `${selected.type} / signal ${selected.signal}` : 'Click a tower to inspect zoning data.'}</small>
        </div>
        <div className="legend">
          {Object.entries(districtPalette).map(([type, color]) => (
            <div key={type} className="legend-row"><i style={{ background: color }} /> <span>{type}</span><b>{districtCounts[type] || 0}</b></div>
          ))}
        </div>
      </aside>

      <div className="ticker">AGENT ROUTES: CARTOGRAPHER · ZONING · MEMORY GRAPH · FUTURE: PROMPT-TO-CITY, MULTI-AGENT TASK BUILDING, EXPORTABLE GEOJSON/GLTF</div>
    </main>
  );
}
