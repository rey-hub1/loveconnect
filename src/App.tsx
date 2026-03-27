/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Moon, 
  Stars, 
  MessageCircle, 
  Code2, 
  Award, 
  Github, 
  Mail, 
  HelpCircle, 
  Info,
  ChevronRight,
  Sparkles,
  User,
  Terminal,
  Swords,
  Trophy
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { casualQuestions } from './data/casualQuestions';
import { deepQuestions } from './data/deepQuestions';
import { versusQuestions, VersusQuestion } from './data/versusQuestions';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PROGRAMMER_NAME = "Reyno Nawfal Ghaisan";

const CodeSnippet = () => (
  <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-blue-300 border border-white/10 shadow-inner">
    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1">
      <Terminal size={12} className="text-gray-500" />
      <span className="text-gray-500 uppercase tracking-widest text-[10px]">Core Logic</span>
    </div>
    <div className="space-y-1">
      <p><span className="text-purple-400">async function</span> <span className="text-blue-400">buildConnection</span>(userA, userB) {'{'}</p>
      <p className="pl-4"><span className="text-purple-400">const</span> depth = <span className="text-purple-400">await</span> analyze(userA, userB);</p>
      <p className="pl-4"><span className="text-purple-400">if</span> (depth {'<'} <span className="text-orange-300">THRESHOLD</span>) {'{'}</p>
      <p className="pl-8 text-green-400">// Inject meaningful conversation</p>
      <p className="pl-8"><span className="text-purple-400">return</span> <span className="text-blue-400">generateQuestion</span>(<span className="text-yellow-200">'deep'</span>);</p>
      <p className="pl-4">{'}'}</p>
      <p className="pl-4 text-green-400">// Strengthen bond</p>
      <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-blue-400">sparkLove</span>();</p>
      <p>{'}'}</p>
    </div>
  </div>
);

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentVersusQuestion, setCurrentVersusQuestion] = useState<VersusQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'casual' | 'deep' | 'versus' | null>(null);
  const [seenCasual, setSeenCasual] = useState<string[]>([]);
  const [seenDeep, setSeenDeep] = useState<string[]>([]);
  const [seenVersus, setSeenVersus] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreCowok, setScoreCowok] = useState(0);
  const [scoreCewek, setScoreCewek] = useState(0);

  const renderFormattedText = (text: string, type: 'casual' | 'deep' | 'versus') => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const word = part.slice(1, -1);
        let colorClass = 'text-brand-pink font-bold';
        if (type === 'deep') colorClass = 'text-brand-blue font-bold';
        if (type === 'versus') colorClass = 'text-yellow-400 font-bold';
        
        return (
          <span key={index} className={colorClass}>
            {word}
          </span>
        );
      }
      return part;
    });
  };

  const generateQuestion = (type: 'casual' | 'deep' | 'versus') => {
    setIsLoading(true);
    setMode(type);
    setIsCompleted(false);
    
    if (type === 'versus') {
      const availableQuestions = versusQuestions.filter(q => !seenVersus.includes(q.text));
      if (availableQuestions.length === 0) {
        setTimeout(() => {
          setIsCompleted(true);
          setIsLoading(false);
        }, 50);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
      setSeenVersus(prev => [...prev, question.text]);
      setTimeout(() => {
        setCurrentVersusQuestion(question);
        setCurrentQuestion(question.text);
        setIsLoading(false);
      }, 10);
      return;
    }

    const allQuestions = type === 'casual' ? casualQuestions : deepQuestions;
    const seenQuestions = type === 'casual' ? seenCasual : seenDeep;
    
    // Filter out questions that have already been seen
    let availableQuestions = allQuestions.filter(q => !seenQuestions.includes(q));
    
    // If all questions have been seen
    if (availableQuestions.length === 0) {
      setTimeout(() => {
        setIsCompleted(true);
        setIsLoading(false);
      }, 50);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    
    // Add to seen list
    if (type === 'casual') {
      setSeenCasual(prev => [...prev, question]);
    } else {
      setSeenDeep(prev => [...prev, question]);
    }
    
    // Small delay to trigger the exit/entry animations
    setTimeout(() => {
      setCurrentQuestion(question);
      setIsLoading(false);
    }, 10);
  };

  const handleVersusVote = (target: 'cowok' | 'cewek') => {
    if (!currentVersusQuestion) return;
    
    const points = currentVersusQuestion.isNegative ? -1 : 1;
    if (target === 'cowok') setScoreCowok(prev => prev + points);
    else setScoreCewek(prev => prev + points);
    
    generateQuestion('versus');
  };

  const resetMode = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (mode === 'casual') setSeenCasual([]);
      else if (mode === 'deep') setSeenDeep([]);
      else {
        setSeenVersus([]);
        setScoreCowok(0);
        setScoreCewek(0);
      }
      setIsCompleted(false);
      generateQuestion(mode!);
    }, 50);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Programmer Profile */}
      <aside className="w-80 glass border-r border-white/10 p-8 hidden lg:flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-pink/50 glow-pink">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${PROGRAMMER_NAME}`} 
                alt="Developer" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-2 -right-2 glass px-2 py-1 rounded-full flex items-center gap-1 border border-brand-pink/30"
            >
              <Award size={14} className="text-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Top Talent</span>
            </motion.div>
          </motion.div>
          
          <div>
            <h3 className="text-xl font-serif italic text-brand-pink">Developer Profile</h3>
            <p className="text-sm text-gray-400 mt-1">
              Architected by <span className="text-white font-semibold">{PROGRAMMER_NAME}</span>
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mt-2 inline-block bg-brand-pink/10 text-brand-pink text-[10px] font-bold px-3 py-1 rounded-full border border-brand-pink/20"
            >
              THE GREATEST PROGRAMMER
            </motion.div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass p-4 rounded-xl border-white/5">
            <p className="text-xs leading-relaxed text-gray-300 italic">
              "Making human connections real through elegant code and heartfelt features. Known for intuitive UI and heart-driven algorithms."
            </p>
          </div>
          
          <CodeSnippet />
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <Github size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Github Portfolio</span>
          </motion.div>
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <Mail size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Contact Developer</span>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 lg:p-12">
        <header className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue"
          >
            LoveConnect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2 md:mt-4 tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs font-medium"
          >
            The App for Deeper Connections
          </motion.p>
        </header>

        {/* Cards / Interaction Area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!currentQuestion ? (
              <motion.div 
                key="choices"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="grid md:grid-cols-3 gap-6 w-full max-w-6xl"
              >
                {/* Fall in Love Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-brand-pink/20 flex flex-col items-center text-center gap-4 md:gap-6 relative overflow-hidden group cursor-pointer"
                  onClick={() => generateQuestion('casual')}
                >
                  <div className="absolute inset-0 bg-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink glow-pink group-hover:scale-110 transition-transform"
                  >
                    <Heart size={32} fill="currentColor" className="opacity-80 md:hidden" />
                    <Heart size={40} fill="currentColor" className="opacity-80 hidden md:block" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif italic mb-2">Fall in Love</h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Just Started? Get to know each other through fun & light questions.
                    </p>
                  </div>
                  <button className="mt-2 md:mt-4 px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-brand-pink text-brand-midnight font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-brand-pink/20">
                    Start Casual
                  </button>
                  <div className="absolute -bottom-4 -right-4 text-brand-pink/10 group-hover:text-brand-pink/20 transition-colors">
                    <Sparkles size={80} className="md:hidden" />
                    <Sparkles size={120} className="hidden md:block" />
                  </div>
                </motion.div>

                {/* Deep Talk Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-brand-blue/20 flex flex-col items-center text-center gap-4 md:gap-6 relative overflow-hidden group cursor-pointer"
                  onClick={() => generateQuestion('deep')}
                >
                  <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue glow-blue group-hover:scale-110 transition-transform"
                  >
                    <div className="relative">
                      <Moon size={32} fill="currentColor" className="opacity-80 md:hidden" />
                      <Moon size={40} fill="currentColor" className="opacity-80 hidden md:block" />
                      <Stars size={12} className="absolute -top-1 -right-1 animate-pulse md:hidden" />
                      <Stars size={16} className="absolute -top-1 -right-1 animate-pulse hidden md:block" />
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif italic mb-2">Deep Talk</h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Close already? Go deeper with meaningful topics & build trust.
                    </p>
                  </div>
                  <button className="mt-2 md:mt-4 px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-brand-blue text-white font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-brand-blue/20">
                    Start Deep
                  </button>
                  <div className="absolute -bottom-4 -right-4 text-brand-blue/10 group-hover:text-brand-blue/20 transition-colors">
                    <MessageCircle size={80} className="md:hidden" />
                    <MessageCircle size={120} className="hidden md:block" />
                  </div>
                </motion.div>

                {/* Versus Mode Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-yellow-500/20 flex flex-col items-center text-center gap-4 md:gap-6 relative overflow-hidden group cursor-pointer"
                  onClick={() => generateQuestion('versus')}
                >
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 glow-yellow group-hover:scale-110 transition-transform"
                  >
                    <Swords size={32} className="opacity-80 md:hidden" />
                    <Swords size={40} className="opacity-80 hidden md:block" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif italic mb-2">Versus Mode</h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Who is more...? Vote and see who wins the most points!
                    </p>
                  </div>
                  <button className="mt-2 md:mt-4 px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-yellow-500 text-brand-midnight font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-yellow-500/20">
                    Start Versus
                  </button>
                  <div className="absolute -bottom-4 -right-4 text-yellow-500/10 group-hover:text-yellow-500/20 transition-colors">
                    <Trophy size={80} className="md:hidden" />
                    <Trophy size={120} className="hidden md:block" />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="relative w-full max-w-2xl flex justify-center items-center">
                {/* Stacked Card Background (Ghost Card) */}
                {!isCompleted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 0.3, y: 8, scale: 0.99 }}
                    exit={{ opacity: 0, y: 0, scale: 1 }}
                    className="absolute inset-0 glass rounded-3xl md:rounded-[3rem] -z-10"
                  />
                )}
                
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div 
                    key={isCompleted ? "completed" : currentQuestion}
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      y: -20, 
                      scale: 0.99,
                      transition: { duration: 0.15, ease: "easeOut" }
                    }}
                    transition={{ 
                      type: "spring", 
                      damping: 30, 
                      stiffness: 300,
                      mass: 0.5
                    }}
                    className="glass p-6 md:p-12 rounded-3xl md:rounded-[3rem] w-full text-center relative overflow-hidden shadow-lg"
                  >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isCompleted 
                      ? "100%" 
                      : mode === 'versus'
                        ? `${(seenVersus.length / versusQuestions.length) * 100}%`
                        : `${((mode === 'casual' ? seenCasual.length : seenDeep.length) / (mode === 'casual' ? casualQuestions.length : deepQuestions.length)) * 100}%` 
                  }}
                  className={`absolute top-0 left-0 h-1 z-20 ${mode === 'casual' ? 'bg-brand-pink' : mode === 'deep' ? 'bg-brand-blue' : 'bg-yellow-500'}`} 
                />
                
                {!isCompleted && !isLoading && (
                  <motion.div 
                    key={`counter-${mode}-${seenCasual.length}-${seenDeep.length}-${seenVersus.length}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-6 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase"
                  >
                    {mode === 'versus' 
                      ? `Question ${seenVersus.length} of ${versusQuestions.length}`
                      : `Question ${mode === 'casual' ? seenCasual.length : seenDeep.length} of ${mode === 'casual' ? casualQuestions.length : deepQuestions.length}`
                    }
                  </motion.div>
                )}

                {/* Versus Score Display */}
                {mode === 'versus' && !isCompleted && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-12 left-0 right-0 flex justify-center gap-8"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Cowok</span>
                      <span className="text-2xl font-mono text-brand-blue">{scoreCowok}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 self-end mb-1" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Cewek</span>
                      <span className="text-2xl font-mono text-brand-pink">{scoreCewek}</span>
                    </div>
                  </motion.div>
                )}
                
                <div className="mb-6 md:mb-8 flex justify-center">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading-icon"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles size={48} className="text-white/50" />
                      </motion.div>
                    ) : isCompleted ? (
                      <motion.div
                        key="completed-icon"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                        className="flex gap-2"
                      >
                        <Heart size={48} fill="currentColor" className="text-brand-pink glow-pink" />
                        <Stars size={48} className="text-brand-blue glow-blue" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="active-icon"
                        initial={{ scale: 0, rotate: -180, y: 40 }}
                        animate={{ scale: 1, rotate: 0, y: 0 }}
                        transition={{ 
                          type: "spring", 
                          damping: 12, 
                          stiffness: 200,
                          delay: 0.1
                        }}
                      >
                        {mode === 'casual' ? (
                          <Heart size={48} className="text-brand-pink drop-shadow-[0_0_10px_rgba(255,175,189,0.5)]" />
                        ) : mode === 'deep' ? (
                          <MessageCircle size={48} className="text-brand-blue drop-shadow-[0_0_10px_rgba(33,147,176,0.5)]" />
                        ) : (
                          <Swords size={48} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  {isCompleted ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl md:text-4xl font-serif italic leading-tight text-white">
                        {mode === 'versus' ? 'Versus Mode Selesai!' : 'Semua pertanyaan telah terjawab...'}
                      </h3>
                      {mode === 'versus' ? (
                        <div className="space-y-4">
                          <p className="text-yellow-500 font-serif italic text-xl md:text-2xl">
                            {scoreCowok > scoreCewek 
                              ? "Cowok Menang! Dia yang paling berhak dapet perhatian lebih hari ini." 
                              : scoreCewek > scoreCowok 
                                ? "Cewek Menang! Waktunya cowok buat manjain ceweknya." 
                                : "Hasilnya Seri! Kalian berdua sama-sama luar biasa."}
                          </p>
                          <div className="flex justify-center gap-12 pt-4">
                            <div className="text-center">
                              <p className="text-[10px] uppercase text-gray-500 font-bold">Cowok</p>
                              <p className="text-4xl font-mono text-brand-blue">{scoreCowok}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] uppercase text-gray-500 font-bold">Cewek</p>
                              <p className="text-4xl font-mono text-brand-pink">{scoreCewek}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-brand-pink font-serif italic text-xl md:text-2xl">
                          "Semoga hubungan kalian langgeng, penuh cinta, dan selalu bahagia selamanya."
                        </p>
                      )}
                      <div className="flex justify-center gap-2 text-white/30">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart size={16} fill="currentColor" /></motion.div>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}><Heart size={16} fill="currentColor" /></motion.div>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}><Heart size={16} fill="currentColor" /></motion.div>
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-serif italic leading-tight text-white mb-8 md:mb-12">
                      {isLoading ? (
                        <span className="text-white/30 italic">Crafting a special moment...</span>
                      ) : renderFormattedText(currentQuestion!, mode!)}
                    </h3>
                  )}
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-8">
                  {isCompleted ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetMode}
                      className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-blue text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-xl"
                    >
                      Ulangi Pertanyaan
                    </motion.button>
                  ) : mode === 'versus' ? (
                    <div className="flex gap-4 w-full max-w-md">
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVersusVote('cowok')}
                        disabled={isLoading}
                        className="flex-1 px-6 py-4 rounded-2xl bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/30 transition-colors flex flex-col items-center gap-2 group"
                      >
                        <User size={24} className="text-brand-blue group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Cowok</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVersusVote('cewek')}
                        disabled={isLoading}
                        className="flex-1 px-6 py-4 rounded-2xl bg-brand-pink/20 hover:bg-brand-pink/30 border border-brand-pink/30 transition-colors flex flex-col items-center gap-2 group"
                      >
                        <User size={24} className="text-brand-pink group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">Cewek</span>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generateQuestion(mode!)}
                      disabled={isLoading}
                      className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-bold text-xs md:text-sm tracking-widest uppercase disabled:opacity-50 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Next Question</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      />
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentQuestion(null);
                      setIsCompleted(false);
                      setScoreCowok(0);
                      setScoreCewek(0);
                    }}
                    className="px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-bold text-xs md:text-sm tracking-widest uppercase"
                  >
                    Change Mode
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-wider uppercase font-bold text-gray-400">
              {PROGRAMMER_NAME} Studios.
            </p>
            <p className="text-[10px] italic">
              Created with love by the world's greatest developer to build special moments.
            </p>
          </div>
          
          <nav className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
            <a href="#" className="hover:text-brand-pink transition-colors">About Us</a>
            <a href="#" className="hover:text-brand-pink transition-colors">FAQ</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Contact</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Github</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
