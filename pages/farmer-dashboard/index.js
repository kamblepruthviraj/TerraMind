import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VoiceRecorder from '@/components/VoiceRecorder';
import ChatInterface from '@/components/ChatInterface';
import CommunityChat from '@/components/CommunityChat';
import { FileText, Mic, BookOpen, MessageSquare, X, PlusCircle, History, Users, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FarmerDashboard() {
    const { t, language } = useLanguage();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audioURL, setAudioURL] = useState('');
    const [reports, setReports] = useState([]);
    const [resources, setResources] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showCommunityChat, setShowCommunityChat] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchResources();
    }, []);

    const fetchReports = async () => {
        const res = await fetch('/api/reports');
        if (res.ok) {
            setReports(await res.json());
        }
    };

    const fetchResources = async () => {
        const res = await fetch('/api/resources');
        if (res.ok) {
            setResources(await res.json());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, audioURL }),
            });

            if (res.ok) {
                setTitle('');
                setContent('');
                setAudioURL('');
                fetchReports();
                alert('Report submitted successfully');
            } else {
                const data = await res.json();
                alert(`Failed to submit report: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReport = async (id) => {
        if (!confirm(t('dashboard.deleteConfirm'))) return;
        try {
            const res = await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchReports();
            } else {
                alert('Failed to delete report');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Submission Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-primary-50/50">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                    <PlusCircle className="text-primary-600" />
                                    {t('dashboard.submitNewReport')}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{t('dashboard.describeIssue')}</p>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('dashboard.titleLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border transition-all"
                                            placeholder="Brief summary of the issue"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('dashboard.descriptionLabel')}
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border transition-all"
                                            placeholder="Detailed explanation..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Mic size={16} className="text-primary-600" /> {t('dashboard.voiceNoteLabel')}
                                        </label>
                                        <VoiceRecorder onUploadComplete={setAudioURL} />
                                        {audioURL && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                                Audio attached successfully!
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                {t('dashboard.submitting')}
                                            </>
                                        ) : (
                                            t('dashboard.submitButton')
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Resources & History */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Chat / Resources Toggle Area */}
                        {selectedReport ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-primary-50/30">
                                    <div>
                                        <h2 className="font-bold text-gray-900">Chat Support</h2>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{selectedReport.title}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <ChatInterface reportId={selectedReport._id} />
                                </div>
                            </div>
                        ) : showCommunityChat ? (
                            <CommunityChat onClose={() => setShowCommunityChat(false)} />
                        ) : (
                            <>
                                {/* Resources Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                            <BookOpen className="text-blue-500" /> {t('dashboard.helpfulResources')}
                                        </h2>
                                        <button
                                            onClick={() => setShowCommunityChat(true)}
                                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Users size={16} /> {t('dashboard.communityChat')}
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <ul className="space-y-3">
                                            {/* Static Resources */}
                                            <li className="group p-4 bg-blue-50/50 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors cursor-pointer">
                                                <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                                                    <span className="text-blue-700 font-bold group-hover:underline">{t('dashboard.resources.schemeTitle')}</span>
                                                    <p className="text-sm text-gray-600 mt-1">{t('dashboard.resources.schemeDesc')}</p>
                                                </a>
                                            </li>
                                            <li className="group p-4 bg-purple-50/50 hover:bg-purple-50 rounded-xl border border-purple-100 transition-colors cursor-pointer">
                                                <a href="https://telemanas.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                                                    <span className="text-purple-700 font-bold group-hover:underline">{t('dashboard.resources.helplineTitle')}</span>
                                                    <p className="text-sm text-gray-600 mt-1">{t('dashboard.resources.helplineDesc')}</p>
                                                </a>
                                            </li>

                                            {/* Dynamic Resources */}
                                            {resources.map((resource) => {
                                                // Get current language or fallback to English
                                                const currentLang = language || 'en';
                                                const title = resource[`title_${currentLang}`] || resource.title_en;
                                                const desc = resource[`desc_${currentLang}`] || resource.desc_en;

                                                return (
                                                    <li key={resource._id} className="group p-4 bg-green-50/50 hover:bg-green-50 rounded-xl border border-green-100 transition-colors cursor-pointer">
                                                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="block">
                                                            <span className="text-green-700 font-bold group-hover:underline">{title}</span>
                                                            <p className="text-sm text-gray-600 mt-1">{desc}</p>
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>

                                {/* History Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[400px]">
                                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                            <History className="text-gray-500" /> My Reports
                                        </h2>
                                    </div>
                                    <div className="p-5 overflow-y-auto custom-scrollbar">
                                        <div className="space-y-4">
                                            {reports.map((report) => (
                                                <div key={report._id} className="group p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-white">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-gray-900 line-clamp-1">{report.title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                                report.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {report.status}
                                                            </span>
                                                            {report.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleDeleteReport(report._id)}
                                                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                                    title={t('dashboard.delete')}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{report.content}</p>

                                                    {report.status !== 'pending' && (
                                                        <button
                                                            onClick={() => setSelectedReport(report)}
                                                            className="w-full py-2 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <MessageSquare size={16} /> Open Chat
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {reports.length === 0 && (
                                                <div className="text-center py-8 text-gray-400">
                                                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                                    <p>No reports submitted yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
