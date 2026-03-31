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
  Sparkles,
  User,
  Swords,
  Trophy,
  Home as HomeIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { casualQuestions } from '../data/casualQuestions';
import { deepQuestions } from '../data/deepQuestions';
import { versusQuestions, VersusQuestion } from '../data/versusQuestions';
import { marriedQuestions } from '../data/marriedQuestions';
import Layout from '../components/Layout';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PROGRAMMER_NAME = "Reyno Nawfal Ghaisan";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentVersusQuestion, setCurrentVersusQuestion] = useState<VersusQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'casual' | 'deep' | 'versus' | 'married' | null>(null);
  const [seenCasual, setSeenCasual] = useState<string[]>([]);
  const [seenDeep, setSeenDeep] = useState<string[]>([]);
  const [seenVersus, setSeenVersus] = useState<string[]>([]);
  const [seenMarried, setSeenMarried] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreCowok, setScoreCowok] = useState(0);
  const [scoreCewek, setScoreCewek] = useState(0);

  useEffect(() => {
    if (!mode) {
      document.title = "LoveConnect - Deep Conversation & Relationship Game";
    } else {
      const modeNames = {
        casual: "Casual Mode",
        deep: "Deep Talk Mode",
        versus: "Versus Mode",
        married: "Married Life Mode"
      };
      document.title = `${modeNames[mode]} | LoveConnect`;
    }
  }, [mode]);

  const renderFormattedText = (text: string, type: 'casual' | 'deep' | 'versus' | 'married') => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const word = part.slice(1, -1);
        let colorClass = 'text-brand-pink font-bold';
        if (type === 'deep') colorClass = 'text-brand-blue font-bold';
        if (type === 'versus') colorClass = 'text-yellow-400 font-bold';
        if (type === 'married') colorClass = 'text-purple-400 font-bold';
        
        return (
          <span key={index} className={colorClass}>
            {word}
          </span>
        );
      }
      return part;
    });
  };

  const generateQuestion = (type: 'casual' | 'deep' | 'versus' | 'married') => {
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

    const allQuestions = type === 'casual' ? casualQuestions : type === 'deep' ? deepQuestions : marriedQuestions;
    const seenQuestions = type === 'casual' ? seenCasual : type === 'deep' ? seenDeep : seenMarried;
    
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
    } else if (type === 'deep') {
      setSeenDeep(prev => [...prev, question]);
    } else {
      setSeenMarried(prev => [...prev, question]);
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
      else if (mode === 'married') setSeenMarried([]);
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
    <Layout>
        {/* Cards / Interaction Area */}

        {/* Cards / Interaction Area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!currentQuestion ? (
                <motion.div 
                  key="choices"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
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

                  {/* Married Life Card */}
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-purple-500/20 flex flex-col items-center text-center gap-4 md:gap-6 relative overflow-hidden group cursor-pointer"
                    onClick={() => generateQuestion('married')}
                  >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 glow-purple group-hover:scale-110 transition-transform"
                    >
                      <HomeIcon size={32} className="opacity-80 md:hidden" />
                      <HomeIcon size={40} className="opacity-80 hidden md:block" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif italic mb-2">Married Life</h2>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Building a home? Strengthen your bond with marriage-focused topics.
                      </p>
                    </div>
                    <button className="mt-2 md:mt-4 px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-purple-500 text-white font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-purple-500/20">
                      Start Married
                    </button>
                    <div className="absolute -bottom-4 -right-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                      <Heart size={80} className="md:hidden" />
                      <Heart size={120} className="hidden md:block" />
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
                {/* Static Progress Bar */}
                <div 
                  style={{ 
                    width: isCompleted 
                      ? "100%" 
                      : mode === 'versus'
                        ? `${(seenVersus.length / versusQuestions.length) * 100}%`
                        : mode === 'married'
                          ? `${(seenMarried.length / marriedQuestions.length) * 100}%`
                          : `${((mode === 'casual' ? seenCasual.length : seenDeep.length) / (mode === 'casual' ? casualQuestions.length : deepQuestions.length)) * 100}%` 
                  }}
                  className={`absolute top-0 left-0 h-1 z-20 transition-none ${mode === 'casual' ? 'bg-brand-pink' : mode === 'deep' ? 'bg-brand-blue' : mode === 'married' ? 'bg-purple-500' : 'bg-yellow-500'}`} 
                />
                
                {!isCompleted && !isLoading && (
                  <div className="absolute top-4 right-6 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                    {mode === 'versus' 
                      ? `Question ${seenVersus.length} of ${versusQuestions.length}`
                      : mode === 'married'
                        ? `Question ${seenMarried.length} of ${marriedQuestions.length}`
                        : `Question ${mode === 'casual' ? seenCasual.length : seenDeep.length} of ${mode === 'casual' ? casualQuestions.length : deepQuestions.length}`
                    }
                  </div>
                )}

                {/* Versus Score Display */}
                {mode === 'versus' && !isCompleted && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-12 left-0 right-0 flex justify-center gap-8"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Boy</span>
                      <span className="text-2xl font-mono text-brand-blue">{scoreCowok}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 self-end mb-1" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Girl</span>
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
                        ) : mode === 'married' ? (
                          <HomeIcon size={48} className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
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
                        {mode === 'versus' ? 'Versus Mode Finished!' : 'All questions have been answered...'}
                      </h3>
                      {mode === 'versus' ? (
                        <div className="space-y-4">
                          <p className="text-yellow-500 font-serif italic text-xl md:text-2xl">
                            {scoreCowok > scoreCewek 
                              ? "Boy Wins! He deserves extra attention today." 
                              : scoreCewek > scoreCowok 
                                ? "Girl Wins! Time for the guy to pamper his girl." 
                                : "It's a Tie! You both are equally amazing."}
                          </p>
                          <div className="flex justify-center gap-12 pt-4">
                            <div className="text-center">
                              <p className="text-[10px] uppercase text-gray-500 font-bold">Boy</p>
                              <p className="text-4xl font-mono text-brand-blue">{scoreCowok}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] uppercase text-gray-500 font-bold">Girl</p>
                              <p className="text-4xl font-mono text-brand-pink">{scoreCewek}</p>
                            </div>
                          </div>
                        </div>
                      ) : mode === 'married' ? (
                        <p className="text-purple-400 font-serif italic text-xl md:text-2xl">
                          "Marriage is a journey of a thousand miles. May yours be filled with endless joy and discovery."
                        </p>
                      ) : (
                        <p className="text-brand-pink font-serif italic text-xl md:text-2xl">
                          "May your relationship be long-lasting, full of love, and always happy forever."
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

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mt-12">
                  {isCompleted ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetMode}
                      className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-brand-pink to-brand-blue text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase shadow-xl"
                    >
                      Repeat Questions
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
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Boy</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVersusVote('cewek')}
                        disabled={isLoading}
                        className="flex-1 px-6 py-4 rounded-2xl bg-brand-pink/20 hover:bg-brand-pink/30 border border-brand-pink/30 transition-colors flex flex-col items-center gap-2 group"
                      >
                        <User size={24} className="text-brand-pink group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">Girl</span>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generateQuestion(mode!)}
                      disabled={isLoading}
                      className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors font-bold text-xs md:text-sm tracking-[0.2em] uppercase disabled:opacity-50 relative overflow-hidden group shadow-xl"
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
                    className="px-4 py-2 rounded-full border border-white/5 hover:bg-white/5 transition-all font-bold text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/50 mt-4 sm:mt-0"
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
    </Layout>
  );
}
