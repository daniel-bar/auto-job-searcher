import axios from "axios";
import nodemailer from "nodemailer";

import ServerGlobal from "../server-global";
import { extractEmails } from "../utils/email";

import type { IRequest } from "../model/express/request/auth";
import type { IResponse } from "../model/express/response/main";
import type { IData, IContactDetails } from "../model/main";

const main = async (req: IRequest, res: IResponse) => {
  ServerGlobal.getInstance().logger.info(`<main>: Start processing request`);

  axios
    .get<IData[]>(process.env.LINKEDIN_URL + "/?page=0")
    .then((response) => {
      const result: IData[] = [];
      const contactDetails: IContactDetails[] = [];

      response.data.forEach((item) => {
        // Check if item exist
        if (!item) return;

        // Exclude unwanted jobs from response, base on locations & titles
        const unwantedTitles =
          /senior|sr|bi|qa|quality automation|assurance|tech lead|team lead|tech leader|lead|staff|devops|algorithm|android|principal|automation|go|system|head|c#|.net|machine/;

        const unwantedLocations =
          /rosh haayin|rehovot|haifa|yokneam ilit|yoqneam illit|jerusalem|beer-sheba|beer sheba|beer sheva|beer-sheva|kiryat malachi|dimona|netanya|north|nes ziona|kiryat gat/;

        const isUnwantedLocationIncluded = unwantedLocations.test(
          item.location.toLowerCase()
        );

        const isUnwantedTitleIncluded = unwantedTitles.test(
          item.title.toLowerCase()
        );

        if (isUnwantedLocationIncluded || isUnwantedTitleIncluded) return;

        // Include wanted jobs from response, base on titles
        const wantedTitles = /developer|engineer|full-stack|full stack/;

        const isWantedTitleIncluded = wantedTitles.test(
          item.title.toLowerCase()
        );

        if (isWantedTitleIncluded) {
          const email = extractEmails(item.body!);

          // Check if mail exist in body
          if (email)
            contactDetails.push({
              email,
              title: item.title,
              author: item.author
            });

          result.push({
            location: item.location,
            title: item.title,
            url: item.url
          });
        }
      });

      const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "daniel45001@gmail.com",
          pass: process.env.NODEMAILER_PASSWORD
        }
      });

      contactDetails.forEach((item) => {
        const mailOptions = {
          from: "daniel45001@gmail.com",
          to: item.email,
          subject: `Applying for ${item.title}`,
          html: `
                  <h3>
                    Hey, I saw the position on LinkedIn & I would like to have the opportunity to apply for the position, I'm sure I'll be a great fit. <br/>
                    I attached my resume to the email. <br/>
                    Feel free to contact me via phone: 0533373546 or this email. <br/><br/>
                    Sincerely, <br/>
                    Daniel Bar
                  </h3>
                `,
          attachments: [
            {
              filename: "Daniel_CV.pdf",
              path: "assets/Daniel_CV.pdf",
              contentType: "application/pdf"
            }
          ]
        };

        // mailTransporter.sendMail(mailOptions, (error) => {
        //   if (error) {
        //     ServerGlobal.getInstance().logger.error(
        //       `<main>: Failed because of error: ${error}`
        //     );

        //     return res.status(500).send({
        //       success: false,
        //       message: "Nodemailer error"
        //     });
        //   }
        // });
      });

      ServerGlobal.getInstance().logger.info(
        "<main>: Successfully sent emails to jobs that include email"
      );

      const jobList = result
        .map((item) => {
          return `Title: ${item.title}, \n
Location: ${item.location}, \n
Company name: ${item.organization}, \n
Company name: ${item.url}, \n
`;
        })
        .join("\n");

      const mailOptions = {
        from: "daniel45001@gmail.com",
        to: "daniel45001@gmail.com",
        subject: `Job List`,
        text: `${jobList}`
      };

      // mailTransporter.sendMail(mailOptions, (error) => {
      //   if (error) {
      //     ServerGlobal.getInstance().logger.error(
      //       `<main>: Failed because of error: ${error}`
      //     );

      //     return res.status(500).send({
      //       success: false,
      //       message: "Nodemailer error"
      //     });
      //   }
      // });

      return res.status(201).send({
        success: true,
        message: "Successfully got jobs list & sent emails",
        data: { ...result }
      });
    })
    .catch((error) => {
      ServerGlobal.getInstance().logger.error(
        `<main>: Failed because of error: ${error}`
      );

      return res.status(500).send({
        success: false,
        message: "Server error"
      });
    });
};

export { main };
