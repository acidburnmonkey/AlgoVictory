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
