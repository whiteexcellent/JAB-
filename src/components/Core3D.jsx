import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Sphere, Text, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const Orb = ({ radius, speed, yOffset, color, blowing, blownOut }) => {
    const orbRef = useRef()
    const angleRef = useRef(Math.random() * Math.PI * 2)
    const speedMultiplier = useRef(1)

    useFrame((state, delta) => {
        if (!orbRef.current) return

        // Ramp up speed when blowing
        if (blowing) {
            speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, 25, 0.05)
        } else if (blownOut) {
            speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, 0.1, 0.02)
        } else {
            speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, 1, 0.05)
        }

        // Calculate spiral if blown out
        let currentRadius = radius
        if (blownOut) {
            currentRadius = THREE.MathUtils.lerp(orbRef.current.position.length(), 15, 0.01)
            orbRef.current.material.opacity = THREE.MathUtils.lerp(orbRef.current.material.opacity, 0, 0.05)
        }

        angleRef.current += speed * speedMultiplier.current * delta

        // Orbital motion logic
        const pullFactor = blowing ? THREE.MathUtils.lerp(1, 0.3, speedMultiplier.current / 25) : 1
        const x = Math.cos(angleRef.current) * currentRadius * pullFactor
        const z = Math.sin(angleRef.current) * currentRadius * pullFactor
        const y = yOffset * pullFactor + Math.sin(angleRef.current * 2) * 0.5

        orbRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.2)
    })

    return (
        <Sphere ref={orbRef} args={[0.15, 16, 16]}>
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1} />
            <pointLight distance={4} intensity={1} color={color} />
        </Sphere>
    )
}

const CoreGeometry = ({ blowing, blownOut }) => {
    const coreRef = useRef()

    useFrame((state, delta) => {
        if (!coreRef.current) return

        const rotationSpeed = blowing ? 5 : (blownOut ? 0.2 : 0.5)
        coreRef.current.rotation.y += rotationSpeed * delta
        coreRef.current.rotation.x += rotationSpeed * 0.5 * delta

        // Scale pulse
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.08
        const targetScale = blowing ? 1.4 : (blownOut ? 0 : 1 + pulse)

        const scaleSpeed = blownOut ? 0.2 : 0.05
        coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), scaleSpeed)

        // If blown out, slightly distort material
        if (blownOut && coreRef.current.scale.x > 0.01) {
            coreRef.current.material.wireframe = true
            coreRef.current.material.opacity = THREE.MathUtils.lerp(coreRef.current.material.opacity, 0, 0.1)
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
            <Icosahedron ref={coreRef} args={[2.5, 3]}>
                <meshPhysicalMaterial
                    color={blownOut ? "#00ffff" : "#ffffff"}
                    emissive={blownOut ? "#002244" : "#111111"}
                    emissiveIntensity={0.2}
                    roughness={0.05}
                    metalness={0.9}
                    transmission={1}
                    thickness={2}
                    ior={1.6}
                    clearcoat={1}
                    iridescence={1}
                    iridescenceIOR={1.3}
                    transparent
                    opacity={1}
                />
            </Icosahedron>
        </Float>
    )
}

const Core3D = ({ blowing, blownOut }) => {
    // Math to position orbs
    const orbs = useMemo(() => [
        { radius: 4.5, speed: 0.5, yOffset: 0, color: '#e5c158' },
        { radius: 5.0, speed: -0.6, yOffset: 1.5, color: '#ff5555' },
        { radius: 5.5, speed: 0.7, yOffset: -1.5, color: '#55aaff' },
        { radius: 4.8, speed: -0.4, yOffset: 2, color: '#ff88ff' },
        { radius: 6.0, speed: 0.8, yOffset: -0.5, color: '#55ff55' },
        { radius: 5.2, speed: 0.6, yOffset: 2.5, color: '#ffff55' },
    ], [])

    return (
        <group position={[0, -0.5, 0]}>
            <CoreGeometry blowing={blowing} blownOut={blownOut} />

            {/* The Orbiting Energy Orbs */}
            {orbs.map((orb, i) => (
                <Orb key={i} {...orb} blowing={blowing} blownOut={blownOut} />
            ))}

            {/* Float Typography Backdrop */}
            <Float speed={1} rotationIntensity={0} floatIntensity={0.2} position={[0, 4, -3]}>
                <Text
                    fontSize={0.8}
                    color="#e5c158"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.2}
                    material-toneMapped={false}
                    fillOpacity={blownOut ? 0 : 1}
                >
                    DOĞUM GÜNÜN
                </Text>
                <Text
                    position={[0, -1.2, 0]}
                    fontSize={1.6}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.1}
                    material-toneMapped={false}
                    fillOpacity={blownOut ? 0 : 1}
                >
                    KUTLU OLSUN
                </Text>
            </Float>

            {/* Cosmic Dust */}
            <Sparkles count={800} scale={20} size={2.5} speed={0.4} opacity={0.6} color="#e5c158" />
            <Sparkles count={400} scale={15} size={1} speed={0.2} opacity={0.4} color="#55aaff" />
        </group>
    )
}

export default Core3D
