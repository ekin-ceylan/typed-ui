import '../assets/styles/console-logger.css';
import React, { useState, useEffect, useRef } from 'react';

const ConsoleLogger = ({ height = '200px' }) => {
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    useEffect(() => {
        const originalError = globalThis.console.error;

        const interceptedError = (...args) => {
            const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
            setLogs(prevLogs => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`]);
            originalError.apply(globalThis.console, args);
        };

        globalThis.console.error = interceptedError;

        const errorHandler = event => {
            setLogs(prevLogs => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${event.message}`]);
        };

        globalThis.addEventListener('error', errorHandler);

        return () => {
            globalThis.console.error = originalError;
            globalThis.removeEventListener('error', errorHandler);
        };
    }, []);

    // Otomatik scroll
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="sb-console-root" style={{ height }}>
            <button className="sb-console-clear" onClick={() => setLogs([])}>
                Clear
            </button>
            <div className="sb-console-body">
                {logs.map((log, index) => (
                    <div key={index} className="sb-console-log">
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default ConsoleLogger;
