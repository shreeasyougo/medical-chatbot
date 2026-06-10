"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  text: string;
};

const SUGGESTIONS = [
  "What are symptoms of diabetes?",
  "How to lower blood pressure naturally?",
  "What causes frequent headaches?",
  "When should I see a doctor for fever?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await fetch("https://medical-chatbot-nlka.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "**Error:** Could not reach the server. Make sure the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f0f4f8" }}>

      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: 38, height: 38, background: "#ebf8ff", border: "1px solid #bee3f8",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
        }}>🩺</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem", color: "#1a365d" }}>Medical Assistant</div>
          <div style={{ fontSize: "0.7rem", color: "#718096" }}>Powered by Gemini AI</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#48bb78" }} />
          <span style={{ fontSize: "0.7rem", color: "#718096" }}>online</span>
        </div>
      </header>

      {/* Chat */}
      <main style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
        {isEmpty ? (
          <div style={{ maxWidth: 580, margin: "2rem auto", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🩺</div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1a365d", marginBottom: "0.4rem" }}>
              How can I help you today?
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#718096", marginBottom: "1.75rem" }}>
              Ask any medical question. Always consult a real doctor for serious issues.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} style={{
                  background: "#fff", border: "1px solid #bee3f8",
                  borderRadius: 20, padding: "0.45rem 1rem",
                  fontSize: "0.78rem", color: "#2b6cb0",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#ebf8ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "1rem",
              }}>
                {msg.role === "bot" && (
                  <div style={{
                    width: 30, height: 30, background: "#ebf8ff", border: "1px solid #bee3f8",
                    borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.9rem", marginRight: "0.6rem", flexShrink: 0,
                  }}>🩺</div>
                )}
                <div style={{
                  maxWidth: "78%",
                  background: msg.role === "user" ? "#3182ce" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#1a202c",
                  borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.85rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  border: msg.role === "bot" ? "1px solid #e2e8f0" : "none",
                }}>
                  {msg.role === "bot"
                    ? <div className="answer"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                    : <p style={{ lineHeight: 1.6 }}>{msg.text}</p>
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <div style={{
                  width: 30, height: 30, background: "#ebf8ff", border: "1px solid #bee3f8",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
                }}>🩺</div>
                <div style={{
                  background: "#fff", border: "1px solid #e2e8f0",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "0.75rem 1rem",
                  display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#3182ce",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <div style={{
        background: "#fff", borderTop: "1px solid #e2e8f0",
        padding: "0.9rem 1.25rem",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          display: "flex", gap: "0.6rem", alignItems: "center",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Ask a medical question..."
            disabled={loading}
            style={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              outline: "none",
              background: "#f7fafc",
              color: "#1a202c",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "#63b3ed")}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42,
              background: loading || !input.trim() ? "#e2e8f0" : "#3182ce",
              color: loading || !input.trim() ? "#a0aec0" : "#fff",
              border: "none", borderRadius: 12,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.65rem", color: "#a0aec0", marginTop: "0.5rem" }}>
          ⚠️ For informational purposes only. Always consult a licensed doctor.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}