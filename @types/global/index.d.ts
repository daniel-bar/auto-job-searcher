export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT: string;
      readonly HTTP_ACCESS_IP: string;
      readonly LINKEDIN_URL: string;
    }
  }
}
