import { fetch } from '../utils/fetch';

export const patchProfile = async (data: { name: string; phone: string; avatar: string }) => {
  try {
    const response = await fetch('/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};