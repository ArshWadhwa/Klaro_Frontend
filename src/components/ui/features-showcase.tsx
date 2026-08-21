'use client'

import { Activity, FolderKanban, Shield, Zap, Radio, Sparkles, Cpu, Lock } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { HandWrittenTitle } from '@/components/ui/hand-writing-text'

export function FeaturesShowcase() {
    return (
        <section className="bg-[#0d0d0f] px-4 py-16 md:py-24 border-t border-[#1f1f23]">
            <div className="mx-auto max-w-5xl">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-4">
                        <Zap className="size-3.5" />
                        Next-Gen Real-Time Architecture
                    </div>
                    <div className="-mb-6">
                        <HandWrittenTitle
                            title="Discuss Faster, Decide Better"
                            subtitle="Full-duplex WebSockets, contextual AI streaming, and enterprise issue tracking — with zero polling overhead."
                        />
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid border border-[#1f1f23] rounded-2xl overflow-hidden md:grid-cols-2 bg-[#0a0a0c]/60 backdrop-blur-sm">
                    {/* Card 1: Project & Issue Tracking with Map */}
                    <div className="relative group">
                        <div className="p-6 sm:p-12">
                            <span className="text-gray-400 flex items-center gap-2 text-sm font-medium">
                                <FolderKanban className="size-4 text-cyan-400" />
                                Project & Issue Tracking
                            </span>

                            <p className="mt-6 text-2xl font-semibold text-white leading-snug">
                                Interactive Kanban boards & sprint management.{" "}
                                <span className="text-gray-500">Organize distributed engineering workflows effortlessly.</span>
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="px-2.5 py-1 bg-[#131316] border border-[#1f1f23] rounded-md text-xs text-gray-300">
                                    📋 Drag & Drop Kanban
                                </span>
                                <span className="px-2.5 py-1 bg-[#131316] border border-[#1f1f23] rounded-md text-xs text-gray-300">
                                    ⚡ Optimistic UI Updates
                                </span>
                                <span className="px-2.5 py-1 bg-[#131316] border border-[#1f1f23] rounded-md text-xs text-gray-300">
                                    👥 Multi-Tenant Groups
                                </span>
                            </div>
                        </div>

                        <div aria-hidden className="relative mt-2">
                            <div className="rounded-xl bg-[#0d0d0f] absolute inset-2 -bottom-2 mx-auto border border-[#1f1f23] px-3 py-4 text-xs font-medium shadow-md shadow-black/20"></div>

                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 z-[1] bg-gradient-radial from-transparent to-[#0d0d0f] to-75%"></div>
                                <Map />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Enterprise Security */}
                    <div className="overflow-hidden border-t border-[#1f1f23] bg-[#0d0d0f]/80 p-6 sm:p-12 md:border-0 md:border-l flex flex-col justify-between">
                        <div className="relative z-10">
                            <span className="text-gray-400 flex items-center gap-2 text-sm font-medium">
                                <Shield className="size-4 text-emerald-400" />
                                Enterprise-Grade Security
                            </span>

                            <p className="my-6 text-2xl font-semibold text-white leading-snug">
                                JWT stateless validation, silent refresh, & RBAC.{" "}
                                <span className="text-gray-500">Resource-scoped permissions across all groups.</span>
                            </p>
                        </div>

                        {/* Security Chat / Audit Visual */}
                        <div aria-hidden className="flex flex-col gap-4 mt-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex justify-center items-center size-5 rounded-full border border-[#1f1f23]">
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">Security Audit & Interceptors</span>
                                </div>
                                <div className="rounded-xl bg-[#131316] mt-1.5 w-4/5 border border-[#1f1f23] p-3 text-xs text-gray-300">
                                    🛡️ Axios JWT Interceptors active: Auto silent refresh with 0 session interruptions.
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex justify-center items-center size-5 rounded-full border border-[#1f1f23]">
                                        <span className="size-2 rounded-full bg-blue-500" />
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">Access Control Hierarchy</span>
                                </div>
                                <div className="rounded-xl bg-[#131316] mt-1.5 w-full border border-[#1f1f23] p-3 text-xs text-gray-300">
                                    🔐 Granular resource ownership: Group Owners, Admins, & Members scoped per workspace.
                                </div>
                            </div>

                            <div>
                                <div className="rounded-xl mb-1 ml-auto w-4/5 bg-emerald-950/40 border border-emerald-800/50 p-3 text-xs text-emerald-300">
                                    ✅ Cryptographically secure invite codes & end-to-end tenant isolation.
                                </div>
                                <span className="text-gray-500 block text-right text-xs font-mono">Verified Live</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Real-Time WebSocket & AI Token Streaming */}
                    <div className="relative col-span-full border-t border-[#1f1f23] bg-gradient-to-b from-[#0e0e12] to-[#0a0a0c]">
                        <div className="relative z-10 max-w-2xl px-6 pr-12 pt-8 md:px-12 md:pt-10">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 flex items-center gap-2 text-sm font-medium">
                                    <Radio className="size-4 text-emerald-400 animate-pulse" />
                                    Real-Time WebSocket Engine
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    Native STOMP (wss://)
                                </span>
                            </div>

                            <p className="my-6 text-2xl md:text-3xl font-semibold text-white leading-snug">
                                Full-duplex STOMP WebSockets with live AI token streaming.{" "}
                                <span className="text-gray-500">
                                    Zero polling overhead, sub-millisecond message dispatch, and live character-by-character RAG insights.
                                </span>
                            </p>

                            <div className="flex flex-wrap gap-2.5 mb-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131316] border border-[#1f1f23] text-xs text-gray-300">
                                    <Sparkles className="size-3.5 text-blue-400" />
                                    <span>Token-by-Token Streaming</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131316] border border-[#1f1f23] text-xs text-gray-300">
                                    <Cpu className="size-3.5 text-purple-400" />
                                    <span>Sub-10ms Frame Latency</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131316] border border-[#1f1f23] text-xs text-gray-300">
                                    <Radio className="size-3.5 text-emerald-400" />
                                    <span>Room Topic Broadcasts</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131316] border border-[#1f1f23] text-xs text-gray-300">
                                    <Lock className="size-3.5 text-amber-400" />
                                    <span>JWT STOMP Handshake</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="relative mt-2">
                            <MonitoringChart />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const map = new DottedMap({ height: 55, grid: 'diagonal' })

const points = map.getPoints()

const svgOptions = {
    backgroundColor: '#0d0d0f',
    color: '#1f1f23',
    radius: 0.15,
}

const Map = () => {
    const viewBox = `0 0 120 60`
    return (
        <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
            {points.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r={svgOptions.radius} fill={svgOptions.color} />
            ))}
        </svg>
    )
}

const chartConfig = {
    messages: {
        label: 'WebSocket Messages (req/s)',
        color: '#3b82f6',
    },
    tokens: {
        label: 'AI Streamed Tokens (tok/s)',
        color: '#10b981',
    },
} satisfies ChartConfig

const chartData = [
    { time: '00:00', messages: 120, tokens: 480 },
    { time: '04:00', messages: 240, tokens: 960 },
    { time: '08:00', messages: 680, tokens: 2840 },
    { time: '12:00', messages: 1450, tokens: 5900 },
    { time: '16:00', messages: 1890, tokens: 7400 },
    { time: '20:00', messages: 1100, tokens: 4200 },
]

const MonitoringChart = () => {
    return (
        <ChartContainer className="h-72 w-full aspect-auto md:h-80" config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                    top: 10,
                    bottom: 0,
                }}>
                <defs>
                    <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="85%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                        <stop offset="85%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1f1f23" strokeDasharray="3 3" />
                <ChartTooltip active cursor={false} content={<ChartTooltipContent />} />
                <Area strokeWidth={2} dataKey="messages" type="monotone" fill="url(#fillMessages)" stroke="#3b82f6" />
                <Area strokeWidth={2} dataKey="tokens" type="monotone" fill="url(#fillTokens)" stroke="#10b981" />
            </AreaChart>
        </ChartContainer>
    )
}
