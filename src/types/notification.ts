export interface NotificationList {
  count: number;
  next: null;
  previous: null;
  results: WSNotification[];
}

export type WSNotification = {
  event: 'new_approval_request';
  id: number;
  full_data: {
    full_data: {
      pid: number;
      name: string;
      cmdline: string[];
      cwd: string;
      parent_pid: number;
      risk_score: number;
      mitre_ids: string[];
      timestamp: string;
    };
    todo: string;
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
