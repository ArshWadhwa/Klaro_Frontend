"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { Entropy } from './entropy'
import { FeaturesBento } from './features-bento'
import { FeaturesShowcase } from './features-showcase'

const menuItems = [
    { name: 'Features', href: '/features' },
    { name: 'Solution', href: '/solution' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]

export const HeroSection = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <div>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="group fixed z-20 w-full border-b border-[#1f1f23] bg-[#0d0d0f]/80 backdrop-blur">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-[#131316] group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-[#1f1f23] p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-zinc-400 hover:text-white block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:border-[#1f1f23] lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="border-[#1f1f23] bg-transparent text-white hover:bg-[#1a1a1d]">
                                        <Link href="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-blue-600 text-white hover:bg-blue-700">
                                        <Link href="/signup">
                                            <span>Sign Up</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <section className="overflow-hidden bg-[#0d0d0f]">
                    <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
                                Klaro
                            </h1>
                            <p className="mx-auto my-8 max-w-2xl text-xl text-zinc-400">Streamline your workflow with powerful project management, issue tracking, and team collaboration features designed for modern teams.</p>

                            <Button
                                asChild
                                size="lg"
                                className="bg-blue-600 text-white hover:bg-blue-700">
                                <Link href="/signup">
                                    <span className="btn-label">Start Building</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto -mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                        <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(20deg);]">
                                <div className="lg:h-[44rem] relative skew-x-[.36rad]">
                                    <img
                                        className="rounded-xl z-[2] relative border border-[#1f1f23] shadow-2xl"
                                        src="/dashboard-preview.png"
                                        alt="Klaro project management dashboard"
                                        width={2880}
                                        height={2074}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
               

                {/* Features Bento Grid */}
                <FeaturesBento />

                {/* Features Showcase - Project Tracking, Security, Performance */}
                <FeaturesShowcase />

                {/* Entropy Section */}
                {/* <section className="bg-[#0d0d0f] py-24 md:py-32 border-t border-[#1f1f23]"> */}
                    {/* <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                Order Meets Chaos
                            </h2>
                            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
                                Watch as structured planning and dynamic execution dance together in perfect harmony
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-xl flex justify-center p-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl rounded-full" />
                                <Entropy className="rounded-2xl border border-[#1f1f23] shadow-2xl relative z-10" size={500} />
                            </div>
                            
                            <div className="mt-12 text-center max-w-2xl px-4">
                                <p className="text-zinc-500 text-base md:text-lg italic leading-relaxed">
                                    &ldquo;In every project, there's a delicate balance between order and chaos. 
                                    Klaro helps you embrace both.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div> */}
                {/* </section> */}
            </main>
        </div>
    )
}


export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Klaro
            </span>
        </div>
    )
}
