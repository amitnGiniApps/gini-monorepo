import { useEffect, useState } from 'react';

export function useTypingEffect(text: string, speed = 50, delay = 1000) {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        setDisplayed('')
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, speed);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, speed, delay]);

    return displayed;
}
