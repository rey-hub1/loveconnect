import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import Layout from '../components/Layout';

const faqs = [
  {
    category: "Game Basics",
    questions: [
      {
        q: "What is LoveConnect?",
        a: "LoveConnect is an interactive deep conversation and relationship game designed to build stronger bonds, improve communication, and bring fun to your relationship through curated question modes."
      },
      {
        q: "Do we have to answer every question?",
        a: "No! The goal is to build connection. If a question feels too much, feel free to skip it. The game is just a tool to help you start your own unique conversations."
      }
    ]
  },
  {
    category: "Game Modes",
    questions: [
      {
        q: "What's the difference between Casual and Deep modes?",
        a: "Casual Mode is perfect for new relationships or light-hearted fun. Deep Mode is designed for established couples looking to tackle more meaningful and vulnerable topics."
      },
      {
        q: "How does Versus Mode work?",
        a: "Versus Mode is a fun, lighthearted way to see who knows who best or who is more likely to do something. Points are tracked, and the winner gets bragging rights!"
      },
      {
        q: "Is Married Life only for married people?",
        a: "Not at all! While it focuses on long-term commitment and building a home together, it's great for any couple who is serious about their future together."
      }
    ]
  },
  {
    category: "Privacy & Technology",
    questions: [
      {
        q: "Where is my data stored?",
        a: "LoveConnect is a privacy-first app. All game logic runs locally in your browser. We don't save your answers or personal data on any server."
      },
      {
        q: "Is an AI generating these questions?",
        a: "Some of our questions are crafted and refined using Gemini AI to ensure they are high-quality and impactful, but the majority are curated based on relationship science."
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif italic mb-6">Frequently Asked</h2>
          <p className="text-gray-400">Everything you need to know about the LoveConnect experience.</p>
        </motion.div>

        <div className="space-y-12">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-pink/60 px-4">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.questions.map((faq, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <motion.div 
                      key={id}
                      className={`glass rounded-2xl md:rounded-[2rem] overflow-hidden border transition-colors ${isOpen ? 'border-brand-pink/30' : 'border-white/5'}`}
                      initial={false}
                    >
                      <button 
                        onClick={() => toggle(id)}
                        className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                      >
                        <span className="font-serif italic text-lg">{faq.q}</span>
                        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-pink/10 text-brand-pink' : ''}`}>
                          <ChevronDown size={18} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-6 pt-0 text-gray-400 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center p-8 glass rounded-3xl"
        >
          <p className="text-gray-400 text-sm italic">Still have questions? Feel free to reach out to us!</p>
          <a href="/contact" className="mt-4 inline-block text-brand-pink font-bold border-b border-brand-pink/30 hover:border-brand-pink transition-all pb-1">
            Contact Support
          </a>
        </motion.div>
      </div>
    </Layout>
  );
}
