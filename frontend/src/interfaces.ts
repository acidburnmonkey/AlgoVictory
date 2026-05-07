export interface UpcomingEvent {
    id: number;
    active: boolean;
    dateTime: string;
    day: string;
    eventId: number;
    leagueId: number;
    name: string;
    season: number;
    shortName: string;
    status: string;
}

export interface userInfo {
    id?: number;
    username: string;
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
    provider: 'local' | 'google';
    avatar: string | null;
    premium: boolean;
    payment_date?: string | null;
    payment_expires?: string | null;
}

export interface FighterInterface {
    fighter_id: number;
    first_name: string;
    last_name: string;
    nickname?: string | null;
    weight_class: string;
    birth_date: string;
    height: number;
    weight: number;
    reach: number;
    wins: number;
    losses: number;
    draws: number;
    no_contests: number;
    technical_knockouts: number;
    technical_knockout_losses: number;
    submissions: number;
    submission_losses: number;
    title_wins: number;
    title_losses: number;
    title_draws: number;
    sig_strikes_landed_per_minute: number;
    sig_strike_accuracy: number;
    takedown_average: number;
    submission_average: number;
    knockout_percentage: number;
    technical_knockout_percentage: number;
    decision_percentage: number;
    imageURL: string | null;
}

interface AiFighterAnalysis {
    name: string;
    Advantages: string;
    Disadvantages: string;
    'Performance Index': number;
}

interface AiWinner {
    name: string;
    factor: string;
    comment: string;
    points?: number;
}

interface AiAnalysis {
    fighter_1: AiFighterAnalysis;
    fighter_2: AiFighterAnalysis;
    winner: AiWinner;
}

interface AiModelResult {
    analysis: AiAnalysis;
}

interface AiChatter {
    'llama-3.1-8b-instant': AiModelResult;
    'llama-3.3-70b-versatile': AiModelResult;
    'meta-llama/llama-4-scout-17b-16e-instruct': AiModelResult;
    'qwen/qwen3-32b': AiModelResult;
}

export interface AiAnalysisResponse {
    id: number;
    chatter: AiChatter;
    event: number;
}

export interface FightCardInterface {
    fight_id: number;
    weight_class: string;
    status: string;
    event: number;
    day: string;
    fighters: { fighter: FighterInterface }[];
}
