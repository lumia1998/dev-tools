/// <reference types="vite/client" />

// WebHID API types (not in default DOM lib)
interface HIDDevice {
  opened: boolean
  vendorId: number
  productId: number
  productName: string
  manufacturerName: string
  collections?: HIDCollection[]
  open(): Promise<void>
  close(): Promise<void>
  sendReport(reportId: number, data: BufferSource): Promise<void>
  sendFeatureReport(reportId: number, data: BufferSource): Promise<void>
  receiveFeatureReport(reportId: number): Promise<DataView>
  addEventListener(type: string, listener: EventListener): void
  removeEventListener(type: string, listener: EventListener): void
}

interface HIDCollection {
  usagePage: number
  usage: number
  type?: number
  inputReports?: HIDReport[]
  outputReports?: HIDReport[]
  featureReports?: HIDReport[]
}

interface HIDReport {
  reportId: number
  byteLength: number
}

interface HIDInputReportEvent extends Event {
  device: HIDDevice
  reportId: number
  data: DataView
}

interface HID extends EventTarget {
  requestDevice(options: { filters: Array<{ vendorId?: number; productId?: number; usagePage?: number; usage?: number }> }): Promise<HIDDevice[]>
  getDevices(): Promise<HIDDevice[]>
}

interface Navigator {
  hid: HID
}