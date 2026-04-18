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

export interface FightCardInterface {
    fight_id: number;
    weight_class: string;
    status: string;
    event: number;
    day: string;
    fighters: { fighter: FighterInterface }[];
}
