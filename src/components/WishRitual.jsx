import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { siteContent } from '../data/content'

const WishRitual = ({ phase, onWishComplete, setIsBlowing }) => {
    const [isPressing, setIsPressing] = useState(false)
    const [progress, setProgress] = useState(0)
    const startTime = useRef(0)
    const isCompleted = phase === 'blown_out'

    useEffect(() => {
        let animationFrame

        if (isPressing && !isCompleted) {
            const updateProgress = () => {
                const elapsed = Date.now() - startTime.current
                const nextProgress = (elapsed / siteContent.sceneConfig.wishHoldDurationMs) * 100

                if (nextProgress >= 100) {
                    setProgress(100)
                    setIsPressing(false)
                    setIsBlowing(false)
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.65 },
                        colors: ['#e5c158', '#ffffff', '#88b5ff'],
                        disableForReducedMotion: true
                    })
                    window.setTimeout(() => onWishComplete(), 1200) // Give more time to see the candles turn off
                } else {
                    setProgress(nextProgress)
                    animationFrame = window.requestAnimationFrame(updateProgress)
                }
            }

            animationFrame = window.requestAnimationFrame(updateProgress)
        } else if (!isPressing && !isCompleted && progress > 0) {
            const timeout = window.setTimeout(() => {
                setProgress((prev) => Math.max(0, prev - 4))
            }, 16)
            return () => window.clearTimeout(timeout)
        }

        return () => window.cancelAnimationFrame(animationFrame)
    }, [isCompleted, isPressing, onWishComplete, progress, setIsBlowing])

    const handlePointerDown = () => {
        if (isCompleted) return
        setIsPressing(true)
        setIsBlowing(true)
        startTime.current = Date.now() - (progress / 100) * siteContent.sceneConfig.wishHoldDurationMs
    }

    const handlePointerUp = () => {
        setIsPressing(false)
        setIsBlowing(false)
    }

    return (
        <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-end pb-20 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }} // Prevent scrolling when holding on mobile
        >
            {/* Minimal Progress Indicator & Text Block */}
            <div className="mb-8 flex flex-col items-center gap-4">
                <p className="max-w-lg text-[10px] uppercase tracking-[0.5em] text-white/50 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
                    {isCompleted ? siteContent.wish.completed : "MUMU ÜFLEMEK İÇİN EKRANIN HERHANGİ BİR YERİNE BASILI TUT"}
                </p>

                <div className="flex flex-col items-center gap-2">
                    <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-[#f4d35e] shadow-[0_0_10px_#f4d35e]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/30">
                        Charge: {Math.round(progress)}%
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

export default WishRitual
