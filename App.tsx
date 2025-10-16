
import React, { useState, useCallback } from 'react';
import { SectionCard } from './components/SectionCard';
import { CodeBlock } from './components/CodeBlock';
import { generateAiResponse } from './services/geminiService';
import type { Section } from './types';
import { sectionsData, principlesData, coreEngineDetail, integrationFlowDetail, simulationDetail, uxImplementationDetail } from './constants';

const App: React.FC = () => {
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [viewingDetail, setViewingDetail] = useState<'core-engine' | 'integration-flow' | 'simulation' | 'ux-implementation' | null>(null);

    const handleChoice = useCallback(async (choice: string, context: 'module_choice' | 'next_step' | 'simulation_choice' | 'ux_choice' | 'implementation_choice') => {
        if (context === 'next_step' && choice === 'Buat alur integrasi sederhana') {
            setViewingDetail('integration-flow');
            setAiResponse('');
            setSelectedModule(null);
            return;
        }
        
        if (context === 'simulation_choice' && choice === 'Lakukan simulasi pipeline') {
            setViewingDetail('simulation');
            setAiResponse('');
            setSelectedModule(null);
            return;
        }
        
        if (context === 'ux_choice' && choice === 'Sempurnakan UX output pipeline') {
            // This choice now leads to the implementation view
            setAiResponse('');
            setSelectedModule(null);
            // We just need to show the next decision, which is done by the renderSimulationView
            // The button there will call with the new context.
            // Let's just generate the AI response for this choice for now.
        }
        
        if (context === 'implementation_choice' && choice === "Buat helper kecil (logger.js)") {
            setViewingDetail('ux-implementation');
            setAiResponse('');
            setSelectedModule(null);
            return;
        }

        setSelectedModule(choice);
        setIsLoading(true);
        setError('');
        setAiResponse('');
        try {
            const response = await generateAiResponse(choice, context);
            setAiResponse(response);
        } catch (err)
 {
            setError('Gagal mendapatkan respon dari AI. Silakan coba lagi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const renderBlueprintView = () => (
        <>
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
                    <SectionCard 
                        key={section.title} 
                        emoji={section.emoji} 
                        title={section.title} 
                        description={section.description}
                        onClick={section.title === "Core Engine (Dasar Sistem)" ? () => setViewingDetail('core-engine') : undefined}
                    >
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
                            onClick={() => handleChoice('Core Engine', 'module_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Mulai dari Core Engine
                        </button>
                         <button
                            onClick={() => handleChoice('Local Memory', 'module_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-lg hover:bg-sat-lightgray transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Mulai dari Local Memory
                        </button>
                    </div>
                    {isLoading && !aiResponse && (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sat-accent mx-auto"></div>
                            <p className="mt-3 text-sat-lightgray">Menganalisa pilihan strategis...</p>
                        </div>
                    )}
                    {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                    {aiResponse && selectedModule && (
                        <div className="p-6 bg-sat-blue rounded-lg border border-sat-accent/30 prose prose-invert max-w-none text-sat-white">
                            <h3 className="text-xl font-bold text-sat-accent mb-3">Analisa Strategis: Memulai dari {selectedModule}</h3>
                            {aiResponse.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );

    const renderCoreEngineDetailView = () => (
        <div>
            <header className="mb-10">
                 <button onClick={() => setViewingDetail(null)} className="flex items-center text-sat-accent mb-6 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Kerangka Dasar
                </button>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white text-center">{coreEngineDetail.title}</h1>
            </header>

            <main className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {coreEngineDetail.modules.map(module => (
                        <div key={module.id} className="bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50">
                            <h3 className="text-2xl font-bold mb-2 text-sat-white">{module.title}</h3>
                            <p className="text-sm text-sat-lightgray mb-4">{module.description}</p>
                            <CodeBlock code={module.code} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <SectionCard emoji={coreEngineDetail.flow.title.substring(0,2)} title={coreEngineDetail.flow.title.substring(3)} description="Langkah-langkah eksekusi dari awal hingga akhir.">
                        <ul className="space-y-2 list-inside list-none">
                            {coreEngineDetail.flow.steps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-sat-accent mr-3 mt-1">→</span>
                                    <span dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code class="bg-sat-blue px-1.5 py-0.5 rounded text-sat-accent text-sm">$1</code>') }}></span>
                                </li>
                            ))}
                        </ul>
                    </SectionCard>
                    <SectionCard emoji={coreEngineDetail.output.title.substring(0,2)} title={coreEngineDetail.output.title.substring(3)} description="Hasil nyata yang diproduksi oleh Core Engine.">
                       <ul className="space-y-2 list-inside list-none">
                           {coreEngineDetail.output.items.map((item, index) => (
                                <li key={index} className="flex items-start">
                                     <span className="text-sat-accent mr-3 mt-1">→</span>
                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="bg-sat-blue px-1.5 py-0.5 rounded text-sat-accent text-sm">$1</code>') }}></span>
                                </li>
                           ))}
                       </ul>
                    </SectionCard>
                </div>
                
                <div className="bg-sat-lightblue p-6 rounded-xl shadow-2xl border border-sat-gray">
                    <h2 className="text-2xl font-bold text-center mb-4 text-sat-white">Rancangan Selesai, Apa Selanjutnya?</h2>
                    <p className="text-center text-sat-lightgray mb-6">Pilih langkah implementasi berikutnya untuk Core Engine.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                         <button
                            onClick={() => handleChoice('Buat alur integrasi sederhana', 'next_step')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Integrasi Sederhana (deploy-local.js)
                        </button>
                         <button
                            onClick={() => handleChoice('Perkaya Error Analyzer', 'next_step')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-lg hover:bg-sat-lightgray transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Perkaya Error Analyzer
                        </button>
                    </div>
                     {isLoading && !aiResponse && (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sat-accent mx-auto"></div>
                            <p className="mt-3 text-sat-lightgray">Menganalisa pilihan strategis...</p>
                        </div>
                    )}
                    {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                    {aiResponse && selectedModule && (
                         <div className="p-6 bg-sat-blue rounded-lg border border-sat-accent/30 prose prose-invert max-w-none text-sat-white">
                            <h3 className="text-xl font-bold text-sat-accent mb-3">Analisa Strategis: Memilih "{selectedModule}"</h3>
                            {aiResponse.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
    
    const renderIntegrationFlowView = () => (
        <div>
            <header className="mb-10">
                 <button onClick={() => setViewingDetail('core-engine')} className="flex items-center text-sat-accent mb-6 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Rancangan Core Engine
                </button>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white text-center">{integrationFlowDetail.title}</h1>
                 <p className="text-lg text-center text-sat-lightgray mt-2">{integrationFlowDetail.subtitle}</p>
            </header>
            <main className="space-y-8">
                 <div className="bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50">
                    <h3 className="text-2xl font-bold mb-2 text-sat-white">{integrationFlowDetail.script.title}</h3>
                    <p className="text-sm text-sat-lightgray mb-4">{integrationFlowDetail.script.description}</p>
                    <CodeBlock code={integrationFlowDetail.script.code} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SectionCard emoji={integrationFlowDetail.workflow.title.substring(0,2)} title={integrationFlowDetail.workflow.title.substring(3)} description="Langkah-langkah eksekusi dari awal hingga akhir.">
                        <ul className="space-y-2 list-inside list-none">
                            {integrationFlowDetail.workflow.steps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-sat-accent mr-3 mt-1">→</span>
                                    <span dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code class="bg-sat-blue px-1.5 py-0.5 rounded text-sat-accent text-sm">$1</code>') }}></span>
                                </li>
                            ))}
                        </ul>
                    </SectionCard>
                    <SectionCard emoji={integrationFlowDetail.benefits.title.substring(0,2)} title={integrationFlowDetail.benefits.title.substring(3)} description="Hasil nyata yang didapat dari pendekatan ini.">
                       <ul className="space-y-2 list-inside list-none">
                           {integrationFlowDetail.benefits.items.map((item, index) => (
                                <li key={index} className="flex items-start">
                                     <span className="text-sat-accent mr-3 mt-1">→</span>
                                     <span>{item}</span>
                                </li>
                           ))}
                       </ul>
                    </SectionCard>
                </div>

                <div className="bg-sat-lightblue p-6 rounded-xl shadow-2xl border border-sat-gray">
                    <h2 className="text-2xl font-bold text-center mb-4 text-sat-white">Pipeline Terbentuk, Selanjutnya?</h2>
                    <p className="text-center text-sat-lightgray mb-6">Bagaimana kita akan memvalidasi alur yang baru saja kita rancang ini?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                         <button
                            onClick={() => handleChoice('Lakukan simulasi pipeline', 'simulation_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Simulasi Pipeline (Uji Konsep)
                        </button>
                         <button
                            onClick={() => handleChoice('Langsung perkaya Error Analyzer', 'simulation_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-lg hover:bg-sat-lightgray transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Langsung Perkaya Error Analyzer
                        </button>
                    </div>
                     {isLoading && !aiResponse && (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sat-accent mx-auto"></div>
                            <p className="mt-3 text-sat-lightgray">Menganalisa pilihan strategis...</p>
                        </div>
                    )}
                    {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                    {aiResponse && selectedModule && (
                         <div className="p-6 bg-sat-blue rounded-lg border border-sat-accent/30 prose prose-invert max-w-none text-sat-white">
                            <h3 className="text-xl font-bold text-sat-accent mb-3">Analisa Strategis: Memilih "{selectedModule}"</h3>
                            {aiResponse.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );

    const renderSimulationView = () => (
        <div>
             <header className="mb-10">
                 <button onClick={() => setViewingDetail('integration-flow')} className="flex items-center text-sat-accent mb-6 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Alur Integrasi
                </button>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white text-center">{simulationDetail.title}</h1>
                 <p className="text-lg text-center text-sat-lightgray mt-2">{simulationDetail.subtitle}</p>
            </header>
            <main className="space-y-8">
                 <div className="bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50 mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-sat-white">{simulationDetail.uxRefinement.title}</h3>
                    <p className="text-sm text-sat-lightgray mb-4">{simulationDetail.uxRefinement.description}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-sat-lightgray mb-2">Sebelum</h4>
                            <CodeBlock code={simulationDetail.uxRefinement.before} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sat-accent mb-2">Sesudah (Rancangan Baru)</h4>
                            <CodeBlock code={simulationDetail.uxRefinement.after} />
                        </div>
                    </div>
                </div>

                <div className="bg-sat-lightblue p-6 rounded-xl shadow-2xl border border-sat-gray">
                    <h2 className="text-2xl font-bold text-center mb-4 text-sat-white">Langkah Implementasi</h2>
                    <p className="text-center text-sat-lightgray mb-6">Bagaimana cara terbaik untuk mengimplementasikan format output baru yang rapi ini?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                         <button
                            onClick={() => handleChoice('Buat helper kecil (logger.js)', 'implementation_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Buat Helper (logger.js)
                        </button>
                         <button
                            onClick={() => handleChoice('Langsung tulis ulang deploy-local.js', 'implementation_choice')}
                            disabled={isLoading}
                            className="px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-lg hover:bg-sat-lightgray transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            Langsung Tulis Ulang
                        </button>
                    </div>
                     {isLoading && !aiResponse && (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sat-accent mx-auto"></div>
                            <p className="mt-3 text-sat-lightgray">Menganalisa pilihan strategis...</p>
                        </div>
                    )}
                    {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                    {aiResponse && selectedModule && (
                         <div className="p-6 bg-sat-blue rounded-lg border border-sat-accent/30 prose prose-invert max-w-none text-sat-white">
                            <h3 className="text-xl font-bold text-sat-accent mb-3">Analisa Strategis: Memilih "{selectedModule}"</h3>
                            {aiResponse.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
    
    const renderUxImplementationView = () => (
        <div>
             <header className="mb-10">
                 <button onClick={() => setViewingDetail('simulation')} className="flex items-center text-sat-accent mb-6 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Simulasi & UX
                </button>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white text-center">{uxImplementationDetail.title}</h1>
                 <p className="text-lg text-center text-sat-lightgray mt-2">{uxImplementationDetail.subtitle}</p>
            </header>
            <main className="space-y-8">
                 <SectionCard emoji="🧱" title="Prinsip Arsitektur" description="Mengapa memisahkan logger adalah pilihan yang superior.">
                    <ul className="space-y-3 list-inside list-none">
                        {uxImplementationDetail.principles.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-sat-accent mr-3 mt-1">→</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50">
                        <h3 className="text-2xl font-bold mb-2 text-sat-white">{uxImplementationDetail.logger.title}</h3>
                        <p className="text-sm text-sat-lightgray mb-4">{uxImplementationDetail.logger.description}</p>
                        <CodeBlock code={uxImplementationDetail.logger.code} />
                    </div>
                    <div className="bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50">
                        {/* FIX: Corrected property access based on the corrected object structure in constants.ts */}
                        <h3 className="text-2xl font-bold mb-2 text-sat-white">{uxImplementationDetail.refactoredScript.title}</h3>
                        <p className="text-sm text-sat-lightgray mb-4">{uxImplementationDetail.refactoredScript.description}</p>
                        <CodeBlock code={uxImplementationDetail.refactoredScript.code} />
                    </div>
                </div>

                <div className="bg-sat-lightblue p-6 rounded-xl shadow-2xl border border-sat-gray">
                    <h2 className="text-2xl font-bold text-center mb-4 text-sat-white">Fondasi UX Selesai, Apa Selanjutnya?</h2>
                    <p className="text-center text-sat-lightgray mb-6">Dengan logger yang rapi, kita siap untuk memperluas kecerdasan sistem.</p>
                    <div className="flex justify-center gap-4 mb-6">
                         <button
                            onClick={() => alert("Final step: Now we can enrich the Error Analyzer!")}
                            className="px-6 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200">
                            Lanjut: Perkaya Error Analyzer
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );

    const renderCurrentView = () => {
        switch(viewingDetail) {
            case 'core-engine':
                return renderCoreEngineDetailView();
            case 'integration-flow':
                return renderIntegrationFlowView();
            case 'simulation':
                return renderSimulationView();
            case 'ux-implementation':
                return renderUxImplementationView();
            default:
                return renderBlueprintView();
        }
    }

    return (
        <div className="min-h-screen bg-sat-blue font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {renderCurrentView()}
                <footer className="text-center mt-12 text-sat-gray">
                    <p>SAT18 Independent Deployment System Blueprint</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
