import { useState, useCallback, useEffect } from 'react'
import Sidebar from '@renderer/components/Sidebar'
import CommandPalette from '@renderer/components/CommandPalette'
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
import GitCheatSheet from '@renderer/pages/GitCheatSheet'
import DockerCheatSheet from '@renderer/pages/DockerCheatSheet'
import MavenDependency from '@renderer/pages/MavenDependency'
import About from '@renderer/pages/About'
import SettingsPage from '@renderer/pages/SettingsPage'
import { SettingsProvider, useSettings } from '@renderer/lib/contexts'
import { UpdaterProvider } from '@renderer/lib/updater-context'

function AppContent(): React.JSX.Element {
  const { settings, updateAppearance } = useSettings()
  const [currentPage, setCurrentPage] = useState('home')

  // 应用主题
  useEffect(() => {
    const theme = settings.appearance.theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [settings.appearance.theme])

  // 应用字体大小
  useEffect(() => {
    const fontSize = settings.appearance.fontSize
    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [settings.appearance.fontSize])

  const handleToggleCollapse = useCallback(() => {
    updateAppearance({ sidebarCollapsed: !settings.appearance.sidebarCollapsed })
  }, [settings.appearance.sidebarCollapsed, updateAppearance])

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
      case 'git-cheat-sheet':
        return <GitCheatSheet />
      case 'docker-cheat-sheet':
        return <DockerCheatSheet />
      case 'maven-dependency':
        return <MavenDependency />
      case 'about':
        return <About />
      case 'settings':
        return <SettingsPage />
      default:
        return <Home onSelectTool={setCurrentPage} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={settings.appearance.sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="main-content">{renderPage()}</main>
      <CommandPalette currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <SettingsProvider>
      <UpdaterProvider>
        <AppContent />
      </UpdaterProvider>
    </SettingsProvider>
  )
}

export default App
