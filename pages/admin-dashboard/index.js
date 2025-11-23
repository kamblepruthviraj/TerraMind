import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Users, CheckCircle, ClipboardList, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export default function AdminDashboard() {
    const [counsellors, setCounsellors] = useState([]);
    const [resources, setResources] = useState([]);
    const [activeTab, setActiveTab] = useState('counsellors'); // 'counsellors' or 'resources'

    // Resource Form State
    const [newResource, setNewResource] = useState({
        title_en: '', title_hi: '', title_kn: '', title_tulu: '',
        desc_en: '', desc_hi: '', desc_kn: '', desc_tulu: '',
        link: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCounsellors();
        fetchResources();
    }, []);

    const fetchCounsellors = async () => {
        const res = await fetch('/api/users');
        if (res.ok) setCounsellors(await res.json());
    };

    const fetchResources = async () => {
        const res = await fetch('/api/resources');
        if (res.ok) setResources(await res.json());
    };

    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResource),
            });
            if (res.ok) {
                setNewResource({
                    title_en: '', title_hi: '', title_kn: '', title_tulu: '',
                    desc_en: '', desc_hi: '', desc_kn: '', desc_tulu: '',
                    link: ''
                });
                fetchResources();
                alert('Resource added successfully');
            } else {
                alert('Failed to add resource');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteResource = async (id) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            const res = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchResources();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('counsellors')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'counsellors' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Counsellor Oversight
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'resources' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Resource Management
                    </button>
                </div>

                {activeTab === 'counsellors' ? (
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Counsellor Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Active Assignments</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {counsellors.map((counsellor) => (
                                    <tr key={counsellor._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                                                    {counsellor.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{counsellor.name}</div>
                                                    <div className="text-sm text-gray-500">{counsellor.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {counsellor.phone || <span className="text-gray-400 italic">Not provided</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                                <CheckCircle size={12} className="mr-1" />
                                                {counsellor.resolvedCount} Resolved
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {counsellor.assignedReports.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {counsellor.assignedReports.slice(0, 3).map((title, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 max-w-xs">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                            <span className="truncate">{title}</span>
                                                        </div>
                                                    ))}
                                                    {counsellor.assignedReports.length > 3 && (
                                                        <span className="text-xs text-gray-400 pl-3.5">+{counsellor.assignedReports.length - 3} more</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No active cases</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {counsellors.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users size={48} className="text-gray-200 mb-4" />
                                                <p className="text-lg font-medium">No counsellors found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Add Resource Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="text-primary-600" /> Add New Resource
                            </h2>
                            <form onSubmit={handleResourceSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['en', 'hi', 'kn', 'tulu'].map((lang) => (
                                        <div key={lang} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <h3 className="font-bold text-gray-700 uppercase text-sm">{lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : lang === 'kn' ? 'Kannada' : 'Tulu'}</h3>
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={newResource[`title_${lang}`]}
                                                onChange={(e) => setNewResource({ ...newResource, [`title_${lang}`]: e.target.value })}
                                                className="w-full rounded-lg border-gray-200 text-sm"
                                                required
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={newResource[`desc_${lang}`]}
                                                onChange={(e) => setNewResource({ ...newResource, [`desc_${lang}`]: e.target.value })}
                                                className="w-full rounded-lg border-gray-200 text-sm"
                                                rows={2}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link</label>
                                    <input
                                        type="url"
                                        value={newResource.link}
                                        onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                        className="w-full rounded-lg border-gray-200"
                                        placeholder="https://example.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Adding...' : 'Add Resource'}
                                </button>
                            </form>
                        </div>

                        {/* Resource List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Existing Resources</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {resources.map((resource) => (
                                    <div key={resource._id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {resource.title_en}
                                                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600">
                                                    <LinkIcon size={14} />
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{resource.desc_en}</p>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">HI: {resource.title_hi}</span>
                                                <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">KN: {resource.title_kn}</span>
                                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">TU: {resource.title_tulu}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteResource(resource._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {resources.length === 0 && (
                                    <div className="p-12 text-center text-gray-500">
                                        No resources added yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
