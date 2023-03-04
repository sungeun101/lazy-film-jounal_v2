import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const topFiveUsers = await client.user.findMany({
    where: {
      dailyScoreSubmit: {
        lt: 0,
      },
    },
    orderBy: [
      {
        rank: 'asc',
      },
      {
        dailyScoreSubmit: 'asc',
      },
    ],
    take: 5,
  });

  res.json({
    ok: true,
    topFiveUsers,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
