import { useEffect, useRef, useState } from 'react';
import api from '../api';
import type { AiAnalysisResponse } from '../interfaces';

const glass = {
    background: 'rgba(26,26,26,0.80)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255,179,0,0.15)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,179,0,0.08)',
} as const;

const QWEN_COLOR = '#CE93D8';
const LLAMA_COLOR = '#4DD0E1';
const F1_COLOR = '#FFB300';
const F2_COLOR = '#42A5F5';
const GOLD = '#FFB300';

const ALL_MODELS = [
    { key: 'qwen/qwen3-32b' as const, label: 'Qwen 3 · 32B', color: QWEN_COLOR },
    {
        key: 'llama-3.1-8b-instant' as const,
        label: 'Llama 3.1 · 8B',
        color: LLAMA_COLOR,
    },
    {
        key: 'llama-3.3-70b-versatile' as const,
        label: 'Llama 3.3 · 70B',
        color: LLAMA_COLOR,
    },
    {
        key: 'meta-llama/llama-4-scout-17b-16e-instruct' as const,
        label: 'Llama 4 Scout · 17B',
        color: LLAMA_COLOR,
    },
];

const LLAMA_MODELS = ALL_MODELS.slice(1);

// Matrix rain canvas

const MATRIX_CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    '0123456789ABCDEFabcdef' +
    '∑∏√∞≠≡∆∇⊕⊗ΨΦΩΛΞΠΣΘαβγδεζ' +
    '0101011010011100110101';

const COL_W = 25;
const FONT_S = 13;

const POOL_SIZE = 512;
const CHAR_POOL = Array.from(
    { length: POOL_SIZE },
    () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
);

const FRAME_SKIP = 3;

function MatrixBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let drops: { y: number; speed: number }[] = [];
        let animId: number;
        let frame = 0;
        let poolIdx = 0;
        const next = () => CHAR_POOL[poolIdx++ % POOL_SIZE];

        const resize = () => {
            const p = canvas.parentElement!;
            canvas.width = p.offsetWidth;
            canvas.height = p.offsetHeight;
            // canvas resize clears context state — re-set font here
            ctx.font = `${FONT_S}px "Courier New", monospace`;
            const cols = Math.floor(canvas.width / COL_W);
            drops = Array.from({ length: cols }, () => ({
                y: Math.random() * -(canvas.height / COL_W),
                speed: 0.28 + Math.random() * 0.5,
            }));
        };
        resize();

        const tick = () => {
            animId = requestAnimationFrame(tick);
            if (frame++ % FRAME_SKIP !== 0) return;

            ctx.fillStyle = 'rgba(10, 10, 10, 0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drops.forEach((drop, i) => {
                const x = i * COL_W;
                const yPx = Math.floor(drop.y) * COL_W;

                ctx.fillStyle = 'rgba(0, 245, 70, 0.95)';
                ctx.fillText(next(), x, yPx);

                if (drop.y > 1) {
                    ctx.fillStyle = 'rgba(0, 180, 55, 0.38)';
                    ctx.fillText(next(), x, yPx - COL_W);
                }

                drop.y += drop.speed;

                if (yPx > canvas.height && Math.random() > 0.97) {
                    drop.y = 0;
                    drop.speed = 0.2 + Math.random() * 0.5;
                }
            });
        };
        animId = requestAnimationFrame(tick);

        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement!);

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.22, zIndex: 0 }}
        />
    );
}

// Consensus panel

function ConsensusPanel({ data }: { data: AiAnalysisResponse }) {
    const f1Name = data.chatter['qwen/qwen3-32b'].analysis.fighter_1.name;
    const f2Name = data.chatter['qwen/qwen3-32b'].analysis.fighter_2.name;

    const picks = ALL_MODELS.map((m) => ({
        label: m.label,
        color: m.color,
        winner: data.chatter[m.key].analysis.winner.name,
        factor: data.chatter[m.key].analysis.winner.factor,
    }));

    const f1Votes = picks.filter((p) => p.winner === f1Name).length;
    const f2Votes = picks.filter((p) => p.winner === f2Name).length;
    const total = ALL_MODELS.length;
    const f1Pct = (f1Votes / total) * 100;
    const f2Pct = (f2Votes / total) * 100;

    return (
        <div className="rounded-2xl p-6 relative overflow-hidden" style={glass}>
            <MatrixBackground />

            <div className="relative" style={{ zIndex: 1 }}>
                {/* header */}
                <div className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-black tracking-[0.25em] uppercase"
                        style={{ color: GOLD }}
                    >
                        AI Oracle
                    </span>
                    <div
                        className="flex-1 h-px"
                        style={{ background: 'rgba(255,179,0,0.2)' }}
                    />
                    <span className="text-xs font-semibold" style={{ color: '#616161' }}>
                        {total} models voted
                    </span>
                </div>

                {/* fighter labels + score */}
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <p
                            className="text-lg font-black leading-tight"
                            style={{ color: F1_COLOR }}
                        >
                            {f1Name}
                        </p>
                        <p
                            className="text-sm font-semibold mt-0.5"
                            style={{ color: 'rgba(245,245,245,0.4)' }}
                        >
                            {f1Votes} / {total} votes
                        </p>
                    </div>
                    <div
                        className="text-3xl font-black"
                        style={{
                            color: 'transparent',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            backgroundImage: `linear-gradient(135deg, ${F1_COLOR}, ${F2_COLOR})`,
                        }}
                    >
                        {f1Votes} – {f2Votes}
                    </div>
                    <div className="text-right">
                        <p
                            className="text-lg font-black leading-tight"
                            style={{ color: F2_COLOR }}
                        >
                            {f2Name}
                        </p>
                        <p
                            className="text-sm font-semibold mt-0.5"
                            style={{ color: 'rgba(245,245,245,0.4)' }}
                        >
                            {f2Votes} / {total} votes
                        </p>
                    </div>
                </div>

                {/* split bar */}
                <div
                    className="flex h-5 rounded-full overflow-hidden mb-2"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
                    }}
                >
                    {f1Pct > 0 && (
                        <div
                            className="h-full"
                            style={{
                                width: `${f1Pct}%`,
                                background: 'linear-gradient(to right, #FF8F00, #FFB300)',
                                boxShadow: '2px 0 8px rgba(255,179,0,0.4)',
                            }}
                        />
                    )}
                    {f2Pct > 0 && (
                        <div
                            className="h-full"
                            style={{
                                width: `${f2Pct}%`,
                                background: 'linear-gradient(to right, #1E88E5, #42A5F5)',
                                boxShadow: '-2px 0 8px rgba(66,165,245,0.4)',
                            }}
                        />
                    )}
                </div>

                {/* pct labels */}
                <div className="flex justify-between mb-5">
                    <span
                        className="text-xs font-bold"
                        style={{ color: f1Pct > 0 ? F1_COLOR : '#424242' }}
                    >
                        {Math.round(f1Pct)}%
                    </span>
                    <span
                        className="text-xs font-bold"
                        style={{ color: f2Pct > 0 ? F2_COLOR : '#424242' }}
                    >
                        {Math.round(f2Pct)}%
                    </span>
                </div>

                {/* individual model picks */}
                <div className="flex flex-wrap gap-2">
                    {picks.map((p) => {
                        const isF1 = p.winner === f1Name;
                        const winColor = isF1 ? F1_COLOR : F2_COLOR;
                        return (
                            <div
                                key={p.label}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{
                                    background: `${winColor}0C`,
                                    border: `1px solid ${winColor}28`,
                                }}
                            >
                                <span
                                    className="text-xs font-semibold"
                                    style={{ color: p.color }}
                                >
                                    {p.label}
                                </span>
                                <span style={{ color: '#424242', fontSize: 10 }}>▶</span>
                                <span
                                    className="text-xs font-black"
                                    style={{ color: winColor }}
                                >
                                    {p.winner}
                                </span>
                                <span
                                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-0.5"
                                    style={{ background: `${winColor}18`, color: winColor }}
                                >
                                    {p.factor}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Performance ring

function PerformanceRing({ value, color }: { value: number; color: string }) {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const fill = (value / 100) * circ;
    return (
        <div className="flex flex-col items-center gap-0.5">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                    <circle
                        cx="24"
                        cy="24"
                        r={r}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                    />
                    <circle
                        cx="24"
                        cy="24"
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${fill} ${circ}`}
                        strokeLinecap="round"
                        transform="rotate(-90 24 24)"
                    />
                </svg>
                <span className="text-sm font-black relative z-10" style={{ color }}>
                    {value}
                </span>
            </div>
            <span
                className="text-xs tracking-widest uppercase"
                style={{ color: '#757575' }}
            >
                Index
            </span>
        </div>
    );
}

// Fighter card

interface FighterCardProps {
    name: string;
    advantages: string;
    disadvantages: string;
    performanceIndex: number;
    accentColor: string;
}

function FighterCard({
    name,
    advantages,
    disadvantages,
    performanceIndex,
    accentColor,
}: FighterCardProps) {
    return (
        <div
            className="flex-1 rounded-xl p-4 flex flex-col gap-3"
            style={{
                background: 'rgba(18,18,18,0.65)',
                border: `1px solid ${accentColor}25`,
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <p
                    className="font-black text-base leading-tight"
                    style={{ color: '#F5F5F5' }}
                >
                    {name}
                </p>
                <PerformanceRing value={performanceIndex} color={accentColor} />
            </div>

            <div>
                <p
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: '#66BB6A' }}
                >
                    Advantages
                </p>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(245,245,245,0.75)' }}
                >
                    {advantages}
                </p>
            </div>

            <div>
                <p
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: '#EF5350' }}
                >
                    Disadvantages
                </p>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(245,245,245,0.75)' }}
                >
                    {disadvantages}
                </p>
            </div>
        </div>
    );
}

// Verdict

interface VerdictProps {
    name: string;
    factor: string;
    comment: string;
    accentColor: string;
}

function Verdict({ name, factor, comment, accentColor }: VerdictProps) {
    return (
        <div
            className="rounded-xl p-5 mt-3"
            style={{
                background:
                    'linear-gradient(135deg, rgba(255,179,0,0.08), rgba(18,18,18,0.65))',
                border: '2px solid rgba(255,179,0,0.65)',
                boxShadow:
                    '0 0 32px rgba(255,179,0,0.18), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,179,0,0.14)',
            }}
        >
            <div className="flex items-center gap-2 mb-3">
                <span
                    className="text-xs font-black tracking-[0.25em] uppercase"
                    style={{ color: GOLD }}
                >
                    Verdict
                </span>
                <div
                    className="flex-1 h-px"
                    style={{ background: 'rgba(255,179,0,0.3)' }}
                />
                <span style={{ color: 'rgba(255,179,0,0.5)', fontSize: 11 }}>◆</span>
            </div>

            <div className="flex items-baseline gap-3">
                <p className="text-lg font-black" style={{ color: '#F5F5F5' }}>
                    {name}
                </p>
                <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                        background: `${accentColor}1A`,
                        color: accentColor,
                        border: `1px solid ${accentColor}45`,
                    }}
                >
                    {factor}
                </span>
            </div>

            <p
                className="text-sm mt-2 italic leading-relaxed"
                style={{ color: 'rgba(245,245,245,0.6)' }}
            >
                "{comment}"
            </p>
        </div>
    );
}

// Main component

function AiAnalysis() {
    const [data, setData] = useState<AiAnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchAiData = async () => {
        try {
            const response: AiAnalysisResponse = await api
                .get('sports/ai/')
                .then((res) => res.data);
            setData(response);
            setError(null);
        } catch (err) {
            setError('Error fetching from server');
            console.error('fetchAiData err : ', err);
        }
    };

    useEffect(() => {
        fetchAiData();
    }, []);

    if (error) {
        return (
            <p className="text-center py-16 text-sm" style={{ color: '#EF5350' }}>
                {error}
            </p>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-sm animate-pulse" style={{ color: F1_COLOR }}>
                    Loading AI analysis…
                </span>
            </div>
        );
    }

    const qwen = data.chatter['qwen/qwen3-32b'].analysis;

    return (
        <div className="w-[80%] mx-auto py-8 flex flex-col gap-6">
            {/* ── Consensus graph ── */}
            <ConsensusPanel data={data} />

            {/* ── Qwen section ── */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={glass}>
                <MatrixBackground />

                <div className="relative" style={{ zIndex: 1 }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img
                                src="/quen-bot.webp"
                                alt="Qwen AI"
                                className="w-[90px] h-[90px] rounded-full object-cover"
                                style={{
                                    border: `2px solid ${QWEN_COLOR}`,
                                    boxShadow: `0 0 20px ${QWEN_COLOR}50`,
                                }}
                            />
                            <div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{ boxShadow: `inset 0 0 12px ${QWEN_COLOR}20` }}
                            />
                        </div>
                        <div>
                            <p
                                className="text-2xl font-black tracking-tight"
                                style={{ color: '#F5F5F5' }}
                            >
                                Qwen AI
                            </p>
                            <p
                                className="text-sm tracking-[0.18em] uppercase mt-0.5 font-semibold"
                                style={{ color: QWEN_COLOR }}
                            >
                                qwen / qwen3-32b
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <FighterCard
                            name={qwen.fighter_1.name}
                            advantages={qwen.fighter_1.Advantages}
                            disadvantages={qwen.fighter_1.Disadvantages}
                            performanceIndex={qwen.fighter_1['Performance Index']}
                            accentColor={F1_COLOR}
                        />
                        <FighterCard
                            name={qwen.fighter_2.name}
                            advantages={qwen.fighter_2.Advantages}
                            disadvantages={qwen.fighter_2.Disadvantages}
                            performanceIndex={qwen.fighter_2['Performance Index']}
                            accentColor={F2_COLOR}
                        />
                    </div>

                    <Verdict
                        name={qwen.winner.name}
                        factor={qwen.winner.factor}
                        comment={qwen.winner.comment}
                        accentColor={QWEN_COLOR}
                    />
                </div>
            </div>

            {/* ── Llama section ── */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={glass}>
                <MatrixBackground />

                <div className="relative" style={{ zIndex: 1 }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img
                                src="/cerberus-llama.webp"
                                alt="Llama AIs"
                                className="w-[90px] h-[90px] rounded-full object-cover"
                                style={{
                                    border: `2px solid ${LLAMA_COLOR}`,
                                    boxShadow: `0 0 20px ${LLAMA_COLOR}50`,
                                }}
                            />
                            <div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{ boxShadow: `inset 0 0 12px ${LLAMA_COLOR}20` }}
                            />
                        </div>
                        <div>
                            <p
                                className="text-2xl font-black tracking-tight"
                                style={{ color: '#F5F5F5' }}
                            >
                                Llama Council
                            </p>
                            <p
                                className="text-sm tracking-[0.18em] uppercase mt-0.5 font-semibold"
                                style={{ color: LLAMA_COLOR }}
                            >
                                3 models · meta-llama
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {LLAMA_MODELS.map(({ key, label, color }) => {
                            const analysis = data.chatter[key].analysis;
                            return (
                                <div
                                    key={key}
                                    className="rounded-xl p-4"
                                    style={{
                                        background: 'rgba(18,18,18,0.55)',
                                        border: `1px solid ${LLAMA_COLOR}12`,
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <span
                                            className="text-xs font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                                            style={{
                                                background: `${color}12`,
                                                color,
                                                border: `1px solid ${color}25`,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <FighterCard
                                            name={analysis.fighter_1.name}
                                            advantages={analysis.fighter_1.Advantages}
                                            disadvantages={analysis.fighter_1.Disadvantages}
                                            performanceIndex={analysis.fighter_1['Performance Index']}
                                            accentColor={F1_COLOR}
                                        />
                                        <FighterCard
                                            name={analysis.fighter_2.name}
                                            advantages={analysis.fighter_2.Advantages}
                                            disadvantages={analysis.fighter_2.Disadvantages}
                                            performanceIndex={analysis.fighter_2['Performance Index']}
                                            accentColor={F2_COLOR}
                                        />
                                    </div>

                                    <Verdict
                                        name={analysis.winner.name}
                                        factor={analysis.winner.factor}
                                        comment={analysis.winner.comment}
                                        accentColor={color}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AiAnalysis;
