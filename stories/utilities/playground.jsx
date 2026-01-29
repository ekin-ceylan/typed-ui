import { Canvas, Controls } from '@storybook/addon-docs/blocks';
import ConsoleLogger from './console-logger.jsx';
import React, { useState } from 'react';
import '../assets/styles/playground.css';

const Playground = ({ playgroundStory, sideControl = false }) => {
    const [isMobile, setIsMobile] = useState(!sideControl);

    return (
        <div className={`sb-page${isMobile ? '' : ' sb-side-control'}`}>
            <div className="sb-container">
                <div className="sb-title">
                    <h4>Preview</h4>
                </div>
                <div className="sb-canvas">
                    <Canvas of={playgroundStory} />
                </div>
                <div className="sb-title sb-panel-title">
                    <h4>Controls</h4>
                    <button onClick={() => setIsMobile(m => !m)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.5 4.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM10 6.004a.5.5 0 100 1h1a.5.5 0 000-1h-1zM9.5 8.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z"
                                fill="currentColor"
                            ></path>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11zm.5-1v-10h6v10H2zm7-10h3v10H9v-10z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="sb-panel">
                    <Controls of={playgroundStory} />
                </div>
                <div className="sb-title">
                    <h4>Error Console</h4>
                </div>
                <ConsoleLogger height="100px" />
            </div>

            <div className="sb-container">
                <div className="sb-title">
                    <h4>Controls</h4>
                    <button onClick={() => setIsMobile(m => !m)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 10.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM6.5 10.004a.5.5 0 000 1h1a.5.5 0 000-1h-1zM9 10.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z"
                                fill="currentColor"
                            ></path>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 6.5v-6h10v6H2zm10 1v3H2v-3h10z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="sb-panel">
                    <Controls of={playgroundStory} />
                </div>
            </div>
        </div>
    );
};

export default Playground;
