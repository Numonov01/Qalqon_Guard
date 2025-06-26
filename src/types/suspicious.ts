export interface SuspiciousList {
  count: number;
  next: null;
  previous: null;
  results: Suspicious[];
}

export interface Suspicious {
  id: number;
  device_info: {
    id: number;
    name: string;
    ip_address: string;
    bios_uuid: string;
  };
  file_name: string;
  file_path: string;
  sha256?: string;
  t: string;
  reason: string;
  risk_score: string;
  is_quarantined: boolean;
  detected_time: string;
  created_at: string;
}
