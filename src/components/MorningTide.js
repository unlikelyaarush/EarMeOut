import React from 'react';
import './MorningTide.css';

/**
 * Morning Tide - Sunset Beach with Shooting Stars
 * 
 * A serene sunset beach scene with:
 * - Low sun on the horizon
 * - Animated ocean waves
 * - Shooting stars streaking across the sky
 */

const MorningTide = () => {
    return (
        <div className="morning-tide">
            {/* Sky Container */}
            <div className="mt-sky">
                <div className="mt-stars" />

                {/* Shooting Stars */}
                <div className="mt-shooting-star mt-star-1" />
                <div className="mt-shooting-star mt-star-2" />
                <div className="mt-shooting-star mt-star-3" />
                <div className="mt-shooting-star mt-star-4" />
                <div className="mt-shooting-star mt-star-5" />

                {/* Sun - Low on horizon */}
                <div className="mt-sun-container">
                    <div className="mt-sun" />
                    <div className="mt-sun-halo" />
                </div>
            </div>

            {/* Ocean Container */}
            <div className="mt-ocean">
                {/* Sun Reflection */}
                <div className="mt-reflection-column" />

                {/* Animated Wave Layers */}
                <div className="mt-wave-layer mt-layer-5">
                    <div className="mt-wave-shape" />
                </div>
                <div className="mt-wave-layer mt-layer-4">
                    <div className="mt-wave-shape" />
                </div>
                <div className="mt-wave-layer mt-layer-3">
                    <div className="mt-wave-shape" />
                </div>
                <div className="mt-wave-layer mt-layer-2">
                    <div className="mt-wave-shape" />
                </div>
                <div className="mt-wave-layer mt-layer-1">
                    <div className="mt-wave-shape" />
                </div>

                {/* Beach Glow */}
                <div className="mt-beach-glow" />
            </div>

            {/* Film Grain */}
            <div className="mt-noise-overlay" />
        </div>
    );
};

export default MorningTide;
