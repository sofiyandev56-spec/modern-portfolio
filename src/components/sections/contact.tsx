"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";

export function Contact() {
  const emailAddress = "sofiyandev56@gmail.com";
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Hand the message off to the visitor's own mail client so it actually reaches me.
    const subject = `Portfolio enquiry from ${formData.name}`;
    const body = `${formData.message}\n\n—\n${formData.name}\n${formData.email}`;
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col justify-center py-32 md:py-40 lg:py-48 bg-[#09090b] border-t border-white/5 overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-purple-900/15 via-fuchsia-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 w-full my-auto z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-wide text-zinc-400 mb-4">
            <span>Get In Touch</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-6">
            LET&apos;S BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              TOGETHER.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto">
            Open to internships, junior developer roles, and student projects — or just a conversation about AI and building things. The form below opens your mail app with the message ready to send.
          </p>
        </div>

        {/* Minimalist 3-Field Contact Form Card */}
        <div className="max-w-3xl mx-auto glass-card p-8 sm:p-12 md:p-14 shadow-2xl relative overflow-hidden">
          
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check size={28} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Your Email App Is Open</h3>
              <p className="text-sm text-zinc-400 max-w-md">
                Thanks {formData.name || "there"} — I have drafted the message in your mail app. Hit send there and it will land in my inbox. If nothing opened, you can email me directly at {emailAddress}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 md:p-5 rounded-xl bg-zinc-900/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 md:p-5 rounded-xl bg-zinc-900/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Your Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about the role, the project, or whatever you'd like to talk about..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 md:p-5 rounded-xl bg-zinc-900/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none min-h-[160px]"
                />
              </div>

              {/* Submit Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                <button
                  type="submit"
                  className="pill-btn pill-btn-primary w-full sm:w-auto justify-center group py-3 px-8"
                >
                  <span>Compose Email</span>
                  <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Direct Email Quick Pill */}
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="pill-btn pill-btn-secondary text-xs py-2.5 px-4"
                  >
                    <Mail size={13} />
                    <span>{emailAddress}</span>
                    <ArrowUpRight size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={copyEmail}
                    className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    title="Copy Email"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
