"use client";

import { useState, useRef } from "react";
import {
  ShieldCheck,
  Search,
  Droplets,
  Activity,
  Share2,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react";
import { SiSolana } from "react-icons/si";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { riskConfig, ScanResult } from "../lib/types";
import { Alert, AlertDescription } from "../components/ui/alert";
import { LoadingSkeleton } from "../components/loading-skeleton";
import { RiskCard } from "../components/risk-card";
import { StatCard } from "../components/stat-card";
import { fmt, fmtAge } from "../lib/utils";

const demoTokens = [
  { label: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6D4t7YaB1pPB263" },
  { label: "WIF", address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ" },
  { label: "⚠ PEPE", address: "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ" },
];

const floatingCoins = Array.from({ length: 12 }, () => ({   
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 120 - 20}%`,
  size: `${0.9 + Math.random() * 1.1}rem`,    
  opacity: 0.04 + Math.random() * 0.06,        
  delay: `-${Math.random() * 45}s`,
}));

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  async function scan(tokenAddress?: string) {
    const target = tokenAddress || address;
    if (!target) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/scan?address=${target}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function shareResult() {
    if (!result) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      if (!resultRef.current) return;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#080808",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `rugsense-${result.overview?.symbol || "scan"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch {
      alert("Screenshot failed — save manually.");
    }
  }

  const cfg = result ? riskConfig[result.risk.label] : null;

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-6 relative overflow-hidden bg-[#080808] text-[#E8E8E2]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingCoins.map((coin, i) => (
          <div
            key={i}
            className="absolute text-[#00FF85] animate-float"
            style={{
              left: coin.left,
              top: coin.top,
              fontSize: coin.size,
              opacity: coin.opacity,
              animationDelay: coin.delay,
            }}
          >
            <SiSolana size={22} />
          </div>
        ))}
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,255,133,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[860px] flex flex-col gap-9">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00FF85]/30 bg-[#00FF85]/5 text-[#00FF85]">
            <div className="absolute -inset-[6px] rounded-3xl border border-[#00FF85]/10" />
            <ShieldCheck size={26} />
          </div>

          <div className="space-y-3">
            <h1 className="text-[clamp(48px,8vw,72px)] font-extrabold tracking-tighter leading-none text-[#FAFAF5]">
              Rug<span className="text-[#00FF85]">Sense</span>
            </h1>

            <p className="text-[15px] text-[#666660]">
              Solana meme coin rug-risk scanner · powered by Birdeye
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF85]/20 bg-[#00FF85]/5 px-3 py-1.5 text-[11px] font-mono tracking-widest text-[#00FF85]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF85]" />
            LIVE · REAL DATA
          </div>
        </header>

        <div className="border border-white/5 rounded-2xl bg-white/[0.02] p-1.5 backdrop-blur-md">
          <div className="flex gap-1.5">
            <Input
              className="flex-1 h-14 bg-white/[0.03] border-white/10 rounded-xl px-5 text-[13px] text-[#E8E8E2] font-mono focus-visible:ring-[#00FF85]/35 focus-visible:border-[#00FF85]/35 placeholder:text-[#44443E]"
              placeholder="Paste Solana token address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scan()}
            />
            <Button
              className="h-14 px-7 bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#080808] border-0 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              onClick={() => scan()}
              disabled={loading || !address}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Scanning..." : "Scan"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 pb-1 px-2 items-center">
            <span className="text-[11px] text-[#44443E] font-mono tracking-widest pr-1">
              TRY →
            </span>
            {demoTokens.map((t) => (
              <button
                key={t.label}
                className="px-4 py-1.5 rounded-full border border-white/10 bg-transparent text-[#888882] text-xs font-mono cursor-pointer transition-all hover:border-white/20 hover:text-[#E8E8E2] hover:bg-white/5"
                onClick={() => {
                  setAddress(t.address);
                  scan(t.address);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="border-red-500/25 bg-red-500/5 text-red-400 font-mono text-[13px] p-4 rounded-xl"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {loading && <LoadingSkeleton />}

        {result && cfg && !loading && (
          <div
            ref={resultRef}
            className="animate-in fade-in slide-in-from-bottom-4 duration-400 p-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RiskCard result={result} />

              <StatCard
                icon={<Droplets size={17} />}
                iconColor="#4A9EFF"
                label="LIQUIDITY"
                value={fmt(result.overview?.liquidity || 0)}
                subLabel="Total pool liquidity"
              />
              <StatCard
                icon={<Activity size={17} />}
                iconColor="#00FF85"
                label="24H VOLUME"
                value={fmt(result.overview?.v24hUSD || 0)}
                subLabel="USD trading volume"
              />
              <StatCard
                icon={<Users size={17} />}
                iconColor="#FFB800"
                label="TOP 10 HOLDERS"
                value={
                  result.meta
                    ? `${result.meta.top10Ownership.toFixed(1)}%`
                    : "N/A"
                }
                subLabel="of total supply"
              />
              <StatCard
                icon={<Clock size={17} />}
                iconColor="#AA88FF"
                label="TOKEN AGE"
                value={result.meta ? fmtAge(result.meta.ageMinutes) : "N/A"}
                subLabel="Since first trade / pair creation"
              />
            </div>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 w-full mt-4 h-11 rounded-xl border-white/10 bg-transparent text-[#888882] text-xs font-mono hover:border-white/20 hover:text-[#E8E8E2] hover:bg-white/[0.02]"
              onClick={shareResult}
            >
              <Share2 size={12} />
              Export scan card as PNG
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
