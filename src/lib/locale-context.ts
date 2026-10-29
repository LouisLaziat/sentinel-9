import { createContext } from 'react'
import type { Locale } from './i18n'

export const LocaleContext = createContext<{ locale: Locale; changeLocale: (locale: Locale) => void }>({ locale: 'en', changeLocale: () => undefined })
