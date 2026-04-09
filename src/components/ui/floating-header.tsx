'use client';

import React from 'react';
import Link from 'next/link';
import { Grid2X2Icon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingHeader() {
	const [open, setOpen] = React.useState(false);

	const links = [
		{
			label: 'Features',
			href: '#features',
		},
		{
			label: 'Pricing',
			href: '#pricing',
		},
		{
			label: 'About',
			href: '#about',
		},
	];

	return (
		<header
			className={cn(
				'sticky top-5 z-50',
				'mx-auto w-full max-w-6xl rounded-lg',
				' ',
			)}
		>
			<nav className="mx-auto flex items-center justify-between p-1.5">
				<Link href="/" className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
					<Grid2X2Icon className="size-9 text-white" />
					<p className="font-mono text-base font-bold text-white">Klaro</p>
				</Link>
				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => (
						<Link
							key={link.href}
							className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-white hover:text-white')}
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2">
					<Link href="/login">
						<Button size="sm" className="text-white">Login</Button>
					</Link>
					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden text-white border-white/20"
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
							showClose={false}
							side="left"
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<Link
										key={link.href}
										className={cn(buttonVariants({
											variant: 'ghost',
										}), 'justify-start text-white hover:text-white')}
										href={link.href}
									>
										{link.label}
									</Link>
								))}
							</div>
							<SheetFooter>
								<Link href="/login">
									<Button variant="outline" className="w-full text-white border-white/20">Sign In</Button>
								</Link>
								<Link href="/signup">
									<Button className="w-full text-white">Get Started</Button>
								</Link>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}
