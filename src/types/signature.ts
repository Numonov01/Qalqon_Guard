export interface SignatureResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Signature[];
}

export interface Signature {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  sha256: string;
  md5: string;
  file_type: string;
}
