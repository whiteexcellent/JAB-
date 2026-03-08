import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { siteContent } from '../data/content'

const Hero3DStage = ({ phase }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Parallax effect values
    const rotateX = useTransform(y, [-300, 300], [5, -5])
    const rotateY = useTransform(x, [-300, 300], [-5, 5])

    const handleMouseMove = (event) => {
        const rect = document.body.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        x.set(event.clientX - centerX)
        y.set(event.clientY - centerY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    if (phase === 'idle') return null

    return (
        <section
            className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#070709] to-[#0c0d12] perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Background Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-white/5 rounded-full blur-[100px] pointer-events-none"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Simulated 3D Cake Image with Screen/Lighten blend and Parallax */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
                <motion.img
                    src="/cake.png"
                    alt="Premium 3D Cake"
                    className="w-[80vw] max-w-[500px] object-contain transition-opacity duration-1000 mix-blend-screen drop-shadow-2xl"
                    style={{ opacity: isLoaded ? 0.9 : 0 }}
                    onLoad={() => setIsLoaded(true)}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Typography Overlay */}
            <motion.div
                className="relative z-20 text-center mt-[60vh] pointer-events-none px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="text-4xl md:text-7xl font-bold text-white/95 tracking-tight drop-shadow-lg"
                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {siteContent.hero.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/80 font-normal max-w-xl mx-auto leading-relaxed drop-shadow-md">
                    {siteContent.hero.subtitle}
                </p>
            </motion.div>
        </section>
    )
}

export default Hero3DStage
