import type { Signature } from 'src/types/signature';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/',
});

export const fetchSignatureList = async (): Promise<Signature[]> => {
  try {
    const response = await api.get('/malicious_file_detects/signatures/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching signature list:', error);
    throw error;
  }
};

export const createSignature = async (signatureData: FormData): Promise<Signature> => {
  try {
    const response = await api.post('/malicious_file_detects/signatures/', signatureData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating signature:', error);
    throw error;
  }
};

export const updateSignature = async (
  id: number,
  signatureData: Partial<Signature>
): Promise<Signature> => {
  try {
    const response = await api.patch(`/malicious_file_detects/signatures/${id}/`, signatureData);
    return response.data;
  } catch (error) {
    console.error('Error updating signature:', error);
    throw error;
  }
};

export const fetchSignatureById = async (id: number): Promise<Signature> => {
  try {
    const response = await api.get(`/malicious_file_detects/signatures/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching signature by id:', error);
    throw error;
  }
};

export const deleteSignature = async (id: number): Promise<void> => {
  try {
    await api.delete(`/malicious_file_detects/signatures/${id}/`);
  } catch (error) {
    console.error('Error deleting signature:', error);
    throw error;
  }
};
