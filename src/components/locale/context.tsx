import type { Ref, InjectionKey } from 'vue'
import { computed } from 'vue'
import { createContext, useContext } from "../../composables/useContext";
import type { Locale } from './interface'
import zhCN from './zh-CN'

const contextKey: InjectionKey<Ref<Locale>> = Symbol('locale')

const Provider = createContext<Ref<Locale>>()

export const useLocale = () =>
    useContext<Ref<Locale>>(contextKey, computed(() => zhCN))

export default Provider