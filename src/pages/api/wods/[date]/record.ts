import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === 'POST') {
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
  } else if (req.method === 'GET') {
    const {
      query: { date },
    } = req;

    const topFiveRecordsFortheDay = await client.record.findMany({
      where: {
        wod: {
          createDate: date.toString(),
        },
      },
      orderBy: {
        amrapRound: 'desc',
      },
      take: 5,
    });
    console.log('topFiveRecordsFortheDay', topFiveRecordsFortheDay);
    res.json({
      ok: true,
      topFiveRecordsFortheDay,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'GET'],
    handler,
  })
);
