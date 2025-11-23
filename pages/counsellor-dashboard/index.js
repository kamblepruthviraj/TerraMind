import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { MessageSquare, CheckCircle, Play, Clock, User, FileText } from 'lucide-react';

export default function CounsellorDashboard() {
    const [pendingReports, setPendingReports] = useState([]);
    const [assignedReports, setAssignedReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const res = await fetch('/api/reports');
        if (res.ok) {
            const data = await res.json();
            setPendingReports(data.filter(r => r.status === 'pending'));
            setAssignedReports(data.filter(r => r.status !== 'pending'));
        }
    };

    const takeUpReport = async (id) => {
        try {
            const res = await fetch(`/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'assigned' }),
            });

            if (res.ok) {
                fetchReports();
                alert('Report assigned to you.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const markResolved = async (id) => {
        if (!confirm('Are you sure you want to mark this as resolved?')) return;
        try {
            const res = await fetch(`/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'resolved' }),
            });

            if (res.ok) {
                fetchReports();
                if (selectedReport?._id === id) setSelectedReport(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Lists */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Pending Queue */}
                        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-orange-50/50">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-orange-700">
                                    <Clock size={20} /> Pending Reports
                                    <span className="ml-auto bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingReports.length}</span>
                                </h2>
                            </div>
                            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {pendingReports.map(report => (
                                    <div key={report._id} className="p-4 rounded-xl border border-orange-100 bg-white hover:shadow-md transition-all">
                                        <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{report.content}</p>
                                        {report.audioURL && (
                                            <div className="mb-3">
                                                <audio src={report.audioURL} controls className="w-full h-8" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => takeUpReport(report._id)}
                                            className="w-full py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                                        >
                                            Take Up Case
                                        </button>
                                    </div>
                                ))}
                                {pendingReports.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned List */}
                        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-blue-50/50">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-blue-700">
                                    <User size={20} /> My Active Cases
                                    <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{assignedReports.length}</span>
                                </h2>
                            </div>
                            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {assignedReports.map(report => (
                                    <div
                                        key={report._id}
                                        onClick={() => setSelectedReport(report)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedReport?._id === report._id
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900">{report.title}</h3>
                                            {report.status === 'resolved' && <CheckCircle size={16} className="text-green-500" />}
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{report.content}</p>
                                    </div>
                                ))}
                                {assignedReports.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <FileText size={32} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No active cases.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chat & Details */}
                    <div className="lg:col-span-8">
                        {selectedReport ? (
                            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                                        <p className="text-gray-600 mt-2 text-sm leading-relaxed max-w-2xl">{selectedReport.content}</p>
                                        {selectedReport.audioURL && (
                                            <div className="mt-4 flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 w-fit">
                                                <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
                                                    <Play size={16} fill="currentColor" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Voice Note</p>
                                                    <audio src={selectedReport.audioURL} controls className="h-6 w-48" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {selectedReport.status !== 'resolved' && (
                                        <button
                                            onClick={() => markResolved(selectedReport._id)}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20"
                                        >
                                            <CheckCircle size={16} /> Mark Resolved
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col bg-gray-50/30">
                                    <div className="p-4 border-b border-gray-100 bg-white">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <MessageSquare size={18} className="text-blue-600" /> Secure Chat Session
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-hidden p-4">
                                        <ChatInterface reportId={selectedReport._id} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquare size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Case Selected</h3>
                                <p className="max-w-sm mx-auto">Select an active case from the list or take up a new pending report to view details and start chatting.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
