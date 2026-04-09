"use client"

import { Brain, MessageSquare, Sparkles, FileText, Users } from "lucide-react"

const features = [
  {
    title: "RAG-Powered Context",
    description:
      "Upload documents and get AI answers grounded in your actual content. Our Retrieval-Augmented Generation engine ensures accurate, context-aware responses — no hallucinations.",
    icon: Brain,
    className: "md:col-span-1 md:row-span-2",
    accent: "from-blue-500 to-cyan-400",
    visual: (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <div className="h-2 flex-1 rounded-full bg-[#1f1f23]">
            <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500/40 to-cyan-400/40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-300" />
          <div className="h-2 flex-1 rounded-full bg-[#1f1f23]">
            <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-cyan-400/40 to-blue-500/40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-300 animate-pulse delay-500" />
          <div className="h-2 flex-1 rounded-full bg-[#1f1f23]">
            <div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-blue-400/40 to-cyan-300/40" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Collaborative Document Chat",
    description:
      "Chat with your team directly on uploaded documents. Everyone sees the conversation in real-time — like WhatsApp, but for your project files.",
    icon: MessageSquare,
    className: "md:col-span-1",
    accent: "from-green-400 to-emerald-500",
    visual: (
      <div className="mt-4 space-y-2">
        <div className="flex justify-start">
          <div className="bg-[#1f1f23] rounded-xl rounded-tl-sm px-3 py-1.5 text-xs text-gray-400 max-w-[70%]">
            Check page 12 of the report 📄
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-600/30 rounded-xl rounded-tr-sm px-3 py-1.5 text-xs text-blue-200 max-w-[70%]">
            Got it, running analysis now
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-purple-500/20 rounded-xl rounded-tl-sm px-3 py-1.5 text-xs text-purple-300 max-w-[70%] flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI: Revenue grew 23% YoY...
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '"AI " Mode — Instant Intelligence',
    description:
      'Type "AI " (AI + space) in any document chat to activate AI mode. Get instant answers from your documents without leaving the conversation.',
    icon: Sparkles,
    className: "md:col-span-1",
    accent: "from-purple-400 to-violet-500",
    visual: (
      <div className="mt-4">
        <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-md bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-purple-400" />
            </div>
            <span className="text-xs font-mono text-purple-400">AI Mode Active</span>
          </div>
          <div className="bg-[#131316] rounded-lg px-3 py-2 border border-purple-500/20">
            <span className="text-xs text-gray-500">Message: </span>
            <span className="text-xs text-purple-300 font-mono">AI </span>
            <span className="text-xs text-white">What are the key findings?</span>
            <span className="inline-block w-0.5 h-3.5 bg-purple-400 animate-pulse ml-0.5 align-middle" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Smart Document Analysis",
    description:
      "Upload PDFs and documents to get AI-powered insights, summaries, and deep analysis. Ask questions and get answers grounded in your actual content.",
    icon: FileText,
    className: "md:col-span-1",
    accent: "from-amber-400 to-orange-500",
    visual: (
      <div className="mt-4 flex flex-wrap gap-2">
        {["PDF Analysis", "Key Insights", "Quick Summary", "Q&A"].map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-[#1f1f23] border border-[#2a2a2f] rounded-lg text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Group Invite System",
    description:
      "Create groups and share invite codes — like Discord. No need to search through all users. Share a code and your team joins instantly.",
    icon: Users,
    className: "md:col-span-1",
    accent: "from-pink-400 to-rose-500",
    visual: (
      <div className="mt-4">
        <div className="bg-[#0d0d0f] border border-dashed border-[#2a2a2f] rounded-xl px-4 py-3 text-center">
          <span className="text-lg font-mono font-bold text-white tracking-[0.25em]">
            KLR-X7F2
          </span>
        </div>
        <p className="text-[10px] text-gray-500 text-center mt-2">Share code → Team joins → Done 🚀</p>
      </div>
    ),
  },

]

export function FeaturesBento() {
  return (
    <section className="bg-[#0d0d0f] py-24 md:py-32 border-t border-[#1f1f23]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-blue-400 tracking-wider uppercase mb-4">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ship faster
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            AI-powered document analysis, real-time collaboration, and project
            management — built for teams that move fast.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative bg-[#131316] border border-[#1f1f23] rounded-2xl p-6 hover:border-[#2a2a2f] transition-all duration-300 overflow-hidden ${feature.className}`}
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.accent} blur-3xl pointer-events-none`}
                style={{ opacity: 0 }}
              />
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500 rounded-full bg-gradient-to-br ${feature.accent} blur-2xl pointer-events-none`}
              />

              {/* Icon */}
              <div
                className={`relative z-10 h-10 w-10 rounded-xl bg-gradient-to-br ${feature.accent} bg-opacity-10 flex items-center justify-center mb-4`}
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, currentColor 10%, transparent), transparent)`,
                }}
              >
                <div className={`h-10 w-10 rounded-xl bg-[#1f1f23] flex items-center justify-center`}>
                  <feature.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Visual */}
                {feature.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
