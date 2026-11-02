import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { ADMIN, SUPER_ADMIN } from '@/constants/roles.constant'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    emptyCheck = false,
) {
    const expandedUserAuthority = useMemo(() => {
        const roles = new Set(userAuthority)
        if (userAuthority.includes(ADMIN) && !roles.has(SUPER_ADMIN)) {
            roles.add(SUPER_ADMIN)
        }
        return Array.from(roles)
    }, [userAuthority])

    const roleMatched = useMemo(() => {
        return authority.some((role) => expandedUserAuthority.includes(role))
    }, [authority, expandedUserAuthority])

    if (
        isEmpty(authority) ||
        isEmpty(userAuthority) ||
        typeof authority === 'undefined'
    ) {
        return !emptyCheck
    }

    return roleMatched
}

export default useAuthority
