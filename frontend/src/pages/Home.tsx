import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import HomePublic from './HomePublic';
import { AiAnalysis, FightCard } from '../components';
import { payStripe } from '../paymentUtil';

const glass = {
    background: 'rgba(26,26,26,0.80)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255,179,0,0.15)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,179,0,0.08)',
} as const;

function GottaPay() {
    return (
        <div
            className="relative w-[80%] mx-auto mt-6 rounded-2xl overflow-hidden"
            style={glass}
        >
            {/* Blurred AI analysis placeholder */}
            <div
                style={{
                    filter: 'blur(6px)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
                className="p-6 flex flex-col gap-4"
            >
                {/* fake consensus bar */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div
                            className="h-3 w-24 rounded"
                            style={{ background: 'rgba(255,179,0,0.35)' }}
                        />
                        <div
                            className="h-3 w-24 rounded"
                            style={{ background: 'rgba(66,165,245,0.35)' }}
                        />
                    </div>
                    <div
                        className="flex h-4 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        <div
                            className="h-full"
                            style={{
                                width: '65%',
                                background: 'linear-gradient(to right, #FF8F00, #FFB300)',
                            }}
                        />
                        <div
                            className="h-full"
                            style={{
                                width: '35%',
                                background: 'linear-gradient(to right, #1E88E5, #42A5F5)',
                            }}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap mt-1">
                        {[
                            'Qwen 3 · 32B',
                            'Llama 3.1 · 8B',
                            'Llama 3.3 · 70B',
                            'Llama 4 Scout',
                        ].map((m) => (
                            <div
                                key={m}
                                className="px-3 py-1.5 rounded-lg"
                                style={{
                                    background: 'rgba(255,179,0,0.06)',
                                    border: '1px solid rgba(255,179,0,0.15)',
                                }}
                            >
                                <div
                                    className="h-2 rounded"
                                    style={{ width: 80, background: 'rgba(255,179,0,0.3)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* fake fighter cards */}
                <div className="flex gap-3">
                    {['rgba(255,179,0,0.08)', 'rgba(66,165,245,0.08)'].map((bg, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-xl p-4 flex flex-col gap-2"
                            style={{
                                background: bg,
                                border: `1px solid ${i === 0 ? 'rgba(255,179,0,0.15)' : 'rgba(66,165,245,0.15)'}`,
                            }}
                        >
                            <div
                                className="h-3 w-28 rounded"
                                style={{ background: 'rgba(255,255,255,0.15)' }}
                            />
                            <div
                                className="h-2 w-full rounded mt-1"
                                style={{ background: 'rgba(255,255,255,0.07)' }}
                            />
                            <div
                                className="h-2 w-4/5 rounded"
                                style={{ background: 'rgba(255,255,255,0.07)' }}
                            />
                            <div
                                className="h-2 w-full rounded mt-2"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            />
                            <div
                                className="h-2 w-3/5 rounded"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* fake verdict */}
                <div
                    className="rounded-xl p-4"
                    style={{
                        border: '2px solid rgba(255,179,0,0.4)',
                        background: 'rgba(255,179,0,0.05)',
                    }}
                >
                    <div
                        className="h-2 w-16 rounded mb-3"
                        style={{ background: 'rgba(255,179,0,0.4)' }}
                    />
                    <div
                        className="h-4 w-40 rounded mb-2"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                    <div
                        className="h-2 w-full rounded"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                    <div
                        className="h-2 w-3/4 rounded mt-1"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                </div>
            </div>

            {/* Paywall overlay */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(10,10,10,0.5)' }}
            >
                <div className="flex flex-col items-center gap-3 text-center px-6">
                    <p
                        className="text-xl font-black tracking-tight"
                        style={{
                            color: 'transparent',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            backgroundImage:
                                'linear-gradient(135deg, #FFD54F 0%, #FF8F00 100%)',
                        }}
                    >
                        AI Analysis — Premium
                    </p>
                    <p
                        className="text-sm max-w-xs"
                        style={{ color: 'rgba(245,245,245,0.5)' }}
                    >
                        Multi-model fight predictions One month access for $5
                    </p>
                    <button
                        onClick={payStripe}
                        className="mt-1 px-7 py-2.5 rounded-xl font-black text-sm tracking-widest uppercase hover:opacity-90 active:opacity-75"
                        style={{
                            background: 'linear-gradient(135deg, #FF8F00, #FFB300)',
                            color: '#0A0A0A',
                            boxShadow: '0 4px 20px rgba(255,179,0,0.35)',
                        }}
                    >
                        Go Premium
                    </button>
                </div>
            </div>
        </div>
    );
}

function Home() {
    const { isAuthenticated, login, isPremium } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            login(access, refresh);
            window.history.replaceState({}, '', '/home');
        }
    }, []);

    //idk why is this here
    if (isAuthenticated === null) return null;
    if (!isAuthenticated) return <HomePublic />;

    return (
        <div>
            <FightCard />
            <div> {isPremium ? <AiAnalysis /> : GottaPay()}</div>;
        </div>
    );
}

export default Home;
