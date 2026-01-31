import React, { useRef, useEffect, useState, useCallback } from 'react';
import './MorningTide.css';

/**
 * MorningTide - Scroll-Based Image Sequence Background
 * 
 * Uses a sticky container to create a "Scrollytelling" experience.
 * The component has a large height (400vh) to define the scroll track.
 * As the user scrolls, the canvas stays pinned (sticky) and the 
 * scroll progress maps to the image sequence frames.
 * 
 * 0% Scroll (Top) = Frame 1 (Night)
 * 100% Scroll (Bottom) = Frame 240 (Sunrise)
 */

const TOTAL_FRAMES = 240;
const IMAGE_PATH = '/sequence/ezgif-frame-';

const MorningTide = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imagesRef = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const currentFrameRef = useRef(1);
    const rafRef = useRef(null);

    // Preload all images
    useEffect(() => {
        let loadedCount = 0;
        const images = [];

        const loadImage = (index) => {
            return new Promise((resolve) => {
                const img = new Image();
                const frameNumber = String(index).padStart(3, '0');
                img.src = `${IMAGE_PATH}${frameNumber}.png`;

                img.onload = () => {
                    images[index - 1] = img;
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };

                img.onerror = () => {
                    console.warn(`Failed to load frame ${index}`);
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };
            });
        };

        // Load all images concurrently in batches
        const loadAllImages = async () => {
            const batchSize = 20;
            for (let i = 1; i <= TOTAL_FRAMES; i += batchSize) {
                const batch = [];
                for (let j = i; j < i + batchSize && j <= TOTAL_FRAMES; j++) {
                    batch.push(loadImage(j));
                }
                await Promise.all(batch);
            }

            imagesRef.current = images;
            setIsLoading(false);

            // Draw first frame once loaded
            setTimeout(() => drawFrame(1), 50);
        };

        loadAllImages();

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Draw a specific frame to the canvas
    const drawFrame = useCallback((frameIndex) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = imagesRef.current[frameIndex - 1];

        if (!ctx || !img) return;

        // Set canvas size to match viewport
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Only resize if dimensions change to avoid clearing canvas unnecessarily
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Calculate cover-fit dimensions
        const imgRatio = img.width / img.height;
        const canvasRatio = rect.width / rect.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > canvasRatio) {
            // Image is wider - fit by height
            drawHeight = rect.height;
            drawWidth = drawHeight * imgRatio;
            drawX = (rect.width - drawWidth) / 2;
            drawY = 0;
        } else {
            // Image is taller - fit by width
            drawWidth = rect.width;
            drawHeight = drawWidth / imgRatio;
            drawX = 0;
            drawY = (rect.height - drawHeight) / 2;
        }

        // Since we're drawing cover, no need to clear rect if we cover everything
        // But safe to do so
        // ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, []);

    // Handle scroll to update frame
    useEffect(() => {
        if (isLoading) return;

        const handleScroll = () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                const container = containerRef.current;
                if (!container) return;

                // Calculate scroll progress relative to the container
                const rect = container.getBoundingClientRect();

                // rect.top is 0 when container starts, and becomes negative as we scroll down
                // The container is 400vh tall.
                // We want 0% when rect.top == 0
                // We want 100% when rect.bottom == window.innerHeight (end of container)

                const scrollDist = rect.height - window.innerHeight;
                const scrolled = -rect.top;

                const progress = Math.max(0, Math.min(1, scrolled / scrollDist));

                // Map progress to frame index (1 to TOTAL_FRAMES)
                const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));

                if (frameIndex !== currentFrameRef.current) {
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }
            });
        };

        const handleResize = () => {
            drawFrame(currentFrameRef.current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Initial draw
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isLoading, drawFrame]);

    return (
        <div
            className="morning-tide-container"
            ref={containerRef}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="mt-loading-overlay">
                    <div className="mt-loading-content">
                        <div className="mt-loading-spinner"></div>
                        <div className="mt-loading-text">Loading Sunrise... {loadProgress}%</div>
                        <div className="mt-loading-bar">
                            <div
                                className="mt-loading-progress"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky wrapper holds the canvas in place while container scrolls */}
            <div className="mt-sticky-wrapper">
                <canvas
                    ref={canvasRef}
                    className="morning-tide-canvas"
                />

                {/* Film grain overlay */}
                <div className="mt-noise-overlay" />

                {/* Optional scroll indicator (removed if not wanted) */}
                {!isLoading && currentFrameRef.current < 20 && (
                    <div className="mt-scroll-hint">
                        Scroll to Rise
                    </div>
                )}
            </div>
        </div>
    );
};

export default MorningTide;
