import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { body: data } = req;
  console.log('wod data', data);
  const alreadyExists = await client.wod.findFirst({
    where: {
      createDate: data.createDate,
    },
    select: {
      id: true,
    },
  });
  if (alreadyExists) {
    await client.wod.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  }
  const wod = await client.wod.create({
    data,
  });
  res.json({ ok: true, wod });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);
