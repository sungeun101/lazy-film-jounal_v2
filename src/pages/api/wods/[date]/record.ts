import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { date },
    session: { user },
    body: { amrapRound, amrapRep, forTimeMinute, forTimeSecond },
  } = req;

  const alreadyExists = await client.record.findFirst({
    where: {
      user,
      wod: {
        createDate: date.toString(),
      },
    },
    select: {
      id: true,
    },
  });
  if (alreadyExists) {
    await client.record.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  }

  const newRecord = await client.record.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      wod: {
        connect: {
          createDate: date.toString(),
        },
      },
      amrapRound: amrapRound ? parseInt(amrapRound) : null,
      amrapRep: amrapRound && amrapRep ? parseInt(amrapRep) : amrapRound && !amrapRep ? 0 : null,
      forTimeMinute: forTimeMinute ? parseInt(forTimeMinute) : null,
      forTimeSecond:
        forTimeMinute && forTimeSecond
          ? parseInt(forTimeSecond)
          : forTimeMinute && !forTimeSecond
          ? 0
          : null,
    },
  });
  console.log('newRecord', newRecord);
  res.json({
    ok: true,
    record: newRecord,
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);
