/**
 * Email functionality using nodemailer
 */

import nodemailer from 'nodemailer';

const appUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000';

// Create transporter (configure based on your email provider)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendPledgeConfirmationEmail(email: string, pledgeId: string): Promise<void> {
  const editUrl = `${appUrl}/pledge/${pledgeId}/edit`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'IRC26 <no-reply@irc26.example>',
      to: email,
      subject: 'Your IRC26 Pledge Has Been Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for pledging a cache for IRC26!</h2>
          <p>Your pledge has been received and recorded.</p>
          <p>You can view and edit your pledge at any time:</p>
          <p style="margin: 20px 0;">
            <a href="${editUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Edit Your Pledge
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            ${editUrl}
          </p>
        </div>
      `,
      text: `Thank you for pledging a cache for IRC26!\n\nYou can edit your pledge here: ${editUrl}`,
    });
  } catch (error) {
    console.error('Error sending pledge confirmation email:', error);
    // Don't throw - email failures shouldn't break the flow
    // Log to console as fallback
    console.log('='.repeat(60));
    console.log('EMAIL: Pledge Confirmation (failed to send, logged instead)');
    console.log('To:', email);
    console.log('Subject: Your IRC26 Pledge Has Been Received');
    console.log(`Edit URL: ${editUrl}`);
    console.log('='.repeat(60));
  }
}

export async function sendSubmissionConfirmationEmail(email: string, submissionId: string): Promise<void> {
  const editUrl = `${appUrl}/submission/${submissionId}/edit`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'IRC26 <no-reply@irc26.example>',
      to: email,
      subject: 'Your IRC26 Submission Has Been Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for submitting your cache confirmation for IRC26!</h2>
          <p>Your submission has been received and recorded.</p>
          <p>You can view and edit your submission at any time:</p>
          <p style="margin: 20px 0;">
            <a href="${editUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Edit Your Submission
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            ${editUrl}
          </p>
        </div>
      `,
      text: `Thank you for submitting your cache confirmation for IRC26!\n\nYou can edit your submission here: ${editUrl}`,
    });
  } catch (error) {
    console.error('Error sending submission confirmation email:', error);
    // Don't throw - email failures shouldn't break the flow
    // Log to console as fallback
    console.log('='.repeat(60));
    console.log('EMAIL: Submission Confirmation (failed to send, logged instead)');
    console.log('To:', email);
    console.log('Subject: Your IRC26 Submission Has Been Received');
    console.log(`Edit URL: ${editUrl}`);
    console.log('='.repeat(60));
  }
}





