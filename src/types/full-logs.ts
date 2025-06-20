export interface DownloadResponse {
  count: number;
  next: null;
  previous: null;
  results: FullLogs[];
}

export interface FullLogs {
  id: number;
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
  full_data: string;
  created_at: string;
}

export interface EdrFullLogs {
  id: number;
  device: EdrDevice[];
  full_data: string;
  created_at: string;
}

export interface EdrDevice {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_addres: string;
  bios_uuid: string;
  risk_ball: number;
  config: null;
  is_active: boolean;
}
