import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

type IEmail = {
  title: string;
  email: string;
  text: string;
};

@Injectable()
export class EmailService {
  public async send({ email, text, title }: IEmail) {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
    });

    await transporter.sendMail({
      to: email,
      subject: title,
      html: text,
    });
  }
}
