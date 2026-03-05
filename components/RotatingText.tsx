"use client";

import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';

interface RotatingTextProps {
    texts: string[];
    mainClassName?: string;
    splitLevelClassName?: string;
    staggerDuration?: number;
    staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
    transition?: Transition;
    initial?: Variants['initial'];
    animate?: Variants['animate'];
    exit?: Variants['exit'];
    rotationInterval?: number;
    pauseOnHover?: boolean;
    rotateOnlyOnHover?: boolean;
}

const RotatingText = forwardRef<{ next: () => void; previous: () => void; jumpTo: (index: number) => void }, RotatingTextProps>(
    (
        {
            texts,
            mainClassName = '',
            splitLevelClassName = '',
            staggerDuration = 0.025,
            staggerFrom = 'first',
            transition = { type: 'spring', damping: 30, stiffness: 400 },
            initial = { y: '100%' },
            animate = { y: 0 },
            exit = { y: '-120%' },
            rotationInterval = 2000,
            pauseOnHover = false,
            rotateOnlyOnHover = false,
            ...rest
        },
        ref
    ) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const [isPaused, setIsPaused] = useState(rotateOnlyOnHover);

        const handleNext = useCallback(() => {
            setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, [texts.length]);

        const handlePrevious = useCallback(() => {
            setCurrentIndex((prev) => (prev - 1 + texts.length) % texts.length);
        }, [texts.length]);

        const handleJumpTo = useCallback((index: number) => {
            setCurrentIndex(index % texts.length);
        }, [texts.length]);

        useImperativeHandle(ref, () => ({
            next: handleNext,
            previous: handlePrevious,
            jumpTo: handleJumpTo,
        }));

        useEffect(() => {
            if (isPaused) return;
            const timer = setInterval(handleNext, rotationInterval);
            return () => clearInterval(timer);
        }, [handleNext, rotationInterval, isPaused]);

        return (
            <motion.span
                className={`relative inline-flex whitespace-nowrap overflow-hidden ${mainClassName}`}
                onMouseEnter={() => {
                    if (rotateOnlyOnHover) {
                        setIsPaused(false);
                        handleNext(); // Trigger immediate rotation on hover start
                    }
                    if (pauseOnHover) setIsPaused(true);
                }}
                onMouseLeave={() => {
                    if (rotateOnlyOnHover) setIsPaused(true);
                    if (pauseOnHover) setIsPaused(false);
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                {...rest}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentIndex}
                        className={`flex flex-wrap ${splitLevelClassName}`}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {texts[currentIndex].split('').map((char, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    initial,
                                    animate,
                                    exit,
                                }}
                                transition={{
                                    ...transition,
                                    delay:
                                        i * staggerDuration +
                                        (staggerFrom === 'last' ? (texts[currentIndex].length - 1 - i) * staggerDuration : 0),
                                }}
                                className="inline-block"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        );
    }
);

RotatingText.displayName = 'RotatingText';

export default RotatingText;
