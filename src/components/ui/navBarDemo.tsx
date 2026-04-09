import { Home, FolderKanban, Users, FileText, Zap } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Features', url: '#features', icon: Zap },
    { name: 'Login', url: '/login', icon: Users },
    { name: 'Sign Up', url: '/signup', icon: FileText }
  ]

  return <NavBar items={navItems} />
}