import axios from "axios";

import ServerGlobal from "../server-global";

import type { IRequest } from "../model/express/request/auth";
import type { IResponse, IData } from "../model/express/response/main";

const main = async (req: IRequest, res: any) => {
  ServerGlobal.getInstance().logger.info(`<main>: Start processing request`);

  axios
    .get<IResponse[]>(process.env.LINKEDIN_URL + "/?page=0")
    .then((response) => {
      const result: IData[] = [];

      response.data.forEach((item) => {
        if (
          item.location.toLowerCase().includes("rosh haayin") ||
          item.location.toLowerCase().includes("rehovot") ||
          item.location.toLowerCase().includes("haifa") ||
          item.location.toLowerCase().includes("yokneam ilit") ||
          item.location.toLowerCase().includes("yoqneam illit") ||
          item.location.toLowerCase().includes("jerusalem") ||
          item.location.toLowerCase().includes("beer-sheba") ||
          item.location.toLowerCase().includes("beer sheba") ||
          item.location.toLowerCase().includes("beer sheva") ||
          item.location.toLowerCase().includes("beer-sheva") ||
          item.location.toLowerCase().includes("kiryat malachi") ||
          item.location.toLowerCase().includes("netanya") ||
          item.title.toLowerCase().includes("senior") ||
          item.title.toLowerCase().includes("sr") ||
          item.title.toLowerCase().includes("bi") ||
          item.title.toLowerCase().includes("qa") ||
          item.title.toLowerCase().includes("quality automation") ||
          item.title.toLowerCase().includes("assurance") ||
          item.title.toLowerCase().includes("tech lead") ||
          item.title.toLowerCase().includes("team lead") ||
          item.title.toLowerCase().includes("tech leader")
        )
          return;

        if (
          item.title.toLowerCase().includes("developer") ||
          item.title.toLowerCase().includes("engineer") ||
          item.title.toLowerCase().includes("full stack") ||
          item.title.toLowerCase().includes("full-stack")
        ) {
          result.push({
            location: item.location,
            title: item.title,
            url: item.url
          });
        }
      });

      res.status(201).send(result);
    })
    .catch((error) => {
      ServerGlobal.getInstance().logger.error(
        `<main>: Failed because of error: ${error}`
      );

      res.status(500).send({
        success: false,
        message: "Server error"
      });

      return;
    });
};

export { main };
