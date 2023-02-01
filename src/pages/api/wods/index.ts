import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { createDate, type, title, content },
  } = req;
  console.log('submit', createDate, type, title, content);
  const wod = await client.wod.create({
    data: {
      createDate: createDate.slice(0, 10),
      type,
      title,
      content,
    },
  });
  res.json({ ok: true, wod });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);
