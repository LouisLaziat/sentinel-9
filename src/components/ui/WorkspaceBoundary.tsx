import { Component } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'

export class WorkspaceBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="workspace-recovery" role="alert">
          <span>UPLINK INTERRUPTED</span>
          <h3>The command network couldn’t load.</h3>
          <p>Reload to reconnect. Your saved response and operator preferences remain on this device when browser storage is available.</p>
          <Button onClick={() => window.location.reload()}>Reconnect network</Button>
        </div>
      )
    }
    return this.props.children
  }
}
