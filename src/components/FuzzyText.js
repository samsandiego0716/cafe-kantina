"use client";

import React from "react";
import { motion } from "framer-motion";

const FuzzyText = ({
    children,
    fontSize = "clamp(2.5rem, 5vw, 4rem)",
    fontWeight = 900,
    fontFamily = "inherit",
    color = "#fff",
    enableHover = true,
    baseIntensity = 0.2,
    hoverIntensity = 0.5
}) => {
    return (
        <div style={{
            position: "relative",
            display: "flex",
            fontSize,
            fontWeight,
            fontFamily,
            color,
            overflow: "hidden" // Ensures the blur doesn't overflow weirdly
        }}>
            {/* Background blurred layer */}
            <motion.div
                initial={{ filter: `blur(${baseIntensity}rem)` }}
                whileHover={enableHover ? { filter: `blur(${hoverIntensity}rem)` } : {}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    userSelect: "none",
                    pointerEvents: "none",
                    opacity: 0.7, // Slightly transparent for the "steam" effect
                }}
            >
                {children}
            </motion.div>

            {/* Foreground sharp layer */}
            <motion.div
                initial={{ filter: "blur(0rem)" }}
                whileHover={enableHover ? { filter: `blur(${baseIntensity / 2}rem)` } : {}} // Slight blur on hover for effect
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ position: "relative", zIndex: 1 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default FuzzyText;
