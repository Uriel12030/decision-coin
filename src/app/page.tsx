"use client";

import { useState, useEffect } from "react";

interface Decision {
  optionA: string;
  optionB: string;
  result: string;
  timestamp: string;
}

const STORAGE_KEY = "decision-coin-history";

function loadHistory(): Decision[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: Decision[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export default function Home() {
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [errorA, setErrorA] = useState(false);
  const [errorB, setErrorB] = useState(false);
  const [history, setHistory] = useState<Decision[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleDecide() {
    const emptyA = optionA.trim() === "";
    const emptyB = optionB.trim() === "";
    setErrorA(emptyA);
    setErrorB(emptyB);

    if (emptyA || emptyB) {
      setResult(null);
      return;
    }

    const chosen = Math.random() < 0.5 ? optionA.trim() : optionB.trim();
    setResult(chosen);

    const entry: Decision = {
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      result: chosen,
      timestamp: new Date().toLocaleString(),
    };

    const updated = [entry, ...history];
    setHistory(updated);
    saveHistory(updated);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Decision Coin
        </h1>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Option A
            </label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => {
                setOptionA(e.target.value);
                if (e.target.value.trim()) setErrorA(false);
              }}
              placeholder="e.g. Pizza"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
                errorA
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-400"
              } bg-white text-zinc-900 placeholder-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500`}
            />
            {errorA && (
              <p className="mt-1 text-xs text-red-500">Please enter Option A</p>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Option B
            </label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => {
                setOptionB(e.target.value);
                if (e.target.value.trim()) setErrorB(false);
              }}
              placeholder="e.g. Sushi"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
                errorB
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-400"
              } bg-white text-zinc-900 placeholder-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500`}
            />
            {errorB && (
              <p className="mt-1 text-xs text-red-500">Please enter Option B</p>
            )}
          </div>

          <button
            onClick={handleDecide}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Decide
          </button>

          {result && (
            <div className="mt-6 rounded-xl bg-zinc-50 p-6 text-center dark:bg-zinc-800">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                The coin says...
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {result}
              </p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                History
              </h2>
              <button
                onClick={clearHistory}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Clear
              </button>
            </div>
            <ul className="space-y-2">
              {history.map((entry, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {entry.result}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {entry.optionA} vs {entry.optionB}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
