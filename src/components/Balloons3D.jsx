import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const Balloon = ({ position, color, delay }) => {
    const balloonRef = useRef()
    const stringRef = useRef()

    const [entered, setEntered] = React.useState(false)

    React.useEffect(() => {
        setEntered(true)
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime() + delay
        if (balloonRef.current) {
            // Gentle floating and swaying
            const targetY = entered ? position[1] : -10 // Start far below

            balloonRef.current.position.y = THREE.MathUtils.damp(balloonRef.current.position.y, targetY + Math.sin(t * 0.5) * 0.5, 2, 0.016)
            balloonRef.current.position.x = position[0] + Math.cos(t * 0.3) * 0.3
            balloonRef.current.rotation.z = Math.sin(t * 0.4) * 0.1
        }
    })

    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={balloonRef} position={[position[0], -10, position[2]]} castShadow>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <MeshDistortMaterial
                        color={color}
                        speed={2}
                        distort={0.2}
                        radius={1}
                        metalness={0.8}
                        roughness={0.2}
                    />

                    {/* Balloon Knot/Tail */}
                    <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                        <coneGeometry args={[0.05, 0.1, 16]} />
                        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Balloon String (Simplified as a line) */}
                    <mesh position={[0, -0.85, 0]}>
                        <cylinderGeometry args={[0.005, 0.005, 0.8, 8]} />
                        <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
                    </mesh>
                </mesh>
            </Float>
        </group>
    )
}

const Balloons3D = () => {
    const balloonData = useMemo(() => [
        { position: [-6, 4, -4], color: '#e5c158', delay: 0 },
        { position: [6, 5, -3], color: '#f4d35e', delay: 1.5 },
        { position: [-4, 6, -6], color: '#ffffff', delay: 3 },
        { position: [5, 3, -5], color: '#88b5ff', delay: 4.5 },
        { position: [-7, 2, -2], color: '#ff4d6d', delay: 2.2 },
        { position: [7, 7, -7], color: '#e5c158', delay: 0.8 },
    ], [])

    return (
        <group>
            {balloonData.map((b, i) => (
                <Balloon key={i} {...b} />
            ))}
        </group>
    )
}

export default Balloons3D
