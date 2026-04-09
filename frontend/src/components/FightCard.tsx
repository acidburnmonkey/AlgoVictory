import { useEffect, useState } from 'react';
import api from '../api';
import type { FightCardInterface, FighterInterface } from '../interfaces';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import globalData from '../globalData.json';

type StatKey = keyof typeof globalData.stats;

function normalize(value: number, key: StatKey): number {
    const { min, max } = globalData.stats[key];
    if (max === min) return 0;
    return Math.round(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
}

function pct(value: number, key: StatKey): number {
    const { min, max } = globalData.stats[key];
    if (max === min) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function buildRadarData(f1: FighterInterface, f2: FighterInterface) {
    return [
        {
            axis: 'Striking',
            f1: normalize(f1.sig_strikes_landed_per_minute, 'sig_strikes_landed_per_minute'),
            f2: normalize(f2.sig_strikes_landed_per_minute, 'sig_strikes_landed_per_minute'),
        },
        {
            axis: 'Accuracy',
            f1: normalize(f1.sig_strike_accuracy, 'sig_strike_accuracy'),
            f2: normalize(f2.sig_strike_accuracy, 'sig_strike_accuracy'),
        },
        {
            axis: 'Takedowns',
            f1: normalize(f1.takedown_average, 'takedown_average'),
            f2: normalize(f2.takedown_average, 'takedown_average'),
        },
        {
            axis: 'Grappling',
            f1: normalize(f1.submission_average, 'submission_average'),
            f2: normalize(f2.submission_average, 'submission_average'),
        },
        {
            axis: 'KO Power',
            f1: normalize(f1.knockout_percentage, 'knockout_percentage'),
            f2: normalize(f2.knockout_percentage, 'knockout_percentage'),
        },
        {
            axis: 'Decisions',
            f1: normalize(f1.decision_percentage, 'decision_percentage'),
            f2: normalize(f2.decision_percentage, 'decision_percentage'),
        },
    ];
}

const glass = {
    background: 'rgba(26,26,26,0.80)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255,179,0,0.15)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,179,0,0.08)',
} as const;

const F1_COLOR = '#FFB300';
const F2_COLOR = '#42A5F5';

interface StatRowProps {
    label: string;
    f1Value: number;
    f2Value: number;
    statKey: StatKey;
    fmt?: (v: number) => string;
}

function StatRow({ label, f1Value, f2Value, statKey, fmt = (v) => String(v) }: StatRowProps) {
    const f1Pct = pct(f1Value, statKey);
    const f2Pct = pct(f2Value, statKey);
    const avgPct = pct(globalData.stats[statKey].avg, statKey);
    const f1Wins = f1Value >= f2Value;

    return (
        <div className="grid grid-cols-[1fr_6rem_1fr] items-center gap-4 py-2.5">
            <div className="flex flex-col items-end gap-1.5">
                <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: f1Wins ? F1_COLOR : 'rgba(245,245,245,0.5)' }}
                >
                    {fmt(f1Value)}
                </span>
                <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                        className="absolute right-0 top-0 h-full rounded-full"
                        style={{ width: `${f1Pct}%`, background: `linear-gradient(to left, ${F1_COLOR}, #FF8F00)` }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#9E9E9E' }}>
                    {label}
                </span>
                <span className="text-[9px]" style={{ color: '#757575' }}>
                    avg {fmt(globalData.stats[statKey].avg)}
                </span>
                <div className="relative w-full h-0.5 rounded-full mt-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-px h-2.5 rounded-full"
                        style={{ left: `${avgPct}%`, background: 'rgba(255,255,255,0.2)' }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-start gap-1.5">
                <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: !f1Wins ? F2_COLOR : 'rgba(245,245,245,0.5)' }}
                >
                    {fmt(f2Value)}
                </span>
                <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ width: `${f2Pct}%`, background: `linear-gradient(to right, ${F2_COLOR}, #1E88E5)` }}
                    />
                </div>
            </div>
        </div>
    );
}

interface FighterColProps {
    fighter: FighterInterface;
    color: string;
    align: 'left' | 'right';
}

function FighterCol({ fighter, color, align }: FighterColProps) {
    const end = align === 'right';
    return (
        <div className={`flex flex-col gap-3 ${end ? 'items-end text-right' : 'items-start text-left'}`}>
            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                    border: `1px solid ${color}33`,
                    fontSize: 40,
                }}
            >
                🥊
            </div>

            <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color, minHeight: '1rem', display: 'block' }}>
                {fighter.nickname ? `"${fighter.nickname}"` : ''}
            </span>

            <div>
                <p className="text-xl font-black leading-tight" style={{ color: '#F5F5F5' }}>
                    {fighter.first_name}
                </p>
                <p className="text-xl font-black leading-tight" style={{ color: '#F5F5F5' }}>
                    {fighter.last_name}
                </p>
            </div>

            <div className={`flex gap-3 text-sm font-bold ${end ? 'flex-row-reverse' : ''}`}>
                <span style={{ color: '#66BB6A' }}>{fighter.wins}W</span>
                <span style={{ color: '#EF5350' }}>{fighter.losses}L</span>
                {fighter.draws > 0 && <span style={{ color: '#9E9E9E' }}>{fighter.draws}D</span>}
            </div>

            <div className={`flex flex-col gap-1 text-xs ${end ? 'items-end' : ''}`} style={{ color: '#9E9E9E' }}>
                <span>{fighter.technical_knockouts} KO/TKO</span>
                <span>{fighter.submissions} Subs</span>
                <span>{fighter.title_wins} Title W</span>
            </div>
        </div>
    );
}

function FightCard() {
    const [card, setCard] = useState<FightCardInterface | undefined>();
    const [fighter1, setFighter1] = useState<FighterInterface | null>(null);
    const [fighter2, setFighter2] = useState<FighterInterface | null>(null);

    const getCard = async () => {
        const response = await api.get('sports/fight-card/');
        if (response.status === 200) {
            const data: FightCardInterface = response.data[0];
            setCard(data);
            setFighter1(data.fighters[0].fighter ?? null);
            setFighter2(data.fighters[1].fighter ?? null);
        }
    };

    useEffect(() => {
        getCard();
    }, []);

    if (!card || !fighter1 || !fighter2) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-sm animate-pulse" style={{ color: F1_COLOR }}>Loading fight card…</span>
            </div>
        );
    }

    const radarData = buildRadarData(fighter1, fighter2);
    const f1Name = `${fighter1.first_name} ${fighter1.last_name}`;
    const f2Name = `${fighter2.first_name} ${fighter2.last_name}`;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

            {/* Header */}
            <div className="rounded-2xl p-6 flex flex-col items-center" style={glass}>
                <h1
                    className="text-4xl font-black tracking-tight"
                    style={{
                        color: 'transparent',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        backgroundImage: 'linear-gradient(135deg, #FFD54F 0%, #FF8F00 100%)',
                    }}
                >
                    UFC {card.event}
                </h1>
            </div>

            {/* Fighter matchup */}
            <div className="rounded-2xl p-6" style={glass}>
                <div className="grid grid-cols-[1fr_3rem_1fr] items-center gap-2">
                    <FighterCol fighter={fighter1} color={F1_COLOR} align="left" />
                    <div className="flex flex-col items-center">
                        <span
                            className="text-xl font-black"
                            style={{
                                color: 'transparent',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: `linear-gradient(180deg, ${F1_COLOR}, ${F2_COLOR})`,
                            }}
                        >
                            VS
                        </span>
                    </div>
                    <FighterCol fighter={fighter2} color={F2_COLOR} align="right" />
                </div>
            </div>

            {/* Radar */}
            <div className="rounded-2xl p-6" style={glass}>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: '#9E9E9E' }}>
                    Fighter Profile
                </p>
                <p className="text-[10px] mb-4" style={{ color: '#757575' }}>
                    Scores normalized 0–100 relative to UFC roster benchmarks
                </p>
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="rgba(255,179,0,0.08)" />
                        <PolarAngleAxis
                            dataKey="axis"
                            tick={{ fill: '#9E9E9E', fontSize: 10, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: '#757575', fontSize: 8 }}
                            tickCount={3}
                        />
                        <Radar
                            name={f1Name}
                            dataKey="f1"
                            stroke={F1_COLOR}
                            fill={F1_COLOR}
                            fillOpacity={0.15}
                            strokeWidth={2}
                            dot={{ fill: F1_COLOR, r: 3 }}
                        />
                        <Radar
                            name={f2Name}
                            dataKey="f2"
                            stroke={F2_COLOR}
                            fill={F2_COLOR}
                            fillOpacity={0.15}
                            strokeWidth={2}
                            dot={{ fill: F2_COLOR, r: 3 }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 11, color: '#9E9E9E', paddingTop: 8 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(20,20,20,0.95)',
                                border: '1px solid rgba(255,179,0,0.2)',
                                borderRadius: 10,
                                fontSize: 11,
                                color: '#F5F5F5',
                            }}
                            formatter={(val: number) => [`${val} / 100`, '']}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Stat comparison */}
            <div className="rounded-2xl p-6" style={glass}>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: '#9E9E9E' }}>
                        Stats Comparison
                    </p>
                    <p className="text-[10px]" style={{ color: '#757575' }}>
                        bar width = position within UFC range
                    </p>
                </div>

                <div className="grid grid-cols-[1fr_6rem_1fr] mb-3">
                    <span className="text-[10px] font-semibold" style={{ color: F1_COLOR }}>
                        {fighter1.first_name} {fighter1.last_name[0]}.
                    </span>
                    <span />
                    <span className="text-[10px] font-semibold text-right" style={{ color: F2_COLOR }}>
                        {fighter2.first_name} {fighter2.last_name[0]}.
                    </span>
                </div>

                <div className="divide-y" style={{ borderColor: 'rgba(255,179,0,0.06)' }}>
                    <StatRow label="Sig. Str / Min"  f1Value={fighter1.sig_strikes_landed_per_minute} f2Value={fighter2.sig_strikes_landed_per_minute} statKey="sig_strikes_landed_per_minute" fmt={(v) => v.toFixed(2)} />
                    <StatRow label="Str. Accuracy"   f1Value={fighter1.sig_strike_accuracy}           f2Value={fighter2.sig_strike_accuracy}           statKey="sig_strike_accuracy"           fmt={(v) => `${v}%`} />
                    <StatRow label="Takedown Avg"    f1Value={fighter1.takedown_average}              f2Value={fighter2.takedown_average}              statKey="takedown_average"              fmt={(v) => v.toFixed(2)} />
                    <StatRow label="Submission Avg"  f1Value={fighter1.submission_average}            f2Value={fighter2.submission_average}            statKey="submission_average"            fmt={(v) => v.toFixed(2)} />
                    <StatRow label="KO %"            f1Value={fighter1.knockout_percentage}           f2Value={fighter2.knockout_percentage}           statKey="knockout_percentage"           fmt={(v) => `${v}%`} />
                    <StatRow label="TKO %"           f1Value={fighter1.technical_knockout_percentage} f2Value={fighter2.technical_knockout_percentage} statKey="technical_knockout_percentage" fmt={(v) => `${v}%`} />
                    <StatRow label="Decision %"      f1Value={fighter1.decision_percentage}           f2Value={fighter2.decision_percentage}           statKey="decision_percentage"           fmt={(v) => `${v}%`} />
                </div>
            </div>
        </div>
    );
}

export default FightCard;
