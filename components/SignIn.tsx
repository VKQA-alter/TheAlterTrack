import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

import RotatingText from './RotatingText';
import DarkVeil from './DarkVeil';

interface SignInProps {
    onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        // Simulate authentication delay
        setTimeout(() => {
            onSignIn();
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
            {/* Background DarkVeil */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <DarkVeil
                    hueShift={0}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.5}
                    scanlineFrequency={0}
                    warpAmount={0}
                />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="p-6 md:px-12">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            AlterTrack
                        </h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                    <div className="max-w-md w-full py-12 px-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl">
                        {/* Welcome Message */}
                        <div className="space-y-4 mb-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                Welcome to AlterTrack
                            </h2>
                            <div className="text-base md:text-lg text-slate-400 font-medium max-w-sm mx-auto flex flex-wrap justify-center items-center gap-x-1.5 leading-relaxed">
                                <span>Your centralized platform for</span>
                                <RotatingText
                                    texts={['managing', 'tracking', 'organizing', 'monitoring', 'optimizing']}
                                    mainClassName="text-indigo-400 font-bold px-2 bg-indigo-900/20 rounded-lg py-0.5 pointer-events-auto cursor-pointer"
                                    staggerFrom={"last"}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "-120%", opacity: 0 }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden"
                                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    rotationInterval={1500}
                                    rotateOnlyOnHover={true}
                                />
                                <span>workspace efficiently</span>
                            </div>
                        </div>

                        {/* Authentication Action */}
                        <div className="space-y-6">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className={`
                                    w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-500/10
                                    ${isLoading
                                        ? 'bg-slate-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                )}
                                {isLoading ? 'Signing in...' : 'Sign in with Google'}
                            </button>

                            {/* Legal Consent Text */}
                            <p className="text-[11px] leading-relaxed text-slate-500 px-4">
                                By signing in, you understand and agree to our{' '}
                                <a href="#" className="font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer space filler */}
                <footer className="p-12 hidden md:block" />
            </div>
        </div>
    );
};

export default SignIn;
