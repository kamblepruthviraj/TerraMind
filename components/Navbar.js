import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
    const { data: session } = useSession();
    const { language, changeLanguage, t } = useLanguage();

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
                            Farmer<span className="text-primary-600">Care</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Switcher */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <Globe size={16} className="text-gray-500" />
                            <select
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer py-0 pl-0 pr-6"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                <option value="tulu">ತುಳು (Tulu)</option>
                            </select>
                        </div>

                        {session ? (
                            <>
                                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                    title={t('nav.logout')}
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/auth/signin" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                                    {t('nav.login')}
                                </Link>
                                <Link href="/auth/signup" className="bg-primary-600 text-white px-4 py-2 rounded-full font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                    {t('nav.getStarted')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
