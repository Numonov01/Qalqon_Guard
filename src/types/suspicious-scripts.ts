export interface SuspiciousScriptsList {
  count: number;
  next: null;
  previous: null;
  results: SuspiciousScripts[];
}

export interface SuspiciousScripts {
  id: number;
  device_info: {
    id: number;
    name: string;
    ip_address: string;
    bios_uuid: string;
  };
  pid: number;
  name: string;
  risk_score: number;
  cwd: string;
  mitre: {
    [key: string]: string;
  };
  created_at: string;
}
