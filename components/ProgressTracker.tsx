import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.415 0 2.055l-1.42 2.84a1 1 0 00.894 1.482h2.84c.775 0 1.415.64 1.415 1.415s-.64 1.415-1.415 1.415h-2.84a1 1 0 00-.894 1.482l1.42 2.84c.321.64.321 1.415 0 2.055a1 1 0 01-1.736 0l-1.42-2.84a1 1 0 00-.894-1.482H5.414a1 1 0 010-2.83h2.84a1 1 0 00.894-1.482l-1.42-2.84a1 1 0 011.736-2.055z" clipRule="evenodd" />
    </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
    <path d="M11 2a1 1 0 10-2 0v1a1 1 0 102 0V2zM6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM5 9a1 1 0 00-1 1v3a1 1 0 001 1h10a1 1 0 001-1v-3a1 1 0 00-1-1H5z" />
  </svg>
);


const roadmapStages = [
    { id: 1, title: 'Analisis Awal', description: 'Memahami log error, memberikan saran perbaikan dasar.', icon: CheckIcon, status: 'completed' },
    { id: 2, title: 'Memori & Sejarah', description: 'Mengingat skrip perbaikan yang pernah dibuat dan hasilnya.', icon: CheckIcon, status: 'completed' },
    { id: 3, title: 'Peringatan & Keamanan', description: 'Mengidentifikasi skrip berisiko dan meminta konfirmasi pengguna.', icon: CheckIcon, status: 'completed' },
    { id: 4, title: 'Kebijaksanaan & Statistik', description: 'Menampilkan tingkat kepercayaan berdasarkan data keberhasilan nyata.', icon: CheckIcon, status: 'completed' },
    { id: 5, title: 'Kecerdasan Kontekstual', description: 'Mengenali variasi error serupa (Fuzzy Matching).', icon: SparklesIcon, status: 'current' },
    { id: 6, title: 'Wawasan Visual', description: 'Menyajikan data riwayat dalam bentuk grafik dan tren (Visual Analytics).', icon: ChartBarIcon, status: 'upcoming' },
];

export const ProgressTracker: React.FC = () => {
    return (
        <div className="p-4">
            <ol className="relative border-l border-sat-gray">
                {roadmapStages.map((stage, index) => {
                    const isCompleted = stage.status === 'completed';
                    const isCurrent = stage.status === 'current';
                    
                    const ringColor = isCurrent ? 'ring-sat-accent' : 'ring-sat-gray';
                    const bgColor = isCompleted ? 'bg-sat-accent' : (isCurrent ? 'bg-sat-accent' : 'bg-sat-gray');
                    const textColor = isCompleted || isCurrent ? 'text-sat-white' : 'text-sat-lightgray';
                    const descriptionColor = isCompleted || isCurrent ? 'text-sat-lightgray' : 'text-sat-gray';

                    return (
                        <li key={stage.id} className="mb-8 ml-6">
                            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ${ringColor} ${bgColor}`}>
                                <stage.icon className="w-3.5 h-3.5 text-sat-blue" />
                            </span>
                            <h3 className={`font-semibold ${textColor}`}>
                                {stage.title}
                                {isCurrent && <span className="ml-2 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-400">Current Focus</span>}
                            </h3>
                            <p className={`text-sm ${descriptionColor}`}>{stage.description}</p>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};
