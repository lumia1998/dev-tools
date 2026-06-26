export interface NpmSearchResult {
  name: string
  version: string
  description: string
  keywords: string[]
  publisher: string
  link: string
  date: string
}

export interface NpmPackageDetail {
  name: string
  description: string
  license: string
  homepage: string
  repository: string
  keywords: string[]
  maintainers: string[]
  versions: string[]
}

export async function searchNpm(query: string, size = 20): Promise<NpmSearchResult[] | null> {
  if (!query.trim()) return null
  try {
    return await window.npm.search(query, size)
  } catch {
    return null
  }
}

export async function getNpmPackage(name: string): Promise<NpmPackageDetail | null> {
  try {
    return await window.npm.getPackage(name)
  } catch {
    return null
  }
}
