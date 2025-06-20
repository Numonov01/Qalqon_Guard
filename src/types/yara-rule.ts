export interface YaraRuleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: YaraRule[];
}

export interface YaraRule {
  id: number;
  name: string;
  file: string;
}
