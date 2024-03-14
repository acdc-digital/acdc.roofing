// /Users/matthewsimon/Documents/GitHub/acdc.roofing/my-app/src/api/send-email.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = req.body;

    // You should validate the email here

    const msg = {
      to: 'msimon@acdc.digital', // Enclosed in quotes
      from: 'msimon@acdc.digital', // Enclosed in quotes
      subject: 'Subscription Confirmation',
      text: 'You are now subscribed to our newsletter.',
    };

    await sgMail.send(msg);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }

    res.status(500).json({ error: 'Failed to send email' });
  }
}