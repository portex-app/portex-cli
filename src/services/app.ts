import {
    apiCreateApplication,
    apiGetApplicationList,
} from '../api/modules/applications/index.js'
import { apiGetPlatfroms } from '../api/modules/public/index.js'

let platformCache: Array<{ id: string; name: string }> = []

export async function fetchPlatforms(): Promise<Array<{ id: string; name: string }>> {
    if (platformCache.length > 0) return platformCache
    const res = await apiGetPlatfroms()
    if (!res.platforms?.length) throw new Error('No platforms found')
    platformCache = res.platforms.map(p => ({ id: p.id, name: p.name }))
    return platformCache
}

export async function getPlatformByName(name: string): Promise<string> {
    const platforms = await fetchPlatforms()
    const found = platforms.find(p => p.name === name)
    if (!found) throw new Error(`Platform "${name}" not found`)
    return found.id
}

export async function getApplicationInfo(params?: ApplicationQueryRequest): Promise<Application> {
    const res = await apiGetApplicationList(params)
    if (!res.applications?.length) {
        throw new Error('APP_NOT_FOUND')
    }
    return res.applications[0]
}

export async function listApplications(params?: ApplicationQueryRequest): Promise<Application[]> {
    const res = await apiGetApplicationList(params)
    return res.applications ?? []
}

export async function createApplication(params: {
    name: string
    platformId: string
    description?: string
}): Promise<Application> {
    await apiCreateApplication({
        application_name: params.name,
        platform_id: params.platformId,
        description: params.description ?? '',
    })
    return getApplicationInfo({ application_name: params.name })
}
