import "core-js/stable";
import "regenerator-runtime/runtime";
import { Handler, APIGatewayEvent, Context } from "aws-lambda";
import nodemailer from "nodemailer";

class Email {
  public from: string;
  public to: string;
  public subject: string;
  public text: string;

  constructor(from: string, to: string, subject: string, text: string) {
    this.from = from;
    this.to = to;
    this.text = text;
    this.subject = subject;
  }
}

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  //   console.log("queryStringParameters", event.queryStringParameters);
  if (event.httpMethod === "POST") {
    if (event.body === null)
      return {
        statusCode: 401,
        msg: "please enter from, to, subject and text",
      };

    const body: Email = JSON.parse(event.body);
    const email = new Email(body.from, body.to, body.subject, body.text);
    const transport = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_PASSWORD,
      },
    });

    await transport.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
    });
    return {
      statusCode: 200,
      body: event.body,
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: event.httpMethod,
      }),
    };
  }
};
