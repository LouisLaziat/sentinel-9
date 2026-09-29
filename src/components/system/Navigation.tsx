import { useState } from 'react'
import { CloseIcon, MenuIcon, ReplayIcon } from '../ui/Icons'
import { StatusBadge } from '../ui/StatusBadge'

const navItems = [
  { href: '#overview', label: 'Overview', index: '01' },
  { href: '#primitives', label: 'Primitives', index: '02' },
  { href: '#modules', label: 'Modules', index: '03' },
  { href: '#motion', label: 'Motion', index: '04' },
]

type NavigationProps = {
  onReplay: () => void
}

export function Navigation({ onReplay }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="navigation">
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
        type="button"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        className={`navigation__links${isOpen ? ' navigation__links--open' : ''}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={closeMenu}>
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
        <span className="navigation__clock">23:09:41 / UTC−04</span>
      </div>
    </header>
  )
}
