export type BrightDataResponse = Root2[]

export interface Root2 {
  input: Input
  id: string
  name: string
  city: string
  country_code: string
  about: string
  current_company: CurrentCompany
  experience?: Experience[]
  url: string
  people_also_viewed: PeopleAlsoViewed[]
  educations_details: string
  education: Education[]
  avatar: string
  followers: number
  connections: number
  current_company_company_id: string
  current_company_name: string
  organizations?: Organization[]
  location?: string
  input_url: string
  linkedin_id: string
  activity: Activity[]
  linkedin_num_id: string
  banner_image: string
  honors_and_awards: any
  similar_profiles: SimilarProfile[]
  timestamp: string
  position?: string
  languages?: Language[]
  certifications?: Certification[]
  recommendations_count?: number
  recommendations?: string[]
  volunteer_experience?: VolunteerExperience[]
  courses?: Course[]
  projects?: Project[]
}

export interface Input {
  url: string
}

export interface CurrentCompany {
  link: string
  name: string
  company_id: string
  title?: string
}

export interface Experience {
  title: string
  description_html: any
  duration: string
  start_date?: string
  end_date?: string
  duration_short?: string
  company: string
  company_id?: string
  url?: string
  company_logo_url?: string
  positions?: Position[]
  location?: string
}

export interface Position {
  subtitle: string
  meta: string
  description: string
  duration: string
  start_date: string
  end_date: string
  duration_short: string
  title: string
  description_html: string
}

export interface PeopleAlsoViewed {
  profile_link: string
  name: string
  about?: string
  location?: string
}

export interface Education {
  title?: string
  url?: string
  start_year: string
  end_year: string
  description: any
  description_html: any
  institute_logo_url?: string
}

export interface Organization {
  title: string
  membership_type: string
  start_date: string
  end_date: string
  membership_number: any
}

export interface Activity {
  interaction?: string
  link: string
  title: string
  img?: string
  id: string
}

export interface SimilarProfile {
  url: string
  name: string
  title?: string
  url_text: string
}

export interface Language {
  subtitle: string
  title: string
}

export interface Certification {
  subtitle: string
  title: string
}

export interface VolunteerExperience {
  cause: string
  duration: string
  duration_short: string
  end_date: string
  info: string
  start_date: string
  subtitle: string
  title: string
}

export interface Course {
  subtitle: string
  title: string
}

export interface Project {
  title: string
  start_date: string
  end_date: string
  description: string
}
