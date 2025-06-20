import type { YaraRule } from 'src/types/yara-rule';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/',
});

export const fetchYaraRuleList = async (): Promise<YaraRule> => {
  try {
    const response = await api.get('/malicious_file_detects/yara-rules/');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching yara list:', error);
    throw error;
  }
};

export const createRule = async (ruleData: FormData): Promise<YaraRule> => {
  try {
    const response = await api.post('/malicious_file_detects/yara-rules/', ruleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating rule:', error);
    throw error;
  }
};

export const updateRule = async (id: number, ruleData: Partial<YaraRule>): Promise<YaraRule> => {
  try {
    const response = await api.patch(`/malicious_file_detects/yara-rules/${id}/`, ruleData);
    return response.data;
  } catch (error) {
    console.error('Error updating rule:', error);
    throw error;
  }
};

export const fetchYaraRuleById = async (id: number): Promise<YaraRule> => {
  const response = await api.get(`/malicious_file_detects/yara-rules/${id}/`);
  return response.data;
};

export const deleteRule = async (id: number): Promise<void> => {
  try {
    await api.delete(`/malicious_file_detects/yara-rules/${id}/`);
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }
};
