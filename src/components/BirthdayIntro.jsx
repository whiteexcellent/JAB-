import React from 'react'
import { motion } from 'framer-motion'
import { siteContent } from '../data/content'

const BirthdayIntro = ({ onEnter }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#000000] px-6 text-white"
            onClick={onEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
            <motion.div
                className="flex max-w-3xl flex-col items-center text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2 }}
            >
                <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-white/30">Protocol Initiation</p>
                <h1 className="text-4xl font-light tracking-[0.2em] text-[#e5c158]/90 md:text-6xl">
                    {siteContent.hero.name}
                </h1>
                <p className="mt-8 max-w-xl text-sm leading-relaxed tracking-wide text-white/40 md:text-sm">
                    {siteContent.hero.dedication}
                </p>

                <motion.div
                    className="relative mt-16 flex h-14 w-14 items-center justify-center rounded-full border border-[#e5c158]/20 bg-[#e5c158]/5 backdrop-blur-md"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#e5c158]/80" />
                    <motion.div
                        className="absolute inset-0 rounded-full border border-[#e5c158]/20"
                        animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
                    />
                </motion.div>

                <p className="mt-8 text-[9px] uppercase tracking-[0.4em] text-white/25">Tap to sequence</p>
            </motion.div>
        </motion.div>
    )
}

export default BirthdayIntro
