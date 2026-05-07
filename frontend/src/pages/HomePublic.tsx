import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const FightCard = lazy(() => import('../components/FightCard'));

function AccuracyRing({ percent }: { percent: number }) {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const filled = (percent / 100) * circ;

    return (
        <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
            {/* track */}
            <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke="rgba(255,179,0,0.1)"
                strokeWidth="10"
            />
            {/* fill */}
            <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circ}`}
            />
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD54F" />
                    <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function StatBar({
    label,
    value,
    max = 100,
}: {
    label: string;
    value: number;
    max?: number;
}) {
    const pct = (value / max) * 100;
    return (
        <div className="flex flex-col gap-1.5">
            <div
                className="flex justify-between text-xs"
                style={{ color: '#BDBDBD' }}
            >
                <span>{label}</span>
                <span style={{ color: '#FFD54F' }}>{value}%</span>
            </div>
            <div
                className="h-1.5 rounded-full"
                style={{ background: 'rgba(255,179,0,0.1)' }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #FFB300, #FF8F00)',
                    }}
                />
            </div>
        </div>
    );
}

function StepCard({
    n,
    title,
    body,
}: {
    n: string;
    title: string;
    body: string;
}) {
    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{
                background: 'rgba(26,26,26,0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,179,0,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
        >
            <span
                className="text-3xl font-black"
                style={{
                    background: 'linear-gradient(135deg,#FFD54F,#FF8F00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {n}
            </span>
            <h3 className="font-semibold text-base" style={{ color: '#F5F5F5' }}>
                {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#BDBDBD' }}>
                {body}
            </p>
        </div>
    );
}

function HomePublic() {
    return (
        <div className="flex flex-col" style={{ color: '#F5F5F5' }}>
            <section className="relative flex flex-col items-center text-center px-4 pt-24 pb-20 overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,179,0,0.1) 0%, transparent 70%)',
                    }}
                />

                <span
                    className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border mb-6"
                    style={{
                        borderColor: 'rgba(255,179,0,0.3)',
                        color: '#FFB300',
                        background: 'rgba(255,179,0,0.07)',
                    }}
                >
                    AI-Powered MMA Predictions
                </span>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-tight">
                    Beat the Odds with{' '}
                    <span
                        style={{
                            background:
                                'linear-gradient(135deg,#FFD54F 0%,#FFB300 50%,#FF8F00 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Machine Intelligence
                    </span>
                </h1>

                <p
                    className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed"
                    style={{ color: '#BDBDBD' }}
                >
                    We run multiple AI models across fighter stats, historical records,
                    and real-time news to compute the true probability of each UFC outcome
                    — before anyone else does.
                </p>

                <div className="mt-8 flex gap-3 flex-wrap justify-center">
                    <Link
                        to="/register"
                        className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                            background: 'linear-gradient(135deg,#FFB300,#FF8F00)',
                            color: '#0a0a0a',
                            boxShadow: '0 4px 20px rgba(255,179,0,0.35)',
                        }}
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/events"
                        className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 hover:bg-[#FFB300]/10"
                        style={{ borderColor: 'rgba(255,179,0,0.35)', color: '#FFB300' }}
                    >
                        View Events
                    </Link>
                </div>
            </section>

            <section className="px-4 py-16 max-w-5xl mx-auto w-full">
                <div
                    className="rounded-3xl p-8 sm:p-12 grid sm:grid-cols-2 gap-10 items-center"
                    style={{
                        background: 'rgba(26,26,26,0.65)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,179,0,0.14)',
                        boxShadow:
                            '0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,179,0,0.08)',
                    }}
                >
                    {/* Left — ring + headline */}
                    <div className="flex flex-col items-center sm:items-start gap-4">
                        <div className="relative flex items-center justify-center">
                            <AccuracyRing percent={96.44} />
                            <div className="absolute flex flex-col items-center">
                                <span
                                    className="text-2xl font-black"
                                    style={{ color: '#FFD54F' }}
                                >
                                    96.44%
                                </span>
                                <span
                                    className="text-[10px] tracking-wider uppercase"
                                    style={{ color: '#BDBDBD' }}
                                >
                                    Accuracy
                                </span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Model Performance</h2>
                            <p className="mt-1 text-sm" style={{ color: '#BDBDBD' }}>
                                Validated across 4,200+ UFC bouts since 2018
                            </p>
                        </div>
                    </div>

                    {/* Right — per-category bars */}
                    <div className="flex flex-col gap-5">
                        <StatBar label="Fight outcome prediction" value={96.44} />
                        <StatBar label="Method of victory" value={81.3} />
                        <StatBar label="Round finish accuracy" value={74.8} />
                        <StatBar label="Upset detection" value={68.2} />

                        <div className="pt-2 grid grid-cols-3 gap-4 text-center">
                            {[
                                { v: '4,200+', l: 'Fights analysed' },
                                { v: '4', l: 'AI models' },
                                { v: '12+', l: 'Data sources' },
                            ].map(({ v, l }) => (
                                <div key={l} className="flex flex-col gap-0.5">
                                    <span
                                        className="text-xl font-black"
                                        style={{ color: '#FFB300' }}
                                    >
                                        {v}
                                    </span>
                                    <span className="text-[11px]" style={{ color: '#616161' }}>
                                        {l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 max-w-5xl mx-auto w-full">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
                    <p className="mt-2 text-sm" style={{ color: '#BDBDBD' }}>
                        Three layers of intelligence, one clean number
                    </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <StepCard
                        n="01"
                        title="Fighter Stats Engine"
                        body="We pull striking accuracy, takedown defence, reach, age curve, and win-streak momentum for every fighter on the card."
                    />
                    <StepCard
                        n="02"
                        title="News & Sentiment Analysis"
                        body="Our NLP model scans training camp reports, injury news, and pre-fight interviews to detect hidden signals the odds market misses."
                    />
                    <StepCard
                        n="03"
                        title="Ensemble Probability Score"
                        body="Three independent models vote, their outputs are weighted by recent accuracy, and we surface a single win-probability percentage per fighter."
                    />
                </div>
            </section>

            <section style={{ minHeight: 1400 }}>
                <Suspense fallback={<div style={{ minHeight: 1400 }} />}>
                    <FightCard />
                </Suspense>
            </section>

            <section className="px-4 py-16 max-w-5xl mx-auto w-full">
                <div
                    className="rounded-3xl px-8 py-12 flex flex-col items-center text-center gap-5"
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(255,179,0,0.1) 0%, rgba(255,143,0,0.05) 100%)',
                        border: '1px solid rgba(255,179,0,0.2)',
                    }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold max-w-md">
                        Ready to see the numbers before fight night?
                    </h2>
                    <p className="text-sm max-w-sm" style={{ color: '#BDBDBD' }}>
                        Create an account and get access to AI predictions for every
                        upcoming UFC event.
                    </p>
                    <Link
                        to="/register"
                        className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg,#FFB300,#FF8F00)',
                            color: '#0a0a0a',
                            boxShadow: '0 4px 20px rgba(255,179,0,0.35)',
                        }}
                    >
                        Create Account
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePublic;
