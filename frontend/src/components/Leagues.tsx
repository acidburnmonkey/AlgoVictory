import React, { useEffect, useState } from "react";
import axios from "axios";

type AnyObj = { [k: string]: any };

export const fetchLeagues = async () => {
    const base = (globalThis as any)?.process?.env?.REACT_APP_API_URL ?? "http://localhost:8000";
    const url = `${base.replace(/\/$/, "")}/api/leagues/`;

    try {
        const res = await axios.get(url, { withCredentials: true });
        return res.data;
    } catch (err: any) {
        if (err.response) {
            const status = err.response.status;
            const text = typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data);
            throw new Error(`API ${status}: ${text}`);
        }
        throw new Error(err?.message ?? "Network error when calling API");
    }
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: 880,
        margin: "24px auto",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(16,24,40,0.08)",
        background: "linear-gradient(180deg,#fff,#fbfdff)",
        fontFamily: "Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif"
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    title: { margin: 0, fontSize: 20, color: "#0f172a" },
    count: { fontSize: 13, color: "#475569" },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        overflow: "hidden",
        borderRadius: 8
    },
    th: {
        textAlign: "left",
        padding: "12px 16px",
        fontSize: 13,
        color: "#0f172a",
        background: "#eef2ff",
        borderBottom: "1px solid rgba(15,23,42,0.06)"
    },
    td: {
        padding: "12px 16px",
        fontSize: 14,
        color: "#0f172a",
        borderBottom: "1px solid rgba(15,23,42,0.04)"
    },
    rowEven: { background: "white" },
    rowOdd: { background: "#fbfbff" },
    abbrPill: {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 999,
        background: "#eef2ff",
        color: "#3730a3",
        fontWeight: 600,
        fontSize: 12
    },
    loading: { textAlign: "center", padding: 24, color: "#334155" },
    error: { color: "#b91c1c", padding: 12, background: "#fff1f2", borderRadius: 8 }
};

export default function Leagues() {
    const [leagues, setLeagues] = useState<AnyObj[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchLeagues();
                const list =
                    Array.isArray(data) ? data :
                    Array.isArray(data?.data) ? data.data :
                    Array.isArray(data?.results) ? data.results :
                    [];
                setLeagues(list);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Leagues</h2>
                <div style={styles.count}>{loading ? "Loading…" : `${leagues.length} items`}</div>
            </div>

            {error && <div style={styles.error}>Error: {error}</div>}

            {loading && !error ? (
                <div style={styles.loading}>Loading leagues…</div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Abbreviation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagues.map((item, i) => {
                            const id = item.id ?? item.pk ?? i;
                            const name = item.name ?? item.title ?? "Unnamed";
                            const abbr = item.abbreviation ?? item.abbrev ?? "";
                            const rowStyle = i % 2 === 0 ? styles.rowEven : styles.rowOdd;
                            return (
                                <tr key={id} style={rowStyle}>
                                    <td style={styles.td}><strong>{id}</strong></td>
                                    <td style={styles.td}>{name}</td>
                                    <td style={styles.td}>
                                        {abbr ? <span style={styles.abbrPill}>{abbr}</span> : <span style={{ color: "#94a3b8" }}>—</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}