import { useState, useCallback } from 'react'
import Sidebar from '@renderer/components/Sidebar'
import Home from '@renderer/pages/Home'
import Converter from '@renderer/pages/Converter'
import MyIp from '@renderer/pages/MyIp'
import DeviceInfo from '@renderer/pages/DeviceInfo'
import TokenGenerator from '@renderer/pages/TokenGenerator'
import JWTGenerator from '@renderer/pages/JWTGenerator'
import CronGenerator from '@renderer/pages/CronGenerator'
import JsonFormatter from '@renderer/pages/JsonFormatter'
import URLCodec from '@renderer/pages/URLCodec'
import HashGenerator from '@renderer/pages/HashGenerator'
import PasswordGenerator from '@renderer/pages/PasswordGenerator'
import JWTDecoder from '@renderer/pages/JWTDecoder'
import TimestampConverter from '@renderer/pages/TimestampConverter'
import Base64Codec from '@renderer/pages/Base64Codec'
import KeyboardTester from '@renderer/pages/KeyboardTester'
import PortGenerator from '@renderer/pages/PortGenerator'
import SubnetCalculator from '@renderer/pages/SubnetCalculator'
import IPv4Converter from '@renderer/pages/IPv4Converter'
import IPRangeExpander from '@renderer/pages/IPRangeExpander'
import TextAnalyzer from '@renderer/pages/TextAnalyzer'
import About from '@renderer/pages/About'

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState('home')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  // 同步主题到 document
  document.documentElement.setAttribute('data-theme', theme)

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sidebar-collapsed', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const renderPage = (): React.JSX.Element => {
    switch (currentPage) {
      case 'home':
        return <Home onSelectTool={setCurrentPage} />
      case 'data-size-converter':
        return <Converter />
      case 'my-ip':
        return <MyIp />
      case 'device-info':
        return <DeviceInfo />
      case 'token-generator':
        return <TokenGenerator />
      case 'jwt-generator':
        return <JWTGenerator />
      case 'cron-generator':
        return <CronGenerator />
      case 'json-formatter':
        return <JsonFormatter />
      case 'url-codec':
        return <URLCodec />
      case 'hash-generator':
        return <HashGenerator />
      case 'password-generator':
        return <PasswordGenerator />
      case 'jwt-decoder':
        return <JWTDecoder />
      case 'timestamp-converter':
        return <TimestampConverter />
      case 'base64-codec':
        return <Base64Codec />
      case 'keyboard-tester':
        return <KeyboardTester />
      case 'port-generator':
        return <PortGenerator />
      case 'subnet-calculator':
        return <SubnetCalculator />
      case 'ipv4-converter':
        return <IPv4Converter />
      case 'ip-range-expander':
        return <IPRangeExpander />
      case 'text-analyzer':
        return <TextAnalyzer />
      case 'about':
        return <About />
      default:
        return <Home onSelectTool={setCurrentPage} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        theme={theme}
        onToggleTheme={toggleTheme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
