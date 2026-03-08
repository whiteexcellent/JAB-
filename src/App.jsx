import React, { Suspense, lazy, useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import AudioController from './components/AudioController'
import BirthdayIntro from './components/BirthdayIntro'
import ErrorBoundary from './components/ErrorBoundary'
import FinaleSection from './components/FinaleSection'
import WishRitual from './components/WishRitual'
import { siteContent } from './data/content'
import './App.css'

const Scene = lazy(() => import('./components/Scene'))

function App() {
    const [phase, setPhase] = useState('entering')
    const [isMuted, setIsMuted] = useState(false)
    const [isBlowing, setIsBlowing] = useState(false)

    useEffect(() => {
        document.body.style.overflow = phase === 'entering' ? 'hidden' : 'auto'

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [phase])

    const handleEnter = () => {
        setPhase('active')
    }

    const handleWishComplete = () => {
        setPhase('blown_out')

        const end = Date.now() + 2200
        const colors = ['#ffffff', '#f4d35e', '#ff4d6d', '#4da3ff']

            ; (function burst() {
                confetti({
                    particleCount: 14,
                    spread: 110,
                    startVelocity: 42,
                    origin: { x: 0.12, y: 0.64 },
                    colors,
                })
                confetti({
                    particleCount: 14,
                    spread: 110,
                    startVelocity: 42,
                    origin: { x: 0.88, y: 0.64 },
                    colors,
                })
                confetti({
                    particleCount: 20,
                    spread: 90,
                    startVelocity: 34,
                    origin: { x: 0.5, y: 0.38 },
                    colors,
                })

                if (Date.now() < end) {
                    window.requestAnimationFrame(burst)
                }
            })()
    }

    const handleReplay = () => {
        setPhase('entering')
        setIsBlowing(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
            <AudioController phase={phase} isMuted={isMuted} setIsMuted={setIsMuted} isBlowing={isBlowing} />
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-1/2 top-[10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,220,160,0.16),rgba(255,77,109,0.06),transparent_70%)] blur-3xl" />
                <div className="absolute left-[18%] top-[22%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(77,163,255,0.14),transparent_72%)] blur-3xl" />
                <div className="absolute bottom-[-8rem] left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_62%)] blur-3xl" />
            </div>

            <AnimatePresence mode="wait">
                {phase === 'entering' ? <BirthdayIntro key="intro" onEnter={handleEnter} /> : null}
            </AnimatePresence>

            {phase !== 'entering' ? (
                <ErrorBoundary>
                    <Suspense fallback={<div className="pointer-events-none fixed inset-0 z-0 bg-[#050505]" />}>
                        <div className="pointer-events-none fixed inset-0 z-0">
                            <Scene isBlowing={isBlowing && phase === 'active'} isBlownOut={phase === 'blown_out'} />
                        </div>
                    </Suspense>
                </ErrorBoundary>
            ) : null}

            <div className="relative z-10 pointer-events-none min-h-screen">
                {phase !== 'entering' && (
                    <motion.div
                        className="absolute top-16 left-0 right-0 z-20 flex justify-center pointer-events-none"
                    >
                        <h1 className="text-3xl font-light tracking-[0.2em] text-white/90 md:text-5xl uppercase drop-shadow-lg flex gap-[0.2em]">
                            {"İyi Ki Doğdun".split(" ").map((word, i) => (
                                <span key={i} className="flex">
                                    {word.split("").map((char, j) => (
                                        <motion.span
                                            key={`${i}-${j}`}
                                            initial={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            transition={{
                                                duration: 1.2,
                                                ease: [0.16, 1, 0.3, 1],
                                                delay: 0.5 + (i * 5 + j) * 0.05
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                    {/* Add space between words */}
                                    <span className="w-[0.3em]" />
                                </span>
                            ))}
                        </h1>
                    </motion.div>
                )}

                {phase !== 'entering' ? (
                    <section className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center pointer-events-auto">
                        <WishRitual
                            phase={phase}
                            onWishComplete={handleWishComplete}
                            setIsBlowing={setIsBlowing}
                        />
                    </section>
                ) : null}

                <AnimatePresence>
                    {phase === 'blown_out' ? <FinaleSection onReplay={handleReplay} /> : null}
                </AnimatePresence>
            </div>
        </main>
    )
}

export default App

