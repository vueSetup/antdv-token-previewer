import { defineComponent, provide, inject, readonly } from 'vue'
import type {
  DefineSetupFnComponent,
  InjectionKey,
  DeepReadonly,
  UnwrapNestedRefs,
  PropType
} from 'vue'

/**
 * Wraps your components to specify the value of this context for all components inside.
 *
 * @see {@link https://react.dev/reference/react/createContext#provider React Docs}
 *
 * @example
 *
 * ```tsx
 * import { createContext } from './composables/useContext';
 *
 * const ThemeContext = createContext('theme');
 *
 * function App() {
 *   return (
 *     <ThemeContext.Provider value="{ algorithm: darkAlgorithm }">
 *       <Toolbar />
 *     </ThemeContext.Provider>
 *   );
 * }
 * ```
 */
type Provider<T> = DefineSetupFnComponent<{ value: T }>

/**
 * Context lets components pass information deep down without explicitly
 * passing props.
 *
 * Created from {@link createContext}
 *
 * @see {@link https://react.dev/learn/passing-data-deeply-with-context React Docs}
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}
 *
 * @example
 *
 * ```tsx
 * import { createContext } from './composables/useContext';
 *
 * const ThemeContext = createContext('theme');
 * ```
 */
interface Context<T> {
  key: InjectionKey<DeepReadonly<UnwrapNestedRefs<T>>>
  Provider: Provider<T>
}

/**
 * Lets you create a {@link Context} that components can provide or read.
 *
 * @param defaultValue The value you want the context to have when there is no matching
 * {@link Provider} in the tree above the component reading the context. This is meant
 * as a "last resort" fallback.
 *
 * @see {@link https://react.dev/reference/react/createContext#reference React Docs}
 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}
 *
 * @example
 *
 * ```tsx
 * import { createContext } from './composables/useContext';
 *
 * const ThemeContext = createContext(''theme');
 * ```
 */
export const createContext = <T extends object>(displayName?: string): Context<T> => {
  const key: InjectionKey<DeepReadonly<UnwrapNestedRefs<T>>> = Symbol(displayName)
  const Provider = defineComponent<{ value: T }>({
    name: displayName,
    props: {
      value: { type: Object as PropType<T>, required: true }
    },
    setup({ value }, { slots }) {
      provide(key, readonly(value))
      return () => slots.default?.()
    }
  })
  return {
    key,
    Provider
  }
}
// This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
/**
 * Accepts a context object (the value returned from `createContext`) and returns the current
 * context value, as given by the nearest context provider for the given context.
 *
 * @version 16.8.0
 * @see {@link https://react.dev/reference/react/useContext}
 */
export const useContext = <T extends object>(context: Context<T>, defaultValue?: T) =>
  inject<T>(context.key, defaultValue ?? ({} as T))
