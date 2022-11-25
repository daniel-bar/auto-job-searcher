export interface IData {
  id?: number;
  title: string;
  location: string;
  organization?: { id: number; name: string };
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
