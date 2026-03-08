import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { siteContent } from '../data/content'

const AudioController = ({ phase, isMuted, setIsMuted, isBlowing }) => {
    const celebrationAudioRef = useRef(null)
    const applauseAudioRef = useRef(null)

    useEffect(() => {
        const celebration = new Audio(siteContent.audio.celebration)
        celebration.loop = true
        celebration.volume = 0.42
        celebrationAudioRef.current = celebration

        const applause = new Audio(siteContent.audio.applause)
        applause.loop = false
        applause.volume = 0.6
        applauseAudioRef.current = applause

        return () => {
            ;[celebration, applause].forEach((audio) => {
                audio.pause()
                audio.src = ''
            })
        }
    }, [])

    useEffect(() => {
        ;[celebrationAudioRef.current, applauseAudioRef.current].forEach((audio) => {
            if (audio) {
                audio.muted = isMuted
            }
        })
    }, [isMuted])

    useEffect(() => {
        if (!celebrationAudioRef.current) return

        // Start playing when blowing starts OR when already blown out
        const shouldPlay = (isBlowing || phase === 'blown_out') && !isMuted

        if (shouldPlay) {
            // Only start from beginning if it's not already playing
            if (celebrationAudioRef.current.paused) {
                celebrationAudioRef.current.play().catch(() => { })
            }

            // Only trigger applause at the exact moment of blowout
            if (phase === 'blown_out' && applauseAudioRef.current?.paused) {
                applauseAudioRef.current.play().catch(() => { })
            }
        }

        // Stop if we reset to entering OR we are active but NOT blowing
        if (phase === 'entering' || (phase === 'active' && !isBlowing)) {
            celebrationAudioRef.current.pause()
            celebrationAudioRef.current.currentTime = 0
            if (applauseAudioRef.current) {
                applauseAudioRef.current.pause()
                applauseAudioRef.current.currentTime = 0
            }
        }
    }, [phase, isMuted, isBlowing])

    if (phase === 'entering') return null

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => setIsMuted((value) => !value)}
            className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white"
            aria-label="Toggle sound"
        >
            {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
        </motion.button>
    )
}

export default AudioController
