import { version } from '../../package.json'

export const project = Object.freeze({
  name: 'SENTINEL//9',
  author: 'Louis Ho',
  version,
  delivery: '10',
  phase: 'Citadel defense',
  build: version.split('.').map((part) => part.padStart(2, '0')).join('.'),
  repositoryUrl: 'https://github.com/LouisLaziat/sentinel-9',
  demoUrl: 'https://louislaziat.github.io/sentinel-9/',
})
