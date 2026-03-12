import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Clock, 
  Zap, 
  Calendar, 
  User, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';
import { UserProfile, WorkoutPlan, EnergyLevel } from './types';
import { generateWorkout } from './services/geminiService';
import Markdown from 'react-markdown';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    weight: 65,
    height: 165,
    energyLevel: 'medium',
    availableTime: 20,
    cycleDay: undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'energyLevel' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateWorkout(profile);
      setWorkout(result);
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd podczas generowania treningu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-100">
      {/* Header */}
      <header className="py-8 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-brand-500 rounded-2xl mb-4 shadow-lg shadow-brand-500/20"
        >
          <Dumbbell className="text-white w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-brand-700 mb-2">
          Fit@Home
        </h1>
        <p className="text-stone-600 max-w-md mx-auto italic">
          Spersonalizowany trening bez sprzętu, dopasowany do Twojego życia i energii.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <section className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-brand-100"
            >
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" />
                Twój Profil
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">Wiek</label>
                    <input 
                      type="number" 
                      name="age"
                      value={profile.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">Waga (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={profile.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">Wzrost (cm)</label>
                  <input 
                    type="number" 
                    name="height"
                    value={profile.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">Dzień cyklu (opcjonalnie)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      type="number" 
                      name="cycleDay"
                      placeholder="Np. 14"
                      value={profile.cycleDay || ''}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">Poziom energii</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setProfile(p => ({ ...p, energyLevel: level }))}
                        className={`py-2 rounded-xl text-sm font-medium transition-all border ${
                          profile.energyLevel === level 
                            ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20' 
                            : 'bg-white text-stone-600 border-stone-100 hover:border-brand-200'
                        }`}
                      >
                        {level === 'low' ? 'Niski' : level === 'medium' ? 'Średni' : 'Wysoki'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 ml-1 flex justify-between">
                    Dostępny czas <span>{profile.availableTime} min</span>
                  </label>
                  <input 
                    type="range" 
                    name="availableTime"
                    min="5" 
                    max="60" 
                    step="5"
                    value={profile.availableTime}
                    onChange={handleInputChange}
                    className="w-full accent-brand-500 h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      Generuj Trening
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </section>

          {/* Result Section */}
          <section className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!workout && !loading && !error && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-stone-200"
                >
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-stone-300" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-400 mb-2">Twój plan czeka</h3>
                  <p className="text-stone-400 text-sm max-w-xs">
                    Wypełnij formularz po lewej, aby otrzymać spersonalizowany zestaw ćwiczeń.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
                    <Dumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-500 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-700 mt-6 mb-2">Tworzymy Twój plan...</h3>
                  <p className="text-stone-500 text-sm italic">
                    Analizujemy Twój poziom energii i czas, aby dobrać najlepsze ćwiczenia.
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center"
                >
                  <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-700 font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-4 text-red-600 underline text-sm"
                  >
                    Spróbuj ponownie
                  </button>
                </motion.div>
              )}

              {workout && !loading && (
                <motion.div 
                  key="workout"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="bg-brand-700 text-white rounded-3xl p-8 shadow-xl shadow-brand-700/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Plan gotowy
                      </div>
                      <h2 className="text-3xl font-serif font-bold mb-6">Twój Trening Dzisiaj</h2>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                          <div className="flex items-center gap-2 text-brand-100 text-xs mb-1">
                            <Clock className="w-3 h-3" /> Czas
                          </div>
                          <div className="text-2xl font-bold">{workout.duration} min</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                          <div className="flex items-center gap-2 text-brand-100 text-xs mb-1">
                            <Flame className="w-3 h-3" /> Kalorie
                          </div>
                          <div className="text-2xl font-bold">~{workout.totalCalories} kcal</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advice Card */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                    <div className="bg-amber-100 p-2 rounded-full h-fit">
                      <Info className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm mb-1">Wskazówka dla Ciebie</h4>
                      <p className="text-amber-800 text-sm leading-relaxed">{workout.advice}</p>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-8">
                    {workout.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-4">
                        <h3 className="text-lg font-serif font-bold text-stone-800 flex items-center gap-2 ml-2">
                          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {sIdx + 1}
                          </span>
                          {section.title}
                        </h3>
                        
                        <div className="grid gap-4">
                          {section.exercises.map((ex, eIdx) => (
                            <motion.div 
                              key={eIdx}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (sIdx * 0.1) + (eIdx * 0.05) }}
                              className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                                  {ex.name}
                                </h4>
                                <span className="text-xs font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-lg">
                                  {ex.repsOrDuration}
                                </span>
                              </div>
                              <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                                {ex.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs font-semibold text-stone-400">
                                <span className="flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-brand-500" />
                                  ~{ex.caloriesEstimate} kcal
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setWorkout(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 text-stone-400 hover:text-brand-600 font-medium text-sm transition-colors"
                  >
                    Zacznij od nowa
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-stone-100 text-center">
        <p className="text-stone-400 text-xs uppercase tracking-widest font-bold mb-4">
          Fit@Home &copy; 2026
        </p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-stone-400 hover:text-brand-500 transition-colors"><Info className="w-5 h-5" /></a>
          <a href="#" className="text-stone-400 hover:text-brand-500 transition-colors"><User className="w-5 h-5" /></a>
        </div>
      </footer>
    </div>
  );
}
