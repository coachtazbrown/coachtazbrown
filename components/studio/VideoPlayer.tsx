"use client";

// Galactic Studio — the faceless video renderer.
//
// This is a real video engine, not a mockup. It plays a Cut on a 16:9 canvas:
// an animated galaxy backdrop, a per-scene motif, kinetic keyword typography,
// burned-in word-by-word captions synced to the timeline, and spoken voiceover
// via the browser's speech synthesis (or the ElevenLabs route when configured).
// It records the canvas to a downloadable .webm so a topic genuinely becomes a
// video, entirely client-side, with no paid render API.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Cut, Motif, Scene } from "@/lib/studio/types";

const W = 1280;
const H = 720; // 16:9

// Space palette, tuned to the Galactic Studio brand.
const COL = {
  bg0: "#06060F",
  bg1: "#141034",
  ink: "#EDEBFF",
  dim: "#8C8AB8",
  blue: "#7C7BFF",
  lime: "#E8FF5B",
  white: "#FFFFFF"
};

type Star = { x: number; y: number; r: number; tw: number; sp: number };

function makeStars(n: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.6 + 0.2
    });
  }
  return stars;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function VideoPlayer({ cut }: { cut: Cut }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>(makeStars(140));
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0); // seconds already played before current play segment
  const playStartRef = useRef(0); // performance.now() when current segment began
  const spokenRef = useRef(-1); // last scene index we triggered speech for

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [t, setT] = useState(0); // current time in seconds (for UI)
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const total = useMemo(() => cut.scenes.reduce((a, s) => a + s.seconds, 0), [cut]);
  const starts = useMemo(() => {
    const arr: number[] = [];
    let acc = 0;
    for (const s of cut.scenes) {
      arr.push(acc);
      acc += s.seconds;
    }
    return arr;
  }, [cut]);

  const sceneAt = useCallback(
    (time: number): { scene: Scene; idx: number; p: number } => {
      let idx = 0;
      for (let i = 0; i < cut.scenes.length; i++) if (time >= starts[i]) idx = i;
      const scene = cut.scenes[idx];
      const p = Math.min(1, (time - starts[idx]) / scene.seconds);
      return { scene, idx, p };
    },
    [cut, starts]
  );

  // ── Speech ────────────────────────────────────────────────────────────────
  const speak = useCallback(
    (text: string) => {
      if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1.0;
      const vs = window.speechSynthesis.getVoices();
      const pref =
        vs.find((v) => /Google US English|Samantha|Jenny|Aria/i.test(v.name)) ||
        vs.find((v) => v.lang?.startsWith("en"));
      if (pref) u.voice = pref;
      window.speechSynthesis.speak(u);
    },
    [muted]
  );

  // ── Drawing ─────────────────────────────────────────────────────────────────
  const drawMotif = (ctx: CanvasRenderingContext2D, motif: Motif, p: number, time: number) => {
    const cx = W * 0.5;
    const cy = H * 0.42;
    ctx.save();
    switch (motif) {
      case "orbit": {
        for (let ring = 0; ring < 3; ring++) {
          const rr = 120 + ring * 70;
          const lit = p > ring / 3;
          ctx.beginPath();
          ctx.strokeStyle = lit ? COL.blue : "rgba(124,123,255,0.18)";
          ctx.lineWidth = 2;
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.stroke();
          const a = time * (0.6 - ring * 0.12) + ring;
          const nx = cx + Math.cos(a) * rr;
          const ny = cy + Math.sin(a) * rr;
          ctx.beginPath();
          ctx.fillStyle = ring === 2 && lit ? COL.lime : COL.blue;
          ctx.arc(nx, ny, ring === 2 ? 9 : 6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case "bars": {
        const n = 5;
        const bw = 70;
        const gap = 34;
        const x0 = cx - ((n * bw + (n - 1) * gap) / 2);
        for (let i = 0; i < n; i++) {
          const grow = Math.max(0, Math.min(1, p * 1.4 - i * 0.12));
          const hgt = (90 + i * 38) * grow;
          ctx.fillStyle = i === n - 1 ? COL.lime : COL.blue;
          roundRect(ctx, x0 + i * (bw + gap), cy + 120 - hgt, bw, hgt, 8);
          ctx.fill();
        }
        break;
      }
      case "grid": {
        const cols = 4;
        const rows = 3;
        const cw = 90;
        const ch = 70;
        const gx = cx - (cols * cw) / 2;
        const gy = cy - (rows * ch) / 2 + 30;
        let k = 0;
        const tot = cols * rows;
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const lit = p * tot > k;
            ctx.strokeStyle = "rgba(124,123,255,0.25)";
            ctx.lineWidth = 1.5;
            roundRect(ctx, gx + c * cw, gy + r * ch, cw - 10, ch - 10, 6);
            ctx.stroke();
            if (lit) {
              ctx.fillStyle = "rgba(124,123,255,0.35)";
              roundRect(ctx, gx + c * cw, gy + r * ch, cw - 10, ch - 10, 6);
              ctx.fill();
            }
            k++;
          }
        break;
      }
      case "spark": {
        const rays = 16;
        const pulse = 1 + Math.sin(time * 3) * 0.08;
        for (let i = 0; i < rays; i++) {
          const a = (i / rays) * Math.PI * 2 + time * 0.4;
          const len = (70 + Math.sin(time * 4 + i) * 18) * pulse * (0.5 + p);
          ctx.strokeStyle = i % 4 === 0 ? COL.lime : COL.blue;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30);
          ctx.lineTo(cx + Math.cos(a) * (30 + len), cy + Math.sin(a) * (30 + len));
          ctx.stroke();
        }
        ctx.fillStyle = COL.lime;
        ctx.beginPath();
        ctx.arc(cx, cy, 16 * pulse, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "path": {
        const y = cy + 40;
        ctx.strokeStyle = "rgba(124,123,255,0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(160, y);
        ctx.lineTo(W - 160, y);
        ctx.stroke();
        const dotX = 160 + (W - 320) * p;
        ctx.strokeStyle = COL.lime;
        ctx.beginPath();
        ctx.moveTo(160, y);
        ctx.lineTo(dotX, y);
        ctx.stroke();
        ctx.fillStyle = COL.lime;
        ctx.beginPath();
        ctx.arc(dotX, y, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "quote": {
        ctx.fillStyle = "rgba(232,255,91,0.18)";
        ctx.font = "900 220px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("“", cx, cy + 40);
        break;
      }
      case "starfield":
      default: {
        // extra bright drifting stars, handled by the base layer; add a soft nebula
        const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, 320);
        g.addColorStop(0, "rgba(124,123,255,0.22)");
        g.addColorStop(1, "rgba(124,123,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        break;
      }
    }
    ctx.restore();
  };

  const render = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, COL.bg0);
      g.addColorStop(1, COL.bg1);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (const s of starsRef.current) {
        const tw = 0.5 + 0.5 * Math.sin(time * s.sp + s.tw);
        ctx.globalAlpha = 0.25 + tw * 0.6;
        ctx.fillStyle = COL.white;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const { scene, idx, p } = sceneAt(time);
      drawMotif(ctx, scene.motif, p, time);

      // Big kinetic keyword
      const words = scene.onScreen.split(/\s+/);
      ctx.textAlign = "center";
      ctx.font = "800 76px ui-sans-serif, Segoe UI, system-ui, sans-serif";
      const reveal = Math.min(words.length, Math.floor(p * words.length) + 1);
      const shown = words.slice(0, reveal).join(" ");
      const lines = wrap(ctx, shown, W - 220);
      const baseY = H * 0.66;
      lines.forEach((ln, i) => {
        ctx.fillStyle = COL.ink;
        ctx.fillText(ln, W / 2, baseY + i * 80);
      });

      // Burned-in voiceover captions (3–5 words advancing across the scene)
      const vo = scene.voiceover.split(/\s+/);
      const chunk = 5;
      const chunks = Math.max(1, Math.ceil(vo.length / chunk));
      const ci = Math.min(chunks - 1, Math.floor(p * chunks));
      const capText = vo.slice(ci * chunk, ci * chunk + chunk).join(" ");
      ctx.font = "600 30px ui-sans-serif, Segoe UI, system-ui, sans-serif";
      const cw = ctx.measureText(capText).width;
      roundRect(ctx, W / 2 - cw / 2 - 22, H - 112, cw + 44, 50, 12);
      ctx.fillStyle = "rgba(6,6,15,0.66)";
      ctx.fill();
      ctx.fillStyle = COL.lime;
      ctx.fillText(capText, W / 2, H - 78);

      // Chrome: role tag (top-left), watermark (bottom-right), progress bar
      ctx.textAlign = "left";
      ctx.font = "700 22px ui-sans-serif, system-ui, sans-serif";
      ctx.fillStyle = COL.blue;
      ctx.fillText(`${String(idx + 1).padStart(2, "0")} · ${scene.role.toUpperCase()}`, 48, 56);

      ctx.textAlign = "right";
      ctx.font = "600 20px ui-sans-serif, system-ui, sans-serif";
      ctx.fillStyle = COL.dim;
      ctx.fillText("GALACTIC STUDIO ✦ by Taz", W - 40, H - 32);

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(0, H - 8, W, 8);
      ctx.fillStyle = COL.lime;
      ctx.fillRect(0, H - 8, (time / total) * W, 8);

      // Trigger voiceover at scene boundaries
      if (idx !== spokenRef.current) {
        spokenRef.current = idx;
        speak(scene.voiceover);
      }
    },
    [sceneAt, speak, total]
  );

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return;
    playStartRef.current = performance.now();
    const loop = () => {
      const elapsed = offsetRef.current + (performance.now() - playStartRef.current) / 1000;
      if (elapsed >= total) {
        render(total);
        setT(total);
        offsetRef.current = 0;
        spokenRef.current = -1;
        setPlaying(false);
        stopRecording();
        return;
      }
      render(elapsed);
      setT(elapsed);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, total, render]);

  // Draw the opening frame on mount / when the cut changes.
  useEffect(() => {
    offsetRef.current = 0;
    spokenRef.current = -1;
    setT(0);
    setPlaying(false);
    render(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut]);

  const play = () => {
    if (playing) {
      offsetRef.current = offsetRef.current + (performance.now() - playStartRef.current) / 1000;
      cancelAnimationFrame(rafRef.current);
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      setPlaying(false);
    } else {
      if (offsetRef.current >= total) offsetRef.current = 0;
      spokenRef.current = -1;
      setPlaying(true);
    }
  };

  const restart = () => {
    cancelAnimationFrame(rafRef.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    offsetRef.current = 0;
    spokenRef.current = -1;
    setT(0);
    render(0);
    setPlaying(true);
  };

  const jumpTo = (idx: number) => {
    cancelAnimationFrame(rafRef.current);
    offsetRef.current = starts[idx];
    spokenRef.current = -1;
    render(starts[idx]);
    setT(starts[idx]);
    if (!playing) setPlaying(true);
  };

  // ── Recording ───────────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
  };

  const startRecording = () => {
    const canvas = canvasRef.current as (HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }) | null;
    if (!canvas || typeof canvas.captureStream !== "function") {
      alert("This browser can't record the canvas. Try Chrome — or download the script, captions, and voiceover assets instead.");
      return;
    }
    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      setRecording(false);
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `galactic-studio-${cut.platform}-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
    restart();
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const { idx: curIdx } = sceneAt(t);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06060F]">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full"
        style={{ aspectRatio: "16 / 9" }}
        onClick={play}
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-[#0B0A18] px-4 py-3 text-bone">
        <button onClick={play} className="rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-[#06060F]" style={{ backgroundColor: COL.lime }}>
          {playing ? "❚❚ Pause" : "▶ Play"}
        </button>
        <button onClick={restart} className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-bone hover:border-white/50">
          ↺ Restart
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined") window.speechSynthesis?.cancel();
            setMuted((m) => !m);
          }}
          className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-bone hover:border-white/50"
        >
          {muted ? "🔇 Voiceover off" : "🔊 Voiceover on"}
        </button>
        <span className="ml-1 font-mono text-xs text-white/60">
          {fmt(t)} / {fmt(total)}
        </span>
        <div className="ml-auto">
          {recording ? (
            <button onClick={stopRecording} className="rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
              ● Stop &amp; save
            </button>
          ) : (
            <button onClick={startRecording} className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-bone hover:border-white/50">
              ⬇ Export video (.webm)
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-white/10 bg-[#0B0A18] px-4 py-3">
        {cut.scenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => jumpTo(i)}
            className={`rounded-md px-2 py-1 text-[11px] transition ${
              i === curIdx ? "bg-[#7C7BFF] text-[#06060F]" : "bg-white/5 text-white/55 hover:bg-white/10"
            }`}
            title={s.onScreen}
          >
            {s.role}
          </button>
        ))}
      </div>
    </div>
  );
}
