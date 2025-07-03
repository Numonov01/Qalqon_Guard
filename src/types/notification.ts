export interface NotificationList {
  count: number;
  next: string | null;
  previous: string | null;
  results: WSNotification[];
}

export type WSNotification = {
  event: 'new_approval_request';
  id: number;
  full_data: {
    about: {
      pid: number;
      name: string;
      cmdline: string[];
      cwd: string;
      parent_pid: number;
      risk_score: number;
      mitre_ids: string[];
      timestamp: string;
      file_path: string;
      file_hash: string;
      reason: string;
    };
    todo: string;
    description: string;
  };
  device: string;
  is_approved: string;
  device_info: {
    id: number;
    name: string;
    ip_address: string;
    bios_uuid: string;
  };
};
