import { useEffect, useState } from 'react';
import api from '../api';

type AnyObj = { [k: string]: any };

export default function Schedule() {
    const [events, setEvents] = useState<AnyObj[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [upcomingOnly, setUpcomingOnly] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (upcomingOnly) params.upcoming = 'true';
            const res = await api.get('/events/', { params });
            // backend wraps data in { data: [...] }
            const data = res.data?.data ?? res.data ?? [];
            setEvents(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upcomingOnly]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await api.post('/events/refresh/', { season: '2026' });
            // after refresh, reload events
            fetchEvents();
            alert(`Refreshed: created ${res.data.created}, updated ${res.data.updated}`);
        } catch (e: any) {
            alert('Refresh failed: ' + (e.response?.data?.detail ?? e.message));
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div style={{ maxWidth: 980, margin: '24px auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>UFC Events (Server-stored)</h2>
                <div>
                    <label style={{ marginRight: 8 }}>
                        <input type="checkbox" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />{' '}
                        Upcoming only
                    </label>
                    <button onClick={handleRefresh} disabled={refreshing} style={{ marginLeft: 12 }}>
                        {refreshing ? 'Refreshing…' : 'Refresh (admin)'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div>Loading…</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eef', textAlign: 'left' }}>
                            <th style={{ padding: 8, color: '#000' }}>ID</th>
                            <th style={{ padding: 8, color: '#000' }}>Name</th>
                            <th style={{ padding: 8, color: '#000' }}>Date</th>
                            <th style={{ padding: 8, color: '#000' }}>Fights</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev) => (
                            <tr key={ev.external_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 8 }}>{ev.external_id}</td>
                                <td style={{ padding: 8 }}>{ev.name}</td>
                                <td style={{ padding: 8 }}>{ev.date ? new Date(ev.date).toLocaleString() : '—'}</td>
                                <td style={{ padding: 8 }}>{(ev.fights || []).length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
