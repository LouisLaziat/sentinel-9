import { describe, expect, it } from 'vitest'
import { version } from '../../package.json'
import { project } from './project'

describe('portfolio release metadata', () => {
  it('derives the HUD build label from the package version', () => {
    expect(project.version).toBe(version)
    expect(project.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(project.build).toBe(version.split('.').map((part) => part.padStart(2, '0')).join('.'))
  })

  it('identifies the portfolio launch and public author', () => {
    expect(project.delivery).toBe('09')
    expect(project.phase).toBe('Portfolio launch')
    expect(project.author).toBe('Louis Ho')
    expect(Object.isFrozen(project)).toBe(true)
  })

  it('keeps repository and GitHub Pages links on the same project', () => {
    const repository = new URL(project.repositoryUrl)
    const demo = new URL(project.demoUrl)
    const [owner, name] = repository.pathname.slice(1).split('/')
    expect(repository.hostname).toBe('github.com')
    expect(demo.hostname).toBe(`${owner!.toLowerCase()}.github.io`)
    expect(demo.pathname).toBe(`/${name}/`)
  })
})
