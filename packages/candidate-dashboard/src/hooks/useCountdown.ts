import { useEffect, useState } from 'react';

export const useCountdown = (time = 0) => { // TODO: move it to redux
    const [timeLeft, setTimeLeft] = useState(time);
    useEffect(() => {
        if (!timeLeft) return;
        const timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);
    return [timeLeft, setTimeLeft] as const;
};
