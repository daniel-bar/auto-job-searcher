import express from "express";

interface IServerResponse {
  success: boolean;
  message: string;
}

export type IResponse = express.Response<
  IServerResponse & {
    data?: {
      location: string;
      title: string;
      url: string;
    }[];
  }
>;

type IRegisterResponse = express.Response<
  IServerResponse & {
    data?: {
      username: string;
      email: string;
      token: string;
    };
  }
>;
