import type { UpcomingEvent } from '../interfaces';

interface Props {
    event: UpcomingEvent;
}

function EventCard({ event }: Props) {
    const isActive = event.active && event.status.toLowerCase() === 'scheduled';

    return (
        <div
            className="group relative rounded-2xl p-px overflow-hidden transition-all duration-300 hover:scale-[1.01]"
            style={{
                background:
                    'linear-gradient(135deg, rgba(255,179,0,0.18) 0%, rgba(255,143,0,0.06) 100%)',
            }}
        >
            {/* Card body */}
            <div
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300"
                style={{
                    background: 'rgba(26,26,26,0.75)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    boxShadow:
                        '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,179,0,0.08)',
                }}
            >
                {/* Top row — short name + status badge */}
                <div className="flex items-center justify-between">
                    <span
                        className="text-xs font-semibold tracking-widest uppercase"
                        style={{ color: '#FF8F00' }}
                    >
                        {event.shortName}
                    </span>
                    <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${isActive
                                ? 'border-[#FFB300]/40 text-[#FFD54F] bg-[#FFB300]/10'
                                : 'border-[#616161]/40 text-[#9E9E9E] bg-white/5'
                            }`}
                    >
                        {event.status}
                    </span>
                </div>

                {/* Event name */}
                <h3
                    className="text-lg font-bold leading-snug"
                    style={{ color: '#F5F5F5' }}
                >
                    {event.name}
                </h3>

                {/* Divider */}
                <div className="h-px" style={{ background: 'rgba(255,179,0,0.1)' }} />

                {/* Date + season */}
                <div
                    className="flex items-center justify-between text-sm"
                    style={{ color: '#BDBDBD' }}
                >
                    <div className="flex items-center gap-1.5">
                        {/* Calendar icon */}
                        <svg
                            className="w-4 h-4 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                            />
                        </svg>
                        <span>{event.dateTime}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#616161' }}>
                        Season {event.season}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
