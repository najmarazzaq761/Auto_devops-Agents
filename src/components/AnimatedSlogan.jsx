import React, { useEffect, useState } from "react";

const slogans = [
    "🔁 From Code to Cloud, We Got You Covered!",
    "⚙️ Build. Test. Deploy. Repeat.",
    "🚀 Turn Repos into Real-time Pipelines!",
    "🛠️ CI/CD Magic in Seconds!",
    "🎯 Your Code, Now With Superpowers!"
];

const sloganColors = [
    "text-indigo-600",
    "text-green-600",
    "text-purple-600",
    "text-pink-600",
    "text-blue-600"
];

const AnimatedSlogan = React.memo(() => {
    const [sloganIndex, setSloganIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        const current = slogans[sloganIndex];
        if (charIndex < current.length) {
            const timeout = setTimeout(() => {
                setDisplayed(current.slice(0, charIndex + 1));
                setCharIndex(c => c + 1);
            }, 40);
            return () => clearTimeout(timeout);
        } else {
            const delay = setTimeout(() => {
                setSloganIndex(i => (i + 1) % slogans.length);
                setCharIndex(0);
                setDisplayed("");
            }, 2500);
            return () => clearTimeout(delay);
        }
    }, [charIndex, sloganIndex]);

    return (
        <p className={`text-xl italic font-semibold transition-none ${sloganColors[sloganIndex]}`}>
            {displayed}
        </p>
    );
});

export default AnimatedSlogan;
