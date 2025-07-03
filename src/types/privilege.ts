export interface PrivilegeList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Privilege[];
}

export interface Privilege {
  id: number;
  device: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    ip_addres: string;
    bios_uuid: string;
    risk_ball: number;
    config: null | string;
    is_active: boolean;
  };
  pid: string;
  parent: string;
  detected: string;
  time: string;
  action_taken: string;
  commandline: string;
  privileges: string[];
  created_at: string;
}
