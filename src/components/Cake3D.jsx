import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- HIGH FIDELITY CANDLE ---
const CinematicCandle = ({ position, blownOut, blowing }) => {
    const flameRef = useRef()
    const candleWaxRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (flameRef.current && !blownOut) {
            // Flickering effect based on blowing state
            const intensity = blowing ? (Math.random() * 0.5 + 0.1) : (Math.sin(t * 15) * 0.1 + 0.9 + Math.random() * 0.1)
            const jitterX = blowing ? (Math.random() - 0.5) * 0.5 : Math.sin(t * 8) * 0.05
            const jitterZ = blowing ? (Math.random() - 0.5) * 0.5 : Math.cos(t * 7) * 0.05

            flameRef.current.scale.set(intensity, intensity + (blowing ? -0.5 : 0), intensity)
            flameRef.current.position.x = jitterX
            flameRef.current.position.z = jitterZ

            // Candle wax slight glow pulse
            if (candleWaxRef.current) {
                candleWaxRef.current.emissiveIntensity = blowing ? 0.3 : 0.6 + Math.sin(t * 5) * 0.2
            }
        }
    })

    return (
        <group position={position}>
            {/* Wax Body */}
            <mesh ref={candleWaxRef} position={[0, 0.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.06, 0.07, 0.8, 32]} />
                <meshPhysicalMaterial
                    color="#f4f4f4"
                    roughness={0.7}
                    transmission={0.4}
                    thickness={0.5}
                    emissive="#ffaa55"
                    emissiveIntensity={0.2}
                />
            </mesh>
            {/* Wick */}
            <mesh position={[0, 0.82, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
                <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>
            {/* Flame */}
            {!blownOut && (
                <group position={[0, 0.9, 0]}>
                    <mesh ref={flameRef}>
                        <coneGeometry args={[0.06, 0.25, 16]} />
                        <meshBasicMaterial color="#ffeba8" transparent opacity={1} />
                    </mesh>
                    <mesh position={[0, -0.05, 0]}>
                        <coneGeometry args={[0.04, 0.15, 16]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                    </mesh>
                    <pointLight color="#ffccaa" intensity={blowing ? 0.8 : 2.5} distance={5} decay={2} castShadow={!blownOut} />
                </group>
            )}
            {/* Smoke puff on blowout */}
            {blownOut && (
                <group position={[0, 1.0, 0]}>
                    <Sparkles count={10} scale={0.3} size={2} speed={0.5} opacity={0.3} color="#888888" />
                </group>
            )}
        </group>
    )
}

// --- ORGANIC CAKE TIERS ---
const SoftCakeTier = ({ radius, height, y, color = "#fff5eb", isTop = false }) => {
    // A soft cake tier is built by merging a cylinder with a torus at the top/bottom 
    // to give it a fondant/buttercream smooth edge.
    const edgeRadius = 0.15
    const innerRadius = radius - edgeRadius

    return (
        <group position={[0, y, 0]}>
            {/* Main Body (Slightly shorter to allow for torus edges) */}
            <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
                <cylinderGeometry args={[innerRadius + edgeRadius, innerRadius + edgeRadius, height - edgeRadius * 2, 48]} />
                <meshPhysicalMaterial color={color} roughness={0.4} transmission={0.1} thickness={0.5} clearcoat={0.1} />
            </mesh>

            {/* Top Soft Edge */}
            <mesh castShadow receiveShadow position={[0, height - edgeRadius, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[innerRadius, edgeRadius, 16, 48]} />
                <meshPhysicalMaterial color={color} roughness={0.4} transmission={0.1} thickness={0.5} clearcoat={0.1} />
            </mesh>

            {/* Top Flat Surface */}
            <mesh receiveShadow position={[0, height, 0]}>
                <cylinderGeometry args={[innerRadius, innerRadius, 0.01, 48]} />
                <meshPhysicalMaterial color={color} roughness={0.4} transmission={0.1} thickness={0.5} clearcoat={0.1} />
            </mesh>

            {/* Bottom Soft Edge (if not resting on ground) */}
            {!isTop && (
                <mesh castShadow receiveShadow position={[0, edgeRadius, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[innerRadius, edgeRadius, 32, 64]} />
                    <meshPhysicalMaterial color={color} roughness={0.4} transmission={0.1} thickness={0.5} clearcoat={0.1} />
                </mesh>
            )}
        </group>
    )
}

// --- DRIP ICING ---
const DripIcing = ({ radius, count, y, color = "#5c3a21" }) => {
    const drips = useMemo(() => {
        const arr = []
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            // Randomize drip length and thickness for organic look
            const dripLength = 0.2 + Math.random() * 0.6
            const dripThickness = 0.05 + Math.random() * 0.03
            arr.push({
                x: Math.cos(angle) * (radius + 0.02), // Push slightly out
                z: Math.sin(angle) * (radius + 0.02),
                length: dripLength,
                thickness: dripThickness
            })
        }
        return arr
    }, [count, radius])

    const dripMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.1, // Glossy
        clearcoat: 1.0, // Very shiny
        metalness: 0.1
    })

    return (
        <group position={[0, y, 0]}>
            {/* Top Icing Puddle */}
            <mesh receiveShadow castShadow position={[0, 0.02, 0]}>
                <cylinderGeometry args={[radius + 0.01, radius + 0.01, 0.05, 64]} />
                <primitive object={dripMaterial} attach="material" />
            </mesh>

            {/* Cascading Drips */}
            {drips.map((d, i) => (
                <mesh key={i} castShadow position={[d.x, -d.length / 2, d.z]}>
                    <capsuleGeometry args={[d.thickness, d.length, 16, 16]} />
                    <primitive object={dripMaterial} attach="material" />
                </mesh>
            ))}
        </group>
    )
}

// --- SPRINKLES (Optimized with InstancedMesh) ---
const Sprinkles = ({ radius, count, y }) => {
    const meshRef = useRef()
    const colorArray = useMemo(() => {
        const colors = [new THREE.Color('#ff4d6d'), new THREE.Color('#88b5ff'), new THREE.Color('#f4d35e'), new THREE.Color('#ffffff'), new THREE.Color('#a8e6cf')]
        const arr = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)]
            color.toArray(arr, i * 3)
        }
        return arr
    }, [count])

    useMemo(() => {
        if (!meshRef.current) return
        const dummy = new THREE.Object3D()
        for (let i = 0; i < count; i++) {
            const r = Math.sqrt(Math.random()) * radius
            const theta = Math.random() * 2 * Math.PI
            dummy.position.set(r * Math.cos(theta), 0.02, r * Math.sin(theta))
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [count, radius])

    return (
        <group position={[0, y, 0]}>
            <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
                <capsuleGeometry args={[0.015, 0.06, 8, 8]}>
                    <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
                </capsuleGeometry>
                <meshStandardMaterial vertexColors roughness={0.6} />
            </instancedMesh>
        </group>
    )
}

// --- PEARLS BORDER (Optimized with InstancedMesh) ---
const PearlsBorder = ({ radius, count, y }) => {
    const meshRef = useRef()

    useMemo(() => {
        if (!meshRef.current) return
        const dummy = new THREE.Object3D()
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            dummy.position.set(Math.cos(angle) * (radius + 0.05), 0, Math.sin(angle) * (radius + 0.05))
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [count, radius])

    return (
        <group position={[0, y, 0]}>
            <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshPhysicalMaterial color="#ffffff" clearcoat={1.0} transmission={0.5} roughness={0.1} />
            </instancedMesh>
        </group>
    )
}

const Cake3D = ({ blownOut, blowing }) => {
    const cakeRef = useRef()
    const [entered, setEntered] = React.useState(false)

    // Entry animation setup
    React.useEffect(() => {
        setEntered(true)
    }, [])

    useFrame((state, delta) => {
        if (cakeRef.current) {
            // Elegant continuous rotation
            if (!blownOut) {
                cakeRef.current.rotation.y += delta * 0.1
            }
            // Elastic Entry Animation
            const targetScale = entered ? 1.2 : 0
            const targetY = entered ? -1.0 : -3.0

            // Dampen scale and position
            cakeRef.current.scale.setScalar(
                THREE.MathUtils.damp(cakeRef.current.scale.x, targetScale, 4, delta)
            )
            cakeRef.current.position.y = THREE.MathUtils.damp(cakeRef.current.position.y, targetY, 4, delta)
        }
    })

    const blowoutParticles = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        position: [
            (Math.random() - 0.5) * 5,
            2 + Math.random() * 4,
            (Math.random() - 0.5) * 5
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.01 + Math.random() * 0.03
    })), [])

    return (
        <group>
            <group ref={cakeRef} position={[0, -3.0, 0]} scale={0}>
                {/* Premium Cake Stand */}
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[2.5, 2.7, 0.15, 48]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} /> {/* Brushed Gold */}
                </mesh>
                <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[1.2, 1.8, 0.8, 24]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* BOTTOM TIER - Vanilla Fondant */}
                <SoftCakeTier radius={2.0} height={1.2} y={0.15} />

                {/* TOP TIER - Vanilla Fondant */}
                <SoftCakeTier radius={1.4} height={1.0} y={1.35} isTop={true} />

                {/* ORGANIC CHOCOLATE DRIP on Top Tier */}
                <DripIcing radius={1.4} count={32} y={2.35} color="#4a2e1b" />

                {/* SCATTERED SPRINKLES */}
                <Sprinkles radius={1.3} count={150} y={2.38} />

                {/* PEARL BORDER on Bottom Tier (Optimized) */}
                <PearlsBorder radius={2.0} count={36} y={0.25} />

                {/* CINEMATIC CANDLES */}
                <group position={[0, 2.38, 0]}>
                    <CinematicCandle position={[0, 0, 0]} blownOut={blownOut} blowing={blowing} />
                    <CinematicCandle position={[0.45, 0, 0.25]} blownOut={blownOut} blowing={blowing} />
                    <CinematicCandle position={[-0.45, 0, 0.25]} blownOut={blownOut} blowing={blowing} />
                    <CinematicCandle position={[0.3, 0, -0.4]} blownOut={blownOut} blowing={blowing} />
                    <CinematicCandle position={[-0.3, 0, -0.4]} blownOut={blownOut} blowing={blowing} />
                </group>

                {/* Magic Dust around cake */}
                {!blownOut && (
                    <Sparkles count={40} scale={4} size={1} speed={0.2} opacity={0.5} color="#f4d35e" position={[0, 2, 0]} />
                )}
            </group>

            {/* Blowout Shards */}
            {blownOut && (
                <group>
                    {blowoutParticles.map((p, i) => (
                        <Float key={i} speed={3} rotationIntensity={3}>
                            <mesh position={p.position} rotation={p.rotation} scale={p.scale}>
                                <octahedronGeometry args={[1, 0]} />
                                <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.5} transmission={0.9} />
                            </mesh>
                        </Float>
                    ))}
                    <Sparkles count={100} scale={8} size={6} speed={0.4} opacity={0.5} color="#ffffff" position={[0, 3, 0]} />
                </group>
            )}
        </group>
    )
}

export default Cake3D
