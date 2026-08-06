import { useMemo } from 'react'
import debounce from 'lodash/debounce'
import type { DebounceSettingsLeading } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any) => any>(
    func: T,
    wait: number | undefined,
    options?: DebounceSettingsLeading,
) {
    return useMemo(() => debounce(func, wait, options), [func, wait, options])
}

export default useDebounce
