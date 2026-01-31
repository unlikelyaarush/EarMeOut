import React from 'react';
import './MorningTide.css';

/**
 * Golden Hour - Immersive Sunset Sky
 * 
 * A dramatic twilight scene featuring:
 * - Warm sunset gradient (violet-blue to golden-yellow)
 * - Large glowing sun with bloom/halo effect
 * - Silhouettes of birds flying across the sky
 * - Illuminated clouds glowing coral, rose-pink, and gold
 * - Golden atmospheric dust motes
 * - Venus star twinkling in the upper darkness
 * - Animated SVG Ocean Waves
 */

const MorningTide = () => {
    return (
        <div className="morning-tide">
            {/* Sunset Sky Gradient */}
            <div className="mt-sky">
                {/* Venus - First star appearing */}
                <div className="mt-venus" />

                {/* Golden Atmospheric Dust Motes */}
                <div className="mt-dust-layer mt-dust-1" />
                <div className="mt-dust-layer mt-dust-2" />
                <div className="mt-dust-layer mt-dust-3" />

                {/* Illuminated Clouds */}
                <div className="mt-cloud mt-cloud-1" />
                <div className="mt-cloud mt-cloud-2" />
                <div className="mt-cloud mt-cloud-3" />
                <div className="mt-cloud mt-cloud-4" />
                <div className="mt-cloud mt-cloud-5" />
                <div className="mt-cloud mt-cloud-6" />

                {/* Bird Flocks */}
                <div className="mt-flock mt-flock-1">
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                </div>
                <div className="mt-flock mt-flock-2">
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                </div>
                <div className="mt-flock mt-flock-3">
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                    <div className="mt-bird" />
                </div>



                {/* Horizon Glow */}
                <div className="mt-horizon-glow" />
            </div>

            {/* Ocean Layer - SVG Waves */}
            <div className="mt-ocean-container">
                <svg className="mt-waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="mt-parallax">
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(86, 180, 211, 0.7)" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(86, 180, 211, 0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(86, 180, 211, 0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#56b4d3" />
                    </g>
                </svg>
            </div>

            {/* Film Grain */}
            <div className="mt-noise-overlay" />
        </div>
    );
};

export default MorningTide;
