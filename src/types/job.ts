export interface Job {
  id: number;
  title: string;
  company_name: string;
  job_category: string;
  whatsapp_no?: string;
  is_bookmarked?: boolean;
  job_role: string;
  primary_details: {
    Place?: string;
    Salary?: string;
    Experience?: string;
    Qualification?: string;
  };
  other_details?: string;
  email?: string;
  eligibility?: string;
  creatives?: Array<{
    file: string;
    thumb_url: string;
    creative_type: number;
  }>;
  job_tags?: Array<{
    value: string;
    bg_color: string;
    text_color: string;
  }>;
}

export interface JobsResponse {
  results: Job[];
}
