const SOLR_BASE = 'https://search.maven.org/solrsearch/select'

export interface MavenDoc {
  groupId: string
  artifactId: string
  latestVersion: string
  versionCount: number
  packaging: string
  timestamp: number
}

interface SolrSearchResponse {
  response: {
    numFound: number
    docs: SolrDoc[]
  }
}

interface SolrDoc {
  g: string
  a: string
  latestVersion: string
  versionCount: number
  p: string
  timestamp: number
}

function toMavenDoc(doc: SolrDoc): MavenDoc {
  return {
    groupId: doc.g,
    artifactId: doc.a,
    latestVersion: doc.latestVersion,
    versionCount: doc.versionCount,
    packaging: doc.p,
    timestamp: doc.timestamp
  }
}

export async function searchMavenArtifacts(query: string, rows = 20): Promise<MavenDoc[]> {
  if (!query.trim()) return []
  const params = new URLSearchParams({
    q: query,
    rows: String(rows),
    wt: 'json'
  })
  try {
    const res = await fetch(`${SOLR_BASE}?${params}`)
    const data: SolrSearchResponse = await res.json()
    return data.response.docs.map(toMavenDoc)
  } catch {
    return []
  }
}

export async function getArtifactVersions(
  groupId: string,
  artifactId: string,
  rows = 15
): Promise<string[]> {
  const params = new URLSearchParams({
    q: `g:${groupId} AND a:${artifactId}`,
    core: 'gav',
    rows: String(rows),
    wt: 'json'
  })
  try {
    const res = await fetch(`${SOLR_BASE}?${params}`)
    const data = await res.json()
    const versions: string[] = data.response.docs.map((d: { v: string }) => d.v)
    // Basic semver-friendly sort (latest first)
    return versions.sort((a, b) => {
      const ap = a.split('.').map(Number)
      const bp = b.split('.').map(Number)
      for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
        const av = ap[i] ?? 0
        const bv = bp[i] ?? 0
        if (av !== bv) return bv - av
      }
      return a.localeCompare(b)
    })
  } catch {
    return []
  }
}

// Popular artifact seeds for initial page load
const POPULAR_SEEDS = [
  'spring-boot-starter-web',
  'spring-boot-starter-data-jpa',
  'lombok',
  'guava',
  'jackson-databind',
  'gson',
  'mybatis-spring-boot-starter',
  'mybatis-plus-boot-starter',
  'mysql-connector-j',
  'postgresql',
  'h2',
  'commons-lang3',
  'okhttp',
  'kafka-clients',
  'jjwt-api',
  'springdoc-openapi-starter-webmvc-ui',
  'mapstruct',
  'hutool-all',
  'fastjson2',
  'knife4j-openapi3-jakarta-spring-boot-starter',
  'aliyun-sdk-oss',
  'amqp-client',
  'jedis',
  'httpclient5'
]

export async function fetchPopularDeps(): Promise<MavenDoc[]> {
  const results: MavenDoc[] = []
  for (const seed of POPULAR_SEEDS) {
    const params = new URLSearchParams({
      q: `a:${seed}`,
      rows: '1',
      wt: 'json'
    })
    try {
      const res = await fetch(`${SOLR_BASE}?${params}`)
      const data: SolrSearchResponse = await res.json()
      if (data.response.docs.length > 0) {
        results.push(toMavenDoc(data.response.docs[0]))
      }
    } catch {
      // skip seed on failure
    }
  }
  return results
}
