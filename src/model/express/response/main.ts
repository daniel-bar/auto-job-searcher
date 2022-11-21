interface IResponse {
  id: number;
  title: string;
  location: string;
  organization: string;
  author: string;
  timestamp: string;
  url: string;
  body: string;
}

interface IData {
  title: string;
  url: string;
  location: string;
}

export { IResponse, IData };
