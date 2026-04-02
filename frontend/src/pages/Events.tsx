import { useEffect, useState } from 'react';
import api from '../api';
import type { UpcomingEvent } from '../interfaces';
import { EventCard } from '../components';

function Events() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/sports/show-events/')
            .then((res) => setEvents(res.data))
            .catch((err) => setError(err.message ?? 'Failed to load events'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="flex-1 px-4 py-10 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
                <h1
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: '#F5F5F5' }}
                >
                    Upcoming Events
                </h1>
                <p className="mt-1 text-sm" style={{ color: '#BDBDBD' }}>
                    UFC scheduled events for the current season
                </p>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div
                        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: '#FFB300', borderTopColor: 'transparent' }}
                    />
                </div>
            )}

            {error && (
                <div
                    className="rounded-xl px-4 py-3 text-sm border"
                    style={{
                        background: 'rgba(239,83,80,0.08)',
                        borderColor: 'rgba(239,83,80,0.3)',
                        color: '#EF5350',
                    }}
                >
                    {error}
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <p className="text-center py-24 text-sm" style={{ color: '#616161' }}>
                    No events found.
                </p>
            )}

            {!loading && !error && events.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard key={event.eventId} event={event} />
                    ))}
                </div>
            )}
        </main>
    );
}

export default Events;
