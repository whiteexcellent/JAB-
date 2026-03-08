import React from 'react'
import { motion } from 'framer-motion'
import { siteContent } from '../data/content'

const MessageWall = () => {
    return (
        <section className="relative w-full py-32 bg-[#070709] text-white border-t border-white/5">
            <div className="max-w-5xl mx-auto px-6">

                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">
                        Mesajlar
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light text-white/90 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Senin İçin Ne Dediler?
                    </h2>
                    <div className="w-8 h-[1px] bg-white/20 mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {siteContent.messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/[0.02] p-10 rounded-sm border border-white/10 hover:bg-white/[0.04] transition-colors duration-500"
                        >
                            <p className="text-white/70 font-light text-lg mb-8 leading-relaxed">
                                "{msg.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-[1px] bg-white/20" />
                                <div className="text-xs font-medium tracking-widest uppercase text-white/40">
                                    {msg.author}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default MessageWall
