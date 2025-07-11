import type { PrivilegeList } from 'src/types/privilege';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchPrivilegeList = async (page = 1, search = ''): Promise<PrivilegeList> => {
  try {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await api.get(`/privilage_escalation/privilage-escalation/?page=${page}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching privilege list:', error);
    throw error;
  }
};
