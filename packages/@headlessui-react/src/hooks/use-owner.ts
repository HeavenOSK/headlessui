import { useMemo } from 'react'
import { getOwnerDocument } from '../utils/owner'
import { useServerHandoffComplete } from './use-server-handoff-complete'

export function useOwnerDocument(...args: Parameters<typeof getOwnerDocument>) {
  let ready = useServerHandoffComplete()
  return useMemo(() => (ready ? getOwnerDocument(...args) : null), [ready, ...args])
}
