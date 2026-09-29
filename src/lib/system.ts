export function getNetworkStatus(isConnected: boolean): 'Online' | 'Offline' {
  return isConnected ? 'Online' : 'Offline'
}
