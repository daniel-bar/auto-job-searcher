export interface IData {
  id?: number;
  title: string;
  location: string;
  organization?: string;
  author?: string;
  timestamp?: string;
  url: string;
  body?: string;
}

export interface IContactDetails {
  email: string;
  title: string;
  author?: string;
}
