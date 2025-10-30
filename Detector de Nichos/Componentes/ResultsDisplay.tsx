import React from 'react';
import type { Problem, ProductIdea } from '../types';
import { ProblemCard } from './ProblemCard';
import { IdeaCard } from './IdeaCard';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { WarningIcon } from './icons/WarningIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { LoadingSpinner } from './LoadingSpinner';
import { SellingAnglesCard } from './SellingAnglesCard';


interface ResultsDisplayProps {
  niche: string;
  problems: Problem[];
  selectedProblem: Problem | null;
  onProblemSelect: (problem: Problem) => void;
  isGeneratingIdeas: boolean;
  productIdeas: ProductIdea[] | null;
  selectedIdea: ProductIdea | null;
  onIdeaSelect: (idea: ProductIdea) => void;
  isGeneratingAngles: boolean;
  sellingAngles: string[] | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    niche, problems, selectedProblem, onProblemSelect, 
    isGeneratingIdeas, productIdeas, selectedIdea, onIdeaSelect,
    isGeneratingAngles, sellingAngles
}) => {
  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-10">
        Análisis del Nicho: <span className="text-brand-secondary">{niche}</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        
        {/* Problems Column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-slate-300">
            <WarningIcon />
            1. Problemas Detectados
          </h3>
          <div className="space-y-4">
            {problems.map((p, index) => (
              <ProblemCard 
                key={index} 
                problem={p} 
                index={index + 1}
                isSelected={selectedProblem?.problem === p.problem}
                onClick={() => onProblemSelect(p)}
              />
            ))}
          </div>
        </div>
        
        {/* Ideas & Angles Column */}
        <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-8">
                {/* Product Ideas Section */}
                <div>
                    <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-slate-300">
                        <LightbulbIcon />
                        2. Ideas de Solución
                    </h3>
                    {isGeneratingIdeas && <LoadingSpinner message="Generando ideas de producto..." />}
                    {!selectedProblem && !isGeneratingIdeas && (
                        <div className="text-center py-10 px-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
                            <p className="text-slate-400">Selecciona un problema de la izquierda para generar ideas de solución.</p>
                        </div>
                    )}
                    {productIdeas && !isGeneratingIdeas && (
                        <div className="space-y-4">
                            {productIdeas.map((idea, index) => (
                                <IdeaCard 
                                    key={index} 
                                    idea={idea} 
                                    isSelected={selectedIdea?.name === idea.name}
                                    onClick={() => onIdeaSelect(idea)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Selling Angles Section */}
                <div className="mt-10">
                    <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-slate-300">
                      <MegaphoneIcon />
                      3. Ángulos de Venta
                    </h3>
                     {isGeneratingAngles && <LoadingSpinner message="Creando ángulos de venta..." />}
                    {!selectedIdea && !isGeneratingAngles && selectedProblem && (
                        <div className="text-center py-10 px-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
                            <p className="text-slate-400">Ahora, selecciona una idea de producto para crear sus ángulos de venta.</p>
                        </div>
                    )}
                    {sellingAngles && !isGeneratingAngles && (
                        <SellingAnglesCard angles={sellingAngles} ideaName={selectedIdea?.name || ''}/>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};