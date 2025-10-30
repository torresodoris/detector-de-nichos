import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeNiche, generateProductIdeas, generateSellingAngles } from './services/geminiService';
import type { Problem, ProductIdea } from './types';

const App: React.FC = () => {
  const [niche, setNiche] = useState<string>('');
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [productIdeas, setProductIdeas] = useState<ProductIdea[] | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<ProductIdea | null>(null);
  const [sellingAngles, setSellingAngles] = useState<string[] | null>(null);

  const [isAnalyzingNiche, setIsAnalyzingNiche] = useState<boolean>(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [isGeneratingAngles, setIsGeneratingAngles] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setProblems(null);
    setSelectedProblem(null);
    setProductIdeas(null);
    setSelectedIdea(null);
    setSellingAngles(null);
    setError(null);
  };

  const handleSearch = useCallback(async (searchNiche: string) => {
    if (!searchNiche.trim()) {
      setError('Por favor, introduce un nicho para analizar.');
      return;
    }
    
    setIsAnalyzingNiche(true);
    resetState();
    setNiche(searchNiche);

    try {
      const problemsData = await analyzeNiche(searchNiche);
      setProblems(problemsData);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al analizar el nicho. Por favor, inténtalo de nuevo.');
    } finally {
      setIsAnalyzingNiche(false);
    }
  }, []);

  const handleProblemSelect = useCallback(async (problem: Problem) => {
    if (selectedProblem?.problem === problem.problem) return;

    setSelectedProblem(problem);
    setSelectedIdea(null);
    setProductIdeas(null);
    setSellingAngles(null);
    setIsGeneratingIdeas(true);
    setError(null);

    try {
        const ideas = await generateProductIdeas(problem, niche);
        setProductIdeas(ideas);
    } catch (err) {
        console.error(err);
        setError('No se pudieron generar las ideas de producto.');
    } finally {
        setIsGeneratingIdeas(false);
    }
  }, [niche, selectedProblem]);

  const handleIdeaSelect = useCallback(async (idea: ProductIdea) => {
    if (!selectedProblem || selectedIdea?.name === idea.name) return;

    setSelectedIdea(idea);
    setSellingAngles(null);
    setIsGeneratingAngles(true);
    setError(null);

    try {
        const angles = await generateSellingAngles(idea, selectedProblem, niche);
        setSellingAngles(angles);
    } catch (err) {
        console.error(err);
        setError('No se pudieron generar los ángulos de venta.');
    } finally {
        setIsGeneratingAngles(false);
    }
  }, [niche, selectedProblem, selectedIdea]);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <SearchForm onSearch={handleSearch} isLoading={isAnalyzingNiche} />
        
        {error && (
          <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-4xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {isAnalyzingNiche && <LoadingSpinner message="Analizando el mercado..." />}
        
        {problems && !isAnalyzingNiche && (
          <ResultsDisplay
            niche={niche}
            problems={problems}
            selectedProblem={selectedProblem}
            onProblemSelect={handleProblemSelect}
            isGeneratingIdeas={isGeneratingIdeas}
            productIdeas={productIdeas}
            selectedIdea={selectedIdea}
            onIdeaSelect={handleIdeaSelect}
            isGeneratingAngles={isGeneratingAngles}
            sellingAngles={sellingAngles}
          />
        )}

        {!problems && !isAnalyzingNiche && !error && (
            <div className="mt-12 text-center text-slate-500 max-w-xl mx-auto">
                <p>Introduce un tema o nicho de mercado para descubrir los principales problemas de los clientes y obtener ideas de productos digitales para solucionarlos.</p>
            </div>
        )}
      </main>
      <footer className="text-center py-4 text-slate-600 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;