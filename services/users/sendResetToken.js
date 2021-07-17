import airDB from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const schema = Joi.object({
  email: Joi.string().email().required()
});

const sendResetToken = async (payload) => {
  const { email } = await schema.validateAsync(payload);

  let [user] = await airDB('users')
    .select({
      filterByFormula: `email="${email}"`
    })
    .firstPage();

  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');

  user = await airDB('users').update([
    {
      id: user.id,
      fields: { resetToken }
    }
  ]);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'carolanne.feeney86@ethereal.email',
      pass: '9trXGtYkvEFtyv2dG6'
    }
  });

  let response = await transporter.sendMail({
    from: 'sender@server.com', // sender address
    to: `${email}`, // list of receivers
    subject: 'Change your password', // Subject line
    html: `Hey! <br/> Please change your password here: 
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/users/updatePassword?token=${resetToken}">
        ${process.env.NEXT_PUBLIC_BASE_URL}/forgotPassword?token=${resetToken}
    </a>` // html body
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('E-mail sent, Preview URL: ', nodemailer.getTestMessageUrl(response));
  }
  return resetToken;
};

export default sendResetToken;
