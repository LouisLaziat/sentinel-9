import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../../hooks/useBrowserSignals'
import { CloseIcon, MenuIcon, ReplayIcon } from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

const navItems = [
  { href: '#overview', label: 'Overview', index: '01' },
  { href: '#command', label: 'Command', index: '02' },
  { href: '#primitives', label: 'Primitives', index: '03' },
  { href: '#modules', label: 'Modules', index: '04' },
  { href: '#motion', label: 'Motion', index: '05' },
]

type NavigationProps = {
  onReplay: () => void
}

export function Navigation({ onReplay }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen || !isMobile) return
    function closeOutside(event: Event) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
    }
  }, [isMobile, isOpen])

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="navigation" onKeyDown={(event) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        closeMenu()
        toggleRef.current?.focus()
      }
    }} ref={headerRef}>
      <a className="navigation__brand" href="#overview" onClick={closeMenu}>
        <span className="navigation__mark" aria-hidden="true">
          <span>S</span>
          <i>9</i>
        </span>
        <span className="navigation__wordmark">
          SENTINEL<i>//9</i>
        </span>
        <span className="sr-only">SENTINEL 9 home</span>
      </a>

      <button
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        className="navigation__toggle"
        onClick={() => setIsOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        className={`navigation__links${isOpen ? ' navigation__links--open' : ''}`}
        id="primary-navigation"
        aria-label="Primary navigation"
        aria-hidden={isMobile && !isOpen || undefined}
        inert={isMobile && !isOpen}
      >
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => {
            closeMenu()
            window.requestAnimationFrame(() => document.querySelector<HTMLElement>(item.href)?.focus({ preventScroll: true }))
          }}>
            <span>{item.index}</span>
            {item.label}
          </a>
        ))}
        <button
          className="navigation__replay"
          onClick={() => {
            closeMenu()
            onReplay()
          }}
          type="button"
        >
          <ReplayIcon />
          Reboot
        </button>
      </nav>

      <div className="navigation__status">
        <StatusBadge tone="online" pulse>
          System online
        </StatusBadge>
        <span className="navigation__clock">PORTFOLIO / LOCAL DEMO</span>
      </div>
    </header>
  )
}
