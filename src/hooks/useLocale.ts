import { useContext } from 'react'
import { LocaleContext } from '../lib/locale-context'

export function useLocale() { return useContext(LocaleContext) }
