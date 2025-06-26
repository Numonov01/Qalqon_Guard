export interface DriverLoadList {
  count: number;
  next: null;
  previous: null;
  results: DriverLoad[];
}

export interface DriverLoad {
  id: number;
  full_data: string;
  device_info: {
    id: number;
    name: string;
    ip_address: string;
    bios_uuid: string;
  };
  created_at: string;
}
