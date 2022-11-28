export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT: string;
      readonly HTTP_ACCESS_IP: string;
      readonly LINKEDIN_URL: string;
      readonly NODEMAILER_PASSWORD: string;
      readonly LINKEDIN_EMAIL: string;
      readonly LINKEDIN_PASSWORD: string;
    }
  }
}
