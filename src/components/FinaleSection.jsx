import React from 'react'
import { motion } from 'framer-motion'
import { siteContent } from '../data/content'

const FinaleSection = ({ onReplay }) => {
    return (
        <motion.section
            className="pointer-events-none fixed inset-0 z-20 flex items-end justify-start p-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[20%] top-[80%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,193,88,0.15),rgba(255,255,255,0.02),transparent_70%)] blur-3xl" />
            </div>

            <motion.div
                className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-[1rem] border border-white/5 bg-[#050505]/80 px-6 py-8 text-left shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5c158]/40 to-transparent" />
                <span className="inline-flex rounded-sm border border-[#e5c158]/20 bg-[#e5c158]/5 px-3 py-1 text-[9px] uppercase tracking-[0.4em] text-[#e5c158]/80">
                    Sequence Complete
                </span>

                <h2 className="mt-6 text-3xl font-light tracking-[0.1em] text-white/90">
                    {siteContent.finale.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed tracking-wide text-white/50">
                    {siteContent.finale.body}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-start gap-3 text-[9px] uppercase tracking-[0.3em] text-white/40">
                    {siteContent.finale.badges.map((badge) => (
                        <span key={badge} className="rounded-sm border border-white/5 bg-white/[0.03] px-3 py-1.5">
                            {badge}
                        </span>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-start gap-4">
                    <button
                        type="button"
                        onClick={onReplay}
                        className="rounded-sm border border-[#e5c158]/40 bg-transparent px-8 py-3 text-[10px] uppercase tracking-[0.4em] text-[#e5c158] transition-all duration-500 hover:bg-[#e5c158] hover:text-black w-full"
                    >
                        Replay
                    </button>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/20">
                        {siteContent.finale.note}
                    </span>
                </div>
            </motion.div>
        </motion.section>
    )
}

export default FinaleSection
