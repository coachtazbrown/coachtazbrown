"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REDTEAM_DEFAULT_CONFIG } from "@/lib/redteam-config";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal markdown: **bold** only — the agent uses it for technique names.
function render(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") ? (
      <strong key={i}>{chunk.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

// Strip markup that reads badly aloud through the browser voice path.
function forSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/→/g, ". ")
    .replace(/^[-•▸]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Web Speech API recognition isn't in lib.dom; declare the slice we use.
type RecognitionResult = { 0: { transcript: string }; isFinal: boolean };
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: { length: number; [i: number]: RecognitionResult } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export default function RedTeamChat() {
  const cfg = REDTEAM_DEFAULT_CONFIG;
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: cfg.greeting }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [toolLog, setToolLog] = useState<{ name: string; input: unknown }[]>([]);

  const [sttSupported, setSttSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(cfg.speech.enabledByDefault);
  const [speaking, setSpeaking] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speakOnRef = useRef(speakOn);
  speakOnRef.current = speakOn;
  const sendRef = useRef<(t: string) => void>(() => {});

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Restore the speaker preference.
  useEffect(() => {
    const saved = window.localStorage.getItem("nia_speak");
    if (saved !== null) setSpeakOn(saved === "1");
  }, []);
  useEffect(() => {
    window.localStorage.setItem("nia_speak", speakOn ? "1" : "0");
  }, [speakOn]);

  // Resolve the best available browser voice (the no-key fallback path).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
      for (const want of cfg.speech.preferredVoiceNames) {
        const hit = en.find((v) => v.name.toLowerCase().includes(want.toLowerCase()));
        if (hit) {
          voiceRef.current = hit;
          return;
        }
      }
      voiceRef.current =
        en.find((v) => /female|aria|jenny|samantha|joanna|ava|zira|nia/i.test(v.name)) ??
        en[0] ??
        voices[0];
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [cfg.speech.preferredVoiceNames]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const browserSpeak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(forSpeech(text));
      u.lang = cfg.speech.lang;
      u.rate = cfg.speech.rate;
      u.pitch = cfg.speech.pitch;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    },
    [cfg.speech.lang, cfg.speech.rate, cfg.speech.pitch]
  );

  // Speak a reply: try the cloud voice, fall back to the browser voice.
  const speak = useCallback(
    async (text: string) => {
      stopSpeaking();
      setSpeaking(true);
      try {
        const res = await fetch("/api/voice/speak", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text })
        });
        const type = res.headers.get("content-type") || "";
        if (res.ok && type.startsWith("audio")) {
          const url = URL.createObjectURL(await res.blob());
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            setSpeaking(false);
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => {
            setSpeaking(false);
            browserSpeak(text);
          };
          await audio.play();
          return;
        }
      } catch {
        /* fall through to the browser voice */
      }
      browserSpeak(text);
    },
    [stopSpeaking, browserSpeak]
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;
      stopSpeaking();
      const next = [...messages, { role: "user", content: trimmed } as Msg];
      setMessages(next);
      setInput("");
      setPending(true);
      try {
        const res = await fetch("/api/chat/redteam", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: next })
        });
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        if (Array.isArray(data.toolCalls) && data.toolCalls.length) {
          setToolLog((t) => [...t, ...data.toolCalls]);
        }
        if (speakOnRef.current && typeof data.reply === "string") speak(data.reply);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Lost connection for a second — try that again, Taz." }
        ]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, speak, stopSpeaking]
  );
  sendRef.current = send;

  // Wire up speech-to-text once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    setSttSupported(true);
    const rec = new Ctor();
    rec.lang = cfg.speech.lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      finalTranscriptRef.current = final;
      setInput(final || interim);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      const t = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";
      if (t) sendRef.current(t);
    };
    recognitionRef.current = rec;
    return () => {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.abort();
      } catch {
        /* noop */
      }
    };
  }, [cfg.speech.lang]);

  useEffect(() => stopSpeaking, [stopSpeaking]);

  function toggleMic() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      return;
    }
    stopSpeaking();
    finalTranscriptRef.current = "";
    setInput("");
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  return (
    <div className="flex h-[680px] w-full flex-col rounded-3xl border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-ink text-bone">N</div>
          <div>
            <div className="font-semibold">{cfg.persona.name}</div>
            <div className="text-xs text-slate2">
              {cfg.persona.displayName.replace(`${cfg.persona.name} — `, "")} · {cfg.practice}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="text-[11px] text-slate2 hover:text-ink"
              title="Stop speaking"
            >
              ◼ stop
            </button>
          )}
          <button
            onClick={() => {
              if (speakOn) stopSpeaking();
              setSpeakOn((v) => !v);
            }}
            aria-pressed={speakOn}
            title={speakOn ? "Nia's voice is on" : "Nia's voice is off"}
            className={`rounded-full border px-2 py-0.5 text-[11px] ${
              speakOn
                ? "border-ink bg-ink text-bone"
                : "border-ink/20 text-slate2 hover:border-ink hover:text-ink"
            }`}
          >
            {speakOn ? "🔊 voice on" : "🔇 voice off"}
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed ${
              m.role === "user" ? "ml-auto bg-ink text-bone" : "bg-bone text-ink/85"
            }`}
          >
            {m.role === "assistant" ? render(m.content) : m.content}
          </div>
        ))}
        {pending && (
          <div className="max-w-[88%] rounded-2xl bg-bone px-3 py-2 text-ink/60">
            <span className="inline-block animate-pulse">Thinking through the room…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-ink/10 px-3 py-2">
        {cfg.suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={pending}
            className="rounded-full border border-ink/15 bg-bone px-2.5 py-1 text-[11px] text-slate2 hover:border-ink hover:text-ink disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-ink/10 p-3"
      >
        {sttSupported && (
          <button
            type="button"
            onClick={toggleMic}
            title={listening ? "Listening — tap to stop & send" : "Talk to Nia"}
            aria-pressed={listening}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-base ${
              listening
                ? "animate-pulse border-accent bg-accent text-bone"
                : "border-ink/15 bg-bone text-ink hover:border-ink"
            }`}
          >
            {listening ? "●" : "🎙"}
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening…" : "The client, the decision, the room…"}
          className="flex-1 rounded-full border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-full bg-ink px-4 py-2 text-sm text-bone disabled:opacity-40"
        >
          Send
        </button>
      </form>

      {toolLog.length > 0 && (
        <div className="border-t border-ink/10 bg-bone px-4 py-2 text-[11px] text-slate2">
          <div className="mb-1 font-mono uppercase">technique calls</div>
          <div className="space-y-1 font-mono">
            {toolLog.slice(-4).map((t, i) => (
              <div key={i} className="truncate">
                ▸ {t.name}({JSON.stringify(t.input).slice(0, 70)}
                {JSON.stringify(t.input).length > 70 ? "…" : ""})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
