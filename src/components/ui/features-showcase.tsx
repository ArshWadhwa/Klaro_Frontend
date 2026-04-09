'use client'

import { Activity, FolderKanban, Shield } from 'lucide-react'
import DottedMap from 'dotted-map'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { HandWrittenTitle } from '@/components/ui/hand-writing-text'

export function FeaturesShowcase() {
    return (
        <section className="bg-[#0d0d0f] px-4 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-sm font-medium text-blue-400 tracking-wider uppercase mb-4">
                        Built for Scale
                    </p>
                    <div className="-mb-8">
                        <HandWrittenTitle
                            title="Discuss Faster, Decide Better"
                            subtitle=""
                        />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Powerful infrastructure,{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            effortless experience
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Track projects, stay secure, and monitor everything — all in real time.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid border border-[#1f1f23] rounded-2xl overflow-hidden md:grid-cols-2">
                    {/* Card 1: Project & Issue Tracking with Map */}
                    <div>
                        <div className="p-6 sm:p-12">
                            <span className="text-gray-400 flex items-center gap-2 text-sm">
                                <FolderKanban className="size-4 text-cyan-400" />
                                Project & Issue Tracking
                            </span>

                            <p className="mt-8 text-2xl font-semibold text-white">
                                Kanban boards, issue tracking, and sprint management.{" "}
                                <span className="text-gray-500">Organize work across distributed teams.</span>
                            </p>
                        </div>

                        <div aria-hidden className="relative">
                            <div className="absolute inset-0 z-10 m-auto size-fit">
                                <div className="rounded-xl bg-[#131316] z-[1] relative flex size-fit w-fit items-center gap-2 border border-[#1f1f23] px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-black/20">
                                    <span className="text-lg">📋</span> 14 issues resolved this sprint
                                </div>
                                <div className="rounded-xl bg-[#0d0d0f] absolute inset-2 -bottom-2 mx-auto border border-[#1f1f23] px-3 py-4 text-xs font-medium shadow-md shadow-black/20"></div>
                            </div>

                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 z-[1] bg-gradient-radial from-transparent to-[#0d0d0f] to-75%"></div>
                                <Map />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Enterprise Security */}
                    <div className="overflow-hidden border-t border-[#1f1f23] bg-[#0a0a0c] p-6 sm:p-12 md:border-0 md:border-l">
                        <div className="relative z-10">
                            <span className="text-gray-400 flex items-center gap-2 text-sm">
                                <Shield className="size-4 text-emerald-400" />
                                Enterprise-Grade Security
                            </span>

                            <p className="my-8 text-2xl font-semibold text-white">
                                JWT auth, role-based access, and encrypted data.{" "}
                                <span className="text-gray-500">Your projects are always protected.</span>
                            </p>
                        </div>

                        {/* Security Chat Visual */}
                        <div aria-hidden className="flex flex-col gap-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex justify-center items-center size-5 rounded-full border border-[#1f1f23]">
                                        <span className="size-3 rounded-full bg-emerald-500" />
                                    </span>
                                    <span className="text-gray-500 text-xs">Security Audit</span>
                                </div>
                                <div className="rounded-xl bg-[#131316] mt-1.5 w-3/5 border border-[#1f1f23] p-3 text-xs text-gray-300">
                                    All endpoints verified. No vulnerabilities found.
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex justify-center items-center size-5 rounded-full border border-[#1f1f23]">
                                        <span className="size-3 rounded-full bg-blue-500" />
                                    </span>
                                    <span className="text-gray-500 text-xs">Access Control</span>
                                </div>
                                <div className="rounded-xl bg-[#131316] mt-1.5 w-4/5 border border-[#1f1f23] p-3 text-xs text-gray-300">
                                    RBAC enforced: Admin, Member, Viewer roles active across 12 groups.
                                </div>
                            </div>

                            <div>
                                <div className="rounded-xl mb-1 ml-auto w-3/5 bg-emerald-600 p-3 text-xs text-white">
                                    ✅ JWT tokens rotating. Refresh cycle: 24h. Zero expired sessions.
                                </div>
                                <span className="text-gray-500 block text-right text-xs">Just now</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Uptime Banner
                    <div className="col-span-full border-y border-[#1f1f23] p-12 bg-[#0d0d0f]">
                        <p className="text-center text-4xl font-semibold lg:text-7xl text-white">
                            99.99% <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Uptime</span>
                        </p>
                    </div> */}

                    {/* Card 4: Activity Monitoring Chart */}
                    <div className="relative col-span-full">
                        <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                            <span className="text-gray-400 flex items-center gap-2 text-sm">
                                <Activity className="size-4 text-blue-400" />
                                Performance Monitoring
                            </span>

                            <p className="my-8 text-2xl font-semibold text-white">
                                Lightning-fast polling with real-time sync.{" "}
                                <span className="text-gray-500">Monitor activity and resolve issues instantly.</span>
                            </p>
                        </div>
                        <MonitoringChart />
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
    issues: {
        label: 'Issues Resolved',
        color: '#2563eb',
    },
    commits: {
        label: 'Commits',
        color: '#60a5fa',
    },
} satisfies ChartConfig

const chartData = [
    { month: 'May', issues: 56, commits: 224 },
    { month: 'June', issues: 56, commits: 224 },
    { month: 'January', issues: 126, commits: 252 },
    { month: 'February', issues: 205, commits: 410 },
    { month: 'March', issues: 200, commits: 126 },
    { month: 'April', issues: 400, commits: 800 },
]

const MonitoringChart = () => {
    return (
        <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                }}>
                <defs>
                    <linearGradient id="fillIssues" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-issues)" stopOpacity={0.8} />
                        <stop offset="55%" stopColor="var(--color-issues)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-commits)" stopOpacity={0.8} />
                        <stop offset="55%" stopColor="var(--color-commits)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1f1f23" />
                <ChartTooltip active cursor={false} content={<ChartTooltipContent />} />
                <Area strokeWidth={2} dataKey="commits" type="stepBefore" fill="url(#fillCommits)" fillOpacity={0.1} stroke="var(--color-commits)" stackId="a" />
                <Area strokeWidth={2} dataKey="issues" type="stepBefore" fill="url(#fillIssues)" fillOpacity={0.1} stroke="var(--color-issues)" stackId="a" />
            </AreaChart>
        </ChartContainer>
    )
}
