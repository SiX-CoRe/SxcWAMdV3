import axios from 'axios'

const REGISTRY = 'https://registry.npmjs.org'

/**
 * Mengambil metadata package dari npm registry
 * @param {string} pkg
 * @returns {Promise<Object>}
 */
export async function getPackage(pkg) {
    if (!pkg) throw new Error('Package name is required')

    const { data } = await axios.get(`${REGISTRY}/${encodeURIComponent(pkg)}`, {
        headers: {
            Accept: 'application/json',
            'User-Agent': 'ScrapeGenerator/1.0'
        }
    })

    return data
}

/**
 * Mengambil versi terbaru package
 */
export function getLatest(meta) {
    return meta['dist-tags']?.latest || Object.keys(meta.versions).pop()
}

/**
 * Metadata versi terbaru
 */
export function getVersion(meta) {
    const latest = getLatest(meta)
    return meta.versions[latest]
}

/**
 * URL tarball
 */
export function getTarball(meta) {
    return getVersion(meta)?.dist?.tarball || null
}

/**
 * README package
 */
export function getReadme(meta) {
    return meta.readme || ''
}

/**
 * Repository
 */
export function getRepository(meta) {
    const repo = getVersion(meta)?.repository

    if (!repo) return null

    if (typeof repo === 'string') return repo

    return repo.url || null
}

/**
 * Homepage
 */
export function getHomepage(meta) {
    return getVersion(meta)?.homepage || null
}

/**
 * Dependencies
 */
export function getDependencies(meta) {
    return getVersion(meta)?.dependencies || {}
}

/**
 * Dev Dependencies
 */
export function getDevDependencies(meta) {
    return getVersion(meta)?.devDependencies || {}
}

/**
 * Package.json versi terbaru
 */
export function getPackageJson(meta) {
    return getVersion(meta)
}

/**
 * Ringkasan metadata
 */
export function summarize(meta) {
    const pkg = getVersion(meta)

    return {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        homepage: getHomepage(meta),
        repository: getRepository(meta),
        tarball: getTarball(meta),
        readme: getReadme(meta),
        dependencies: getDependencies(meta),
        devDependencies: getDevDependencies(meta),
        keywords: pkg.keywords || [],
        author: pkg.author || null,
        license: pkg.license || null
    }
}

export default {
    getPackage,
    getLatest,
    getVersion,
    getTarball,
    getRepository,
    getHomepage,
    getReadme,
    getDependencies,
    getDevDependencies,
    getPackageJson,
    summarize
}