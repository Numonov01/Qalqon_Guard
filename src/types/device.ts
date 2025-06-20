export interface Device {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_addres: string;
  bios_uuid: string;
  risk_ball: number;
  config: null | any;
  is_active: boolean;
}

export interface DeviceList {
  count: number;
  next: null | string;
  previous: null | string;
  results: Device[];
}

export interface EdrInfo {
  signatures_count: number;
  yara_rules_count: number;
  devices_count: number;
}

export interface EdrLogs {
  id: number;
  log_type: string;
  find_on_device_time: string;
  action: string;
  direction: string;
  full_info: string;
  device: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    ip_addres: string;
    bios_uuid: string;
    risk_ball: number;
    config: null;
    is_active: boolean;
  };
  created_at: string;
}
