import airDB from 'services/airtableClient';
import Joi from 'joi';
import nodemailer from 'nodemailer';

const schema = Joi.object({
  receiverId: Joi.string(),
  senderEmail: Joi.string().email().required(),
  message: Joi.string().required()
});

const sendMessage = async (payload) => {
  const { receiverId, senderEmail, message } = await schema.validateAsync(payload);

  const receiver = await airDB('users').find(receiverId);
  const [sender] = await airDB('users')
    .select({
      filterByFormula: `email="${senderEmail}"`
    })
    .firstPage();

  if (!sender) return null;

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'carolanne.feeney86@ethereal.email',
      pass: '9trXGtYkvEFtyv2dG6'
    }
  });

  let response = await transporter.sendMail({
    from: `messages@yachtingapp.com`,
    to: `${receiver.fields.email}`,
    subject: `Message from Yachting APP from user: ${sender.fields.fullName}(${senderEmail})`,
    html: `Hey ${receiver.fields.fullName}! <br/> This is message from ${sender.fields.fullName}: <p>
        ${message}
    </p>`
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('E-mail sent, Preview URL: ', nodemailer.getTestMessageUrl(response));
  }

  return null;
};

export default sendMessage;
