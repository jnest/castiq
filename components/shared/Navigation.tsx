'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, BookOpen, Fish, Map, MoreHorizontal, Waves } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  {
    href: '/analyze',
    icon: Camera,
    label: 'Analyze',
    activeColor: 'text-hook-400',
    activeBg: 'bg-hook-500/10',
  },
  {
    href: '/fishread',
    icon: BookOpen,
    label: 'FishRead',
    activeColor: 'text-water-400',
    activeBg: 'bg-water-500/10',
  },
  {
    href: '/catches',
    icon: Fish,
    label: 'Catches',
    activeColor: 'text-depth-400',
    activeBg: 'bg-depth-500/10',
  },
  {
    href: '/conditions',
    icon: Waves,
    label: 'Conditions',
    activeColor: 'text-water-300',
    activeBg: 'bg-water-400/10',
  },
  {
    href: '/species',
    icon: MoreHorizontal,
    label: 'Species',
    activeColor: 'text-dark-300',
    activeBg: 'bg-dark-400/10',
  },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-dark-700/50">
        <div className="flex items-stretch max-w-lg mx-auto">
          {navItems.map(({ href, icon: Icon, label, activeColor, activeBg }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 py-3 px-2 transition-all duration-200 relative',
                  isActive ? activeColor : 'text-dark-400 hover:text-dark-200'
                )}
              >
                {isActive && (
                  <span className={cn('absolute inset-x-1 inset-y-1 rounded-lg', activeBg)} />
                )}
                <Icon
                  size={20}
                  className={cn(
                    'relative transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className="text-[10px] font-medium relative leading-none">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
