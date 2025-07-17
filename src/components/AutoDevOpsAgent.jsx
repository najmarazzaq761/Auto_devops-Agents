import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaGithub } from "react-icons/fa";
import AnimatedSlogan from "./AnimatedSlogan"; // Make sure this path is correct

export default function AutoDevOpsAgent() {
    const [repoUrl, setRepoUrl] = useState(() => localStorage.getItem("repoUrl") || "");
    const [platform, setPlatform] = useState("");
    const [files, setFiles] = useState("requirements.txt,app.py");
    const [pipelineYaml, setPipelineYaml] = useState("");
    const [explanation, setExplanation] = useState("");
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repoInfoList, setRepoInfoList] = useState(() => JSON.parse(localStorage.getItem("repoInfoList")) || []);
    const [viewingRepos, setViewingRepos] = useState(false);

    useEffect(() => {
        localStorage.setItem("repoUrl", repoUrl);
    }, [repoUrl]);

    useEffect(() => {
        localStorage.setItem("repoInfoList", JSON.stringify(repoInfoList));
    }, [repoInfoList]);

    const renderFormattedExplanation = (text) => {
        return text.split("\n").map((line, index) => {
            if (/^\*\*Step \d+:.*\*\*$/.test(line)) {
                return <p key={index} className="font-bold text-gray-800 mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
            }
            if (/^\* /.test(line)) {
                const boldMatch = line.match(/\*\*(.*?)\*\*/);
                return (
                    <li key={index} className="list-disc list-inside text-sm text-gray-700 mb-1">
                        {boldMatch ? (
                            <>
                                <strong>{boldMatch[1]}</strong>{line.split(`**${boldMatch[1]}**`)[1]}
                            </>
                        ) : line.slice(2)}
                    </li>
                );
            }
            if (/\*\*(.*?)\*\*/.test(line)) {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={index} className="text-sm text-gray-700 mb-2">
                        {parts.map((part, i) =>
                            part.startsWith("**") && part.endsWith("**")
                                ? <strong key={i}>{part.slice(2, -2)}</strong>
                                : <span key={i}>{part}</span>
                        )}
                    </p>
                );
            }
            return <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>;
        });
    };

    const handleGenerate = async () => {
        const fileList = files.split(',').map(file => file.trim());
        setLoading(true);
        try {
            const response = await fetch("https://web-production-abd3.up.railway.app/generate-cicd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo_url: repoUrl, platform, files: fileList }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Error ${response.status}: ${errorText}`);
                return;
            }

            const data = await response.json();
            setPipelineYaml(data.yaml || "");
            setExplanation(data.explanation || "");
            setShowExplanation(false);
            fetchRepoInfo();
        } catch (error) {
            console.error("Error generating pipeline:", error);
            alert("Server error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRepoInfo = async () => {
        const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/);
        if (!match) return;
        const [_, owner, repo] = match;

        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!res.ok) return;

            const data = await res.json();
            if (!repoInfoList.some(r => r.full_name === data.full_name)) {
                setRepoInfoList(prev => [...prev, data]);
            }
        } catch (e) {
            console.error("Error fetching repo info:", e);
        }
    };

    const handleDownloadYAML = () => {
        const blob = new Blob([pipelineYaml], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pipeline.yml";
        a.click();
        URL.revokeObjectURL(url);
    };

    const platforms = ["Vercel", "Streamlit", "Render", "AWS", "GCP"];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-56 bg-indigo-900 text-white p-6 space-y-6 fixed top-0 bottom-0 left-0">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaRobot className="text-white" /> Auto-DevOps
                </h2>
                <ul className="space-y-3">
                    <li className="hover:text-indigo-300 cursor-pointer" onClick={() => setViewingRepos(false)}>Generate YAML</li>
                    <li className="hover:text-indigo-300 cursor-pointer" onClick={() => setViewingRepos(true)}>View Repo Info</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="ml-56 flex-1 px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="flex justify-center items-center gap-3 text-4xl font-extrabold text-indigo-700 mb-3">
                        <FaRobot className="text-purple-600 animate-pulse" />
                        Auto-DevOps Agent
                        <FaGithub className="text-black animate-bounce" />
                    </div>
                    <AnimatedSlogan />
                </motion.div>

                {/* Input Form */}
                {!viewingRepos && (
                    <motion.div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
                        <input
                            type="text"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                            placeholder="https://github.com/username/repo"
                        />
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white"
                        >
                            <option value="">Select platform...</option>
                            {platforms.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                        </select>
                        <button
                            onClick={handleGenerate}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                        >
                            Generate Pipeline
                        </button>
                    </motion.div>
                )}

                {/* Loading */}
                {loading && <div className="mt-6 text-center text-indigo-600 font-semibold">Generating...</div>}

                {/* Output */}
                {!viewingRepos && pipelineYaml && (
                    <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Pipeline Output</h3>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                onClick={handleDownloadYAML}
                            >
                                Download YAML
                            </button>
                        </div>
                        <div className="flex border-b mb-4">
                            <button
                                className={`px-4 py-2 mr-2 ${!showExplanation ? "border-b-2 border-indigo-600 font-semibold" : "text-gray-600"}`}
                                onClick={() => setShowExplanation(false)}
                            >
                                YAML
                            </button>
                            <button
                                className={`px-4 py-2 ${showExplanation ? "border-b-2 border-indigo-600 font-semibold" : "text-gray-600"}`}
                                onClick={() => setShowExplanation(true)}
                            >
                                Explanation
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[500px] whitespace-pre-wrap text-sm">
                            {!showExplanation ? (
                                <pre className="bg-gray-900 text-green-100 p-4 rounded-lg">{pipelineYaml}</pre>
                            ) : (
                                <div className="text-gray-800">{renderFormattedExplanation(explanation)}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Repo Info */}
                {viewingRepos && (
                    <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">📦 GitHub Repositories Used</h3>
                        {repoInfoList.length === 0 ? (
                            <p className="text-gray-600">No repositories added yet.</p>
                        ) : (
                            repoInfoList.map((repo, idx) => (
                                <div key={repo.full_name + idx} className="mb-6 border-b pb-4">
                                    <p><strong>Name:</strong> {repo.full_name}</p>
                                    <p><strong>Stars:</strong> ⭐ {repo.stargazers_count}</p>
                                    <p><strong>Forks:</strong> {repo.forks_count}</p>
                                    <p><strong>Default Branch:</strong> {repo.default_branch}</p>
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        View on GitHub
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
