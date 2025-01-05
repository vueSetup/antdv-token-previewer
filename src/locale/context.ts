import { createContext, useContext } from '../composables/useContext`'
import type { MaybeRef } from 'vue'
import type { Locale } from './interface'

export const LocaleContext = createContext<MaybeRef<Locale>>('locale')
export const useLocale = () => useContext(LocaleContext)
