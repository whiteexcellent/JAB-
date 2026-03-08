import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, PresentationControls, Sparkles } from '@react-three/drei'
import Cake3D from './Cake3D'
import Balloons3D from './Balloons3D'
import * as THREE from 'three'

const CameraRig = ({ isBlowing, isBlownOut }) => {
    useFrame((state) => {
        let targetZ = 13.0
        let targetY = 3.5

        if (isBlownOut) {
            targetZ = 16.0
            targetY = 4.0
        } else if (isBlowing) {
            targetZ = 9.0
            targetY = 2.8
        }

        state.camera.position.lerp(new THREE.Vector3(state.camera.position.x, targetY, targetZ), 0.05)
        state.camera.lookAt(0, 1.5, 0)
    })
    return null
}

const Scene = ({ isBlowing, isBlownOut }) => {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 4, 13], fov: 45 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
        >
            <color attach="background" args={['#020205']} />
            <fog attach="fog" args={['#020205', 12, 35]} />

            <Sparkles count={120} scale={20} size={1} speed={0.3} opacity={0.2} color="#ffffff" />

            <ambientLight intensity={0.2} />
            <spotLight
                position={[10, 15, 10]}
                angle={0.3}
                penumbra={1}
                intensity={isBlownOut ? 0.5 : 3.0}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            <PresentationControls
                global
                config={{ mass: 1, tension: 120 }}
                snap={{ mass: 2, tension: 300 }}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 6, Math.PI / 6]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
                <group position={[0, -0.5, 0]}>
                    <Cake3D blownOut={isBlownOut} blowing={isBlowing && !isBlownOut} />
                    <Balloons3D />
                </group>
            </PresentationControls>

            <CameraRig isBlowing={isBlowing} isBlownOut={isBlownOut} />

            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2.5} far={10} color="#000000" />

            <Suspense fallback={null}>
                <Environment preset="city" environmentIntensity={0.6} />
            </Suspense>
        </Canvas>
    )
}

export default Scene
