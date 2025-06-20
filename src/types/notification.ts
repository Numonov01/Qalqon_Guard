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
};
