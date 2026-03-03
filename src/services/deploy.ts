import AdmZip from 'adm-zip'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

import {
    apiGetApplicationDetail,
    apiGetPreUploadUrl,
    apiPutCompressFile,
} from '../api/modules/applications/index.js'

export interface DeployOptions {
    appName: string
    buildPath: string
    description?: string
    onProgress?: (stage: string, percent?: number) => void
}

export interface DeployResult {
    version: number
}

export async function deployApp(opts: DeployOptions): Promise<DeployResult> {
    const { appName, buildPath, description = '', onProgress } = opts

    const resolvedPath = path.resolve(process.cwd(), buildPath)
    if (!fs.existsSync(resolvedPath)) throw new Error('PATH_NOT_EXIST')

    onProgress?.('compressing')
    const zipPath = await compressFolder(resolvedPath)
    const md5 = await getFileMD5(zipPath)

    onProgress?.('getting_url')
    const appDetail = await apiGetApplicationDetail(appName)
    const nextVersion = appDetail.last_version + 1

    const { url } = await apiGetPreUploadUrl(appName, md5, description)

    onProgress?.('uploading', 0)
    await uploadFile(url, zipPath, md5, description, (percent) => {
        onProgress?.('uploading', percent)
    })

    return { version: nextVersion }
}

async function compressFolder(folderPath: string): Promise<string> {
    const packageDir = process.env._PORTEX_CONFIG_PACKAGE_FILE_PATH_ as string
    const zip = new AdmZip()
    zip.addLocalFolder(folderPath)
    const zipPath = path.join(packageDir, `${uuidv4()}.zip`)
    zip.writeZip(zipPath)
    await cleanOldPackages(packageDir)
    return zipPath
}

async function getFileMD5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5')
        const stream = fs.createReadStream(filePath)
        stream.on('data', chunk => hash.update(chunk))
        stream.on('end', () => resolve(hash.digest('base64')))
        stream.on('error', reject)
    })
}

async function uploadFile(
    url: string,
    zipPath: string,
    md5: string,
    description: string,
    onProgress: (percent: number) => void
): Promise<void> {
    const buffer = fs.readFileSync(zipPath)
    if (buffer.length === 0) throw new Error('FILE_EMPTY')

    await apiPutCompressFile({
        url,
        file: buffer,
        md5,
        description,
        onUploadProgress: (e: { loaded?: number; total?: number }) => {
            if (e.total && e.loaded) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        },
    })
}

async function cleanOldPackages(packageDir: string): Promise<void> {
    const files = fs.readdirSync(packageDir)
        .map(f => ({ name: f, time: fs.statSync(path.join(packageDir, f)).birthtimeMs }))
        .sort((a, b) => b.time - a.time)

    for (const file of files.slice(4)) {
        try { fs.unlinkSync(path.join(packageDir, file.name)) } catch { /* ignore */ }
    }
}
