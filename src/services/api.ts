import axios from 'axios';
import { JobsResponse } from '../types/job';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

export const fetchJobs = async (): Promise<JobsResponse> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
};
