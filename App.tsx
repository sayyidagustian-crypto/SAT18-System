
import React, { useState, useCallback } from 'react';
import { SectionCard } from './components/SectionCard';
import { CodeBlock } from './components/CodeBlock';
import { generateArchitectResponse } from './services/geminiService';
import type { Section } from './types';
import { sectionsData, principlesData } from './constants';

const App: React.FC = () => {
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleModuleChoice = useCallback(async (moduleName: string) => {
        setSelectedModule(moduleName);
        setIsLoading(true);
        setError('');
        setAiResponse('');
        try {
            const response = await generateArchitectResponse(moduleName);
            setAiResponse(response);
        } catch (err) {
            setError('Gagal mendapatkan respon dari AI. Silakan coba lagi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-sat-blue font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white mb-2">
                        🧭 Kerangka Dasar Sistem Deploy Mandiri SAT18
                    </h1>
                    <p className="text-lg text-sat-lightgray">
                        Blueprint arsitektur untuk pondasi sistem yang jelas dan kokoh.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionsData.map((section: Section) => (
                        <SectionCard key={section.title} emoji={section.emoji} title={section.title} description={section.description}>
                            {section.content.type === 'list' && (
                                <ul className="space-y-3 list-inside list-none">
                                    {section.content.items.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-sat-accent mr-3 mt-1">→</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {section.content.type === 'code' && (
                                <CodeBlock code={section.content.items.join('\n')} />
                            )}
                        </SectionCard>
                    ))}

                    <div className="md:col-span-2 lg:col-span-3">
                        <SectionCard emoji="✅" title="Prinsip Utama Kerangka" description="Fondasi yang menopang seluruh arsitektur sistem.">
                            <ul className="space-y-3 list-inside list-none">
                                {principlesData.map((principle, index) => (
                                     <li key={index} className="flex items-center p-2 rounded-md hover:bg-sat-gray transition-colors duration-200">
                                        <span className="text-lg mr-4">{principle.emoji}</span>
                                        <div>
                                            <h4 className="font-bold text-sat-white">{principle.title}</h4>
                                            <p className="text-sm text-sat-lightgray">{principle.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 bg-sat-lightblue p-6 rounded-xl shadow-2xl border border-sat-gray">
                        <h2 className="text-2xl font-bold text-center mb-4 text-sat-white">Langkah Berikutnya: Mengisi Modul Inti</h2>
                        <p className="text-center text-sat-lightgray mb-6">Kalau Anda setuju dengan kerangka dasar ini, dari mana kita harus memulai?</p>
                        <div className="flex justify-center gap-4 mb-6">
                             <button
                                onClick={() => handleModuleChoice('Core Engine')}
                                disabled={isLoading}
                                className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                Mulai dari Core Engine
                            </button>
                             <button
                                onClick={() => handleModuleChoice('Local Memory')}
                                disabled={isLoading}
                                className="px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-lg hover:bg-sat-lightgray transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                Mulai dari Local Memory
                            </button>
                        </div>

                        {isLoading && (
                            <div className="text-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sat-accent mx-auto"></div>
                                <p className="mt-3 text-sat-lightgray">Menganalisa pilihan strategis...</p>
                            </div>
                        )}
                        {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                        {aiResponse && (
                            <div className="p-6 bg-sat-blue rounded-lg border border-sat-accent/30 prose prose-invert max-w-none text-sat-white">
                                <h3 className="text-xl font-bold text-sat-accent mb-3">Analisa Strategis: Memulai dari {selectedModule}</h3>
                                {aiResponse.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                 <footer className="text-center mt-12 text-sat-gray">
                    <p>SAT18 Independent Deployment System Blueprint</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
