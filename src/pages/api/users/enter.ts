import { NextApiRequest, NextApiResponse } from 'next';
import client from 'src/libs/server/client';
import smtpTransport from 'src/libs/server/email';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { firstName, lastName, email } = req.body;
  if (!email) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + '';
  await client.password.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            email,
          },
          create: {
            firstName: firstName ?? 'Anonymous',
            lastName: lastName ?? '',
            email,
          },
        },
      },
    },
  });
  // const mailOptions = {
  //   from: process.env.MAIL_ID,
  //   to: email,
  //   subject: 'Lazy Film Journal Authentication Email',
  //   html: `<div>Authentication Code : <strong>${payload}</strong></div>`,
  // };
  // const result = smtpTransport.sendMail(mailOptions, (error, responses) => {
  //   if (error) {
  //     return null;
  //   } else {
  //     return null;
  //   }
  // });
  // smtpTransport.close();
  // console.log(result);

  return res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ['POST'],
  handler,
  isPrivate: false,
});
