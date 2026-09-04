import React from 'react';

function PhaseIndicator({ phase }) {
    const phaseClass = `phase-badge phase-${phase}`;
    const labels = {
        steady: '🟢 Steady',
        spike: '🔴 Spike',
        shift: '🔵 Shift',
    };

    return (
        <span className={phaseClass}>
            {labels[phase] || phase}
        </span>
    );
}

export default PhaseIndicator;
