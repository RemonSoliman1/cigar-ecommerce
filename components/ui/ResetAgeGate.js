'use client';

export default function ResetAgeGate() {
    return (
        <button
            onClick={() => {
                sessionStorage.removeItem('age_verified');
                localStorage.removeItem('age_verified');
                window.location.reload();
            }}
            style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.7rem', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
            Reset Age Verification (Test)
        </button>
    );
}
