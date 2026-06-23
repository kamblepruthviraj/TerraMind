import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 to-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-600/20">
                        T
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terra<span className="text-primary-600">Mind</span></h1>
                </div>
            </div>

            <div className="text-center mb-16 max-w-2xl">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    Supporting Our <span className="text-primary-600">Farmers</span>, <br /> Strengthening Our Future.
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    A dedicated platform connecting farmers with professional counsellors for mental health support and guidance.
                </p>
            </div>

            <div className="grid text-center lg:max-w-4xl lg:w-full lg:mb-0 lg:grid-cols-2 gap-6">
                {!session ? (
                    <>
                        <Link
                            href="/auth/signin"
                            className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-primary-200 hover:shadow-xl hover:shadow-primary-600/10 hover:-translate-y-1"
                        >
                            <h2 className={`mb-3 text-2xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors`}>
                                Login{' '}
                                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                    -&gt;
                                </span>
                            </h2>
                            <p className={`m-0 max-w-[30ch] text-sm text-gray-500 mx-auto`}>
                                Access your dashboard to submit reports or manage cases.
                            </p>
                        </Link>

                        <Link
                            href="/auth/signup"
                            className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-primary-200 hover:shadow-xl hover:shadow-primary-600/10 hover:-translate-y-1"
                        >
                            <h2 className={`mb-3 text-2xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors`}>
                                Sign Up{' '}
                                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                    -&gt;
                                </span>
                            </h2>
                            <p className={`m-0 max-w-[30ch] text-sm text-gray-500 mx-auto`}>
                                Create a new account as a Farmer or Counsellor.
                            </p>
                        </Link>
                    </>
                ) : (
                    <div className="col-span-2 text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {session.user.name}!</p>
                        <p className="text-gray-500 mb-8 capitalize">Role: {session.user.role}</p>
                        <Link
                            href={`/${session.user.role}-dashboard`}
                            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-1"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
