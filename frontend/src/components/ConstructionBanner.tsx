import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';

const IN_CONSTRUCTION = import.meta.env.VITE_PROD_WIP === 'true';

function ConstructionBanner() {
    if (!IN_CONSTRUCTION) return null;

    return (
        <div
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide"
            style={{
                background: 'linear-gradient(90deg, rgba(255,143,0,0.15), rgba(255,179,0,0.2), rgba(255,143,0,0.15))',
                borderBottom: '1px solid rgba(255,179,0,0.25)',
                color: '#FFB300',
            }}
        >
            <ConstructionRoundedIcon sx={{ fontSize: 15 }} />
            This site is currently under construction — some features may be unavailable
            <ConstructionRoundedIcon sx={{ fontSize: 15 }} />
        </div>
    );
}

export default ConstructionBanner;
