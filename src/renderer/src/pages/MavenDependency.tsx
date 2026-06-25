import { useState, useMemo, useCallback } from 'react'
import { Copy, Check, Search, ExternalLink } from 'lucide-react'

interface MavenDependency {
  groupId: string
  artifactId: string
  versions: string[]
  category: string
  description: string
}

const MAVEN_DEPS: MavenDependency[] = [
  { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-web', versions: ['3.3.0', '3.2.5', '3.1.8', '2.7.18'], category: 'Spring', description: 'Spring Boot Web Starter' },
  { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-data-jpa', versions: ['3.3.0', '3.2.5', '3.1.8', '2.7.18'], category: 'Spring', description: 'Spring Boot Data JPA' },
  { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-data-redis', versions: ['3.3.0', '3.2.5', '3.1.8', '2.7.18'], category: 'Spring', description: 'Spring Boot Redis' },
  { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-security', versions: ['3.3.0', '3.2.5', '3.1.8', '2.7.18'], category: 'Spring', description: 'Spring Boot Security' },
  { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-test', versions: ['3.3.0', '3.2.5', '3.1.8', '2.7.18'], category: 'Spring', description: 'Spring Boot Test' },
  { groupId: 'org.projectlombok', artifactId: 'lombok', versions: ['1.18.32', '1.18.30', '1.18.28', '1.18.26'], category: 'Utility', description: 'Java Boilerplate Reducer' },
  { groupId: 'com.google.guava', artifactId: 'guava', versions: ['33.2.1-jre', '33.1.0-jre', '32.1.3-jre', '31.1-jre'], category: 'Utility', description: 'Google Core Libraries' },
  { groupId: 'com.fasterxml.jackson.core', artifactId: 'jackson-databind', versions: ['2.17.1', '2.16.2', '2.15.3', '2.14.3'], category: 'JSON', description: 'Jackson JSON Processor' },
  { groupId: 'com.google.code.gson', artifactId: 'gson', versions: ['2.11.0', '2.10.1', '2.9.1', '2.8.9'], category: 'JSON', description: 'Google JSON Library' },
  { groupId: 'org.mybatis.spring.boot', artifactId: 'mybatis-spring-boot-starter', versions: ['3.0.3', '2.3.2', '2.2.2', '2.1.4'], category: 'Database', description: 'MyBatis Spring Boot' },
  { groupId: 'com.baomidou', artifactId: 'mybatis-plus-boot-starter', versions: ['3.5.6', '3.5.5', '3.5.3.1', '3.4.3'], category: 'Database', description: 'MyBatis-Plus' },
  { groupId: 'mysql', artifactId: 'mysql-connector-java', versions: ['8.0.33', '8.0.32', '8.0.30', '5.1.49'], category: 'Database', description: 'MySQL Connector' },
  { groupId: 'com.mysql', artifactId: 'mysql-connector-j', versions: ['8.4.0', '8.3.0', '8.2.0'], category: 'Database', description: 'MySQL Connector J' },
  { groupId: 'org.postgresql', artifactId: 'postgresql', versions: ['42.7.3', '42.7.2', '42.6.0', '42.5.4'], category: 'Database', description: 'PostgreSQL Driver' },
  { groupId: 'com.h2database', artifactId: 'h2', versions: ['2.2.224', '2.2.220', '2.1.214'], category: 'Database', description: 'H2 Embedded Database' },
  { groupId: 'redis.clients', artifactId: 'jedis', versions: ['5.1.3', '5.1.2', '5.0.2', '4.4.3'], category: 'Cache', description: 'Redis Java Client' },
  { groupId: 'org.apache.commons', artifactId: 'commons-lang3', versions: ['3.14.0', '3.13.0', '3.12.0', '3.11'], category: 'Utility', description: 'Apache Commons Lang' },
  { groupId: 'org.apache.commons', artifactId: 'commons-collections4', versions: ['4.4', '4.3', '4.2'], category: 'Utility', description: 'Apache Commons Collections' },
  { groupId: 'org.apache.httpcomponents.client5', artifactId: 'httpclient5', versions: ['5.3.1', '5.3', '5.2.3', '5.2.1'], category: 'HTTP', description: 'Apache HttpClient 5' },
  { groupId: 'com.squareup.okhttp3', artifactId: 'okhttp', versions: ['4.12.0', '4.11.0', '4.10.0'], category: 'HTTP', description: 'OkHttp Client' },
  { groupId: 'org.apache.kafka', artifactId: 'kafka-clients', versions: ['3.7.1', '3.7.0', '3.6.2', '3.5.2'], category: 'Messaging', description: 'Apache Kafka Client' },
  { groupId: 'com.rabbitmq', artifactId: 'amqp-client', versions: ['5.21.0', '5.20.0', '5.19.0', '5.18.0'], category: 'Messaging', description: 'RabbitMQ Client' },
  { groupId: 'io.jsonwebtoken', artifactId: 'jjwt-api', versions: ['0.12.5', '0.12.3', '0.11.5'], category: 'Security', description: 'Java JWT' },
  { groupId: 'org.springdoc', artifactId: 'springdoc-openapi-starter-webmvc-ui', versions: ['2.5.0', '2.4.0', '2.3.0', '2.2.0'], category: 'API', description: 'SpringDoc OpenAPI' },
  { groupId: 'io.springfox', artifactId: 'springfox-boot-starter', versions: ['3.0.0'], category: 'API', description: 'SpringFox Swagger' },
  { groupId: 'org.mapstruct', artifactId: 'mapstruct', versions: ['1.5.5.Final', '1.5.3.Final', '1.4.2.Final'], category: 'Utility', description: 'Java Bean Mapping' },
  { groupId: 'cn.hutool', artifactId: 'hutool-all', versions: ['5.8.28', '5.8.27', '5.8.26', '5.8.25'], category: 'Utility', description: 'Hutool Java Utility' },
  { groupId: 'com.alibaba', artifactId: 'fastjson2', versions: ['2.0.50', '2.0.49', '2.0.47', '2.0.40'], category: 'JSON', description: 'Alibaba FastJSON2' },
  { groupId: 'com.github.xiaoymin', artifactId: 'knife4j-openapi3-jakarta-spring-boot-starter', versions: ['4.4.0', '4.3.0', '4.1.0'], category: 'API', description: 'Knife4j API Docs' },
  { groupId: 'com.aliyun.oss', artifactId: 'aliyun-sdk-oss', versions: ['3.17.4', '3.17.3', '3.16.1'], category: 'Cloud', description: 'Alibaba Cloud OSS' }
]

type OutputFormat = 'maven' | 'gradle' | 'gradle-kotlin' | 'sbt'

export default function MavenDependency(): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [selectedDep, setSelectedDep] = useState<MavenDependency | null>(null)
  const [selectedVersion, setSelectedVersion] = useState('')
  const [format, setFormat] = useState<OutputFormat>('maven')
  const [copied, setCopied] = useState(false)

  const filteredDeps = useMemo(() => {
    if (!search.trim()) return MAVEN_DEPS
    const query = search.toLowerCase()
    return MAVEN_DEPS.filter(
      (dep) =>
        dep.groupId.toLowerCase().includes(query) ||
        dep.artifactId.toLowerCase().includes(query) ||
        dep.description.toLowerCase().includes(query) ||
        dep.category.toLowerCase().includes(query)
    )
  }, [search])

  const selectDep = useCallback((dep: MavenDependency) => {
    setSelectedDep(dep)
    setSelectedVersion(dep.versions[0])
  }, [])

  const generateOutput = useCallback(
    (dep: MavenDependency, version: string, fmt: OutputFormat): string => {
      switch (fmt) {
        case 'maven':
          return `<dependency>\n    <groupId>${dep.groupId}</groupId>\n    <artifactId>${dep.artifactId}</artifactId>\n    <version>${version}</version>\n</dependency>`
        case 'gradle':
          return `implementation '${dep.groupId}:${dep.artifactId}:${version}'`
        case 'gradle-kotlin':
          return `implementation("${dep.groupId}:${dep.artifactId}:${version}")`
        case 'sbt':
          return `libraryDependencies += "${dep.groupId}" % "${dep.artifactId}" % "${version}"`
      }
    },
    []
  )

  const copyOutput = useCallback(async () => {
    if (!selectedDep) return
    const output = generateOutput(selectedDep, selectedVersion, format)
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback
    }
  }, [selectedDep, selectedVersion, format, generateOutput])

  const formatLabels: Record<OutputFormat, string> = {
    maven: 'Maven',
    gradle: 'Gradle',
    'gradle-kotlin': 'Gradle Kotlin',
    sbt: 'SBT'
  }

  return (
    <div className="mvn-page">
      <div className="mvn-card">
        <div className="mvn-header">
          <h2 className="mvn-title">Maven Dependency</h2>
          <p className="mvn-subtitle">快速生成 Maven / Gradle 依赖配置</p>
        </div>

        <div className="mvn-search">
          <Search size={16} />
          <input
            type="text"
            className="mvn-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索依赖 (spring, lombok, jackson...)"
          />
        </div>

        <div className="mvn-content">
          <div className="mvn-dep-list">
            {filteredDeps.slice(0, 20).map((dep) => (
              <div
                key={`${dep.groupId}:${dep.artifactId}`}
                className={`mvn-dep-item ${selectedDep === dep ? 'active' : ''}`}
                onClick={() => selectDep(dep)}
              >
                <div className="mvn-dep-main">
                  <code className="mvn-dep-artifact">{dep.artifactId}</code>
                  <span className="mvn-dep-version">{dep.versions[0]}</span>
                </div>
                <span className="mvn-dep-group">{dep.groupId}</span>
              </div>
            ))}
          </div>

          {selectedDep && (
            <div className="mvn-output-area">
              <div className="mvn-version-selector">
                <span className="mvn-section-label">版本</span>
                <div className="mvn-versions">
                  {selectedDep.versions.map((v) => (
                    <button
                      key={v}
                      className={`mvn-version-btn ${selectedVersion === v ? 'active' : ''}`}
                      onClick={() => setSelectedVersion(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mvn-format-tabs">
                {(Object.keys(formatLabels) as OutputFormat[]).map((f) => (
                  <button
                    key={f}
                    className={`mvn-format-btn ${format === f ? 'active' : ''}`}
                    onClick={() => setFormat(f)}
                  >
                    {formatLabels[f]}
                  </button>
                ))}
              </div>

              <div className="mvn-code-block">
                <div className="mvn-code-header">
                  <span className="mvn-code-label">{formatLabels[format]}</span>
                  <button className="mvn-copy-btn" onClick={copyOutput}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="mvn-code">
                  {generateOutput(selectedDep, selectedVersion, format)}
                </pre>
              </div>

              <a
                className="mvn-central-link"
                href={`https://central.sonatype.com/artifact/${selectedDep.groupId}/${selectedDep.artifactId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={13} />
                在 Maven Central 查看
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
