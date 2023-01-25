import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { password } = req.body;
  const foundPassword = await client.password.findUnique({
    where: {
      payload: password,
    },
  });
  if (!foundPassword) return res.status(404).end();
  req.session.user = {
    id: foundPassword.userId,
  };
  await req.session.save();
  console.log(req.session.user);
  if (req.session.user.id !== 1) {
    await client.password.deleteMany({
      where: {
        userId: foundPassword.userId,
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
);
