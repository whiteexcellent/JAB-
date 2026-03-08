import React from 'react'
import { motion } from 'framer-motion'
import { siteContent } from '../data/content'

const MemoryGallery = () => {
    return (
        <section className="relative w-full py-32 bg-[#0c0d12] overflow-hidden border-t border-white/5">

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">
                        Arşiv
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light text-white/90 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Birlikte Geçen Anılar
                    </h2>
                    <div className="w-8 h-[1px] bg-white/20 mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {siteContent.memoryCards.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -10, transition: { duration: 0.4 } }}
                            className="group cursor-pointer relative"
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-white/5 rounded-sm relative border border-white/10">
                                <motion.img
                                    src={card.image}
                                    alt={card.caption}
                                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    <p className="text-white/90 font-light text-lg">
                                        {card.caption}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MemoryGallery
