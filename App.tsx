import React, { useState } from 'react';
import { INITIAL_ANSWERS } from './constants';
import { Answers } from './types';
import { useTariffCalculator } from './hooks/useTariffCalculator';
import { IntroView } from './views/IntroView';
import { WizardView } from './views/WizardView';
import { LoadingView } from './views/LoadingView';
import { ResultsView } from './views/ResultsView';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<'intro' | 'wizard' | 'analyzing' | 'results'>('intro');
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const resultsData = useTariffCalculator(answers, viewState === 'results');

  const startQuiz = () => setViewState('wizard');
  
  const handleComplete = (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setViewState('analyzing');
    // Simulate analyzing network delay/processing
    setTimeout(() => {
      setViewState('results');
    }, 800);
  };

  const resetQuiz = () => {
    setAnswers(INITIAL_ANSWERS);
    setViewState('intro');
  };

  const editAnswers = () => {
    setViewState('wizard');
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#e30611] rounded-lg flex items-center justify-center text-white font-bold">M</div>
             <span className="font-bold text-xl tracking-tight text-[#0f172a]">Tariff<span className="text-[#e30611]">Wizard</span></span>
           </div>
        </div>
      </header>

      <main>
        {viewState === 'intro' && <IntroView onStart={startQuiz} />}
        
        {viewState === 'wizard' && (
          <WizardView 
            initialAnswers={answers} 
            onComplete={handleComplete} 
            onCancel={resetQuiz} 
          />
        )}
        
        {viewState === 'analyzing' && <LoadingView />}
        
        {viewState === 'results' && (
          <ResultsView 
            data={resultsData} 
            onReset={resetQuiz} 
            onEdit={editAnswers}
          />
        )}
      </main>
    </div>
  );
};

export default App;