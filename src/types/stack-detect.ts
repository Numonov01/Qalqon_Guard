export interface StackDetectionList {
  count: number;
  next: null;
  previous: null;
  results: StackDetection[];
}

export interface StackDetection {
  id: number;
  device_info: {
    id: number;
    name: string;
    ip_address: string;
    bios_uuid: string;
  };
  event_type: string;
  timestamp: string;
  detection_details: {
    [key: string]: string;
  };
  severity: string;
  tactics: string;
  technique_descriptions: string;
  indicators: string[];
  risk_assessment: string;
  mitre_attack_mapping: {
    [key: string]: string;
  };
  created_at: string;
}
