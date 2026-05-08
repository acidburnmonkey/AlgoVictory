import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d0d' }}>
            {/* Ambient glow blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div style={{
                    position: 'absolute', top: '15%', left: '20%',
                    width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(255,179,0,0.07) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', bottom: '20%', right: '15%',
                    width: 300, height: 300,
                    background: 'radial-gradient(circle, rgba(255,143,0,0.05) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
            </div>

            <div className="relative text-center" style={{ maxWidth: 480 }}>
                {/* Big 404 */}
                <div style={{
                    fontSize: 'clamp(6rem, 20vw, 10rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    marginBottom: '0.5rem',
                }}>
                    404
                </div>

                {/* Glass card */}
                <div style={{
                    background: 'rgba(26,26,26,0.55)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255,179,0,0.15)',
                    borderRadius: 20,
                    padding: '2rem 2.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,179,0,0.1)',
                }}>
                    <h1 style={{
                        color: '#F5F5F5',
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        margin: '0 0 0.75rem',
                        letterSpacing: '-0.01em',
                    }}>
                        Page not found
                    </h1>
                    <p style={{
                        color: '#BDBDBD',
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        fontSize: '0.95rem',
                        margin: '0 0 1.75rem',
                        lineHeight: 1.6,
                    }}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
                            color: '#0a0a0a',
                            fontFamily: "'Inter', 'Segoe UI', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            letterSpacing: '0.04em',
                            border: 'none',
                            borderRadius: 12,
                            padding: '10px 28px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(255,179,0,0.35)',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(255,179,0,0.5)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(255,179,0,0.35)';
                        }}
                    >
                        Go home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
