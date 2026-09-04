import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(url) {
    const [connected, setConnected] = useState(false);
    const [data, setData] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(url, {
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('metrics', (metrics) => {
            setData(prev => ({ ...prev, metrics }));
        });

        socket.on('weight_update', (weights) => {
            setData(prev => ({ ...prev, weights }));
        });

        socket.on('eviction', (eviction) => {
            setData(prev => ({
                ...prev,
                evictions: [...(prev.evictions || []).slice(-50), eviction],
            }));
        });

        return () => socket.disconnect();
    }, [url]);

    const emit = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    return { connected, data, emit };
}
