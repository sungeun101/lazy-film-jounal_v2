import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { date },
  } = req;
  console.log('req', req?.query);
  if (date) {
    const wod = await client.wod.findUnique({
      where: { createDate: date.toString() },
      include: {
        records: {
          select: {
            id: true,
            amrapRound: true,
            amrapRep: true,
            forTimeMinute: true,
            forTimeSecond: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          take: 5,
          orderBy: [
            {
              amrapRound: 'desc',
            },
            {
              forTimeMinute: 'asc',
            },
          ],
        },
        _count: {
          select: {
            records: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      wod,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
