import { IRecord } from '../../../../sections/@dashboard/real/workout/WodNewForm';
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import client from 'src/libs/server/client';
import { withApiSession } from 'src/libs/server/withSession';
import { TopFiveRecord } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === 'POST') {
    const {
      query: { date },
      session: { user },
      body,
    } = req;

    //1.기존에 저장된 topfive의 user rank 수정
    const topFives = await client.topFiveRecord.findMany();
    console.log('기존 topFive -> ', topFives);
    if (topFives && topFives.length > 0) {
      const updatePreviousRank = topFives.map(
        async (record: TopFiveRecord, index: number, array: TopFiveRecord[]) => {
          await client.user.update({
            where: {
              id: record.userId,
            },
            data: {
              rank: {
                increment: index + 1,
              },
            },
          });
        }
      );
      await Promise.all(updatePreviousRank);
      console.log('1.기존에 저장된 topfive의 user rank 수정');

      // 2. 기존 topfive 전부 삭제
      await client.topFiveRecord.deleteMany();
      console.log('2. topfive 전부 삭제');
    }

    // 3. 새로운 topfive 저장
    const saveTopFive = body.map(async (record: IRecord, index: number) => {
      await client.topFiveRecord.create({
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
          amrapRound: record.amrapRound ?? null,
          amrapRep:
            record.amrapRound && record.amrapRep
              ? record.amrapRep
              : record.amrapRound && !record.amrapRep
              ? 0
              : null,
          forTimeMinute: record.forTimeMinute ? record.forTimeMinute : null,
          forTimeSecond:
            record.forTimeMinute && record.forTimeSecond
              ? record.forTimeSecond
              : record.forTimeMinute && !record.forTimeSecond
              ? 0
              : null,
        },
      });
    });
    await Promise.all(saveTopFive);
    console.log('3. topfive 저장', body);

    // 4. 새로운 topfive의 user rank 수정
    const updateUserRank = body.map(async (record: IRecord, index: number) => {
      const updatedUser = await client.user.update({
        where: {
          id: record.user.id,
        },
        data: {
          rank: {
            decrement: index + 1,
          },
        },
      });
      console.log('updatedUser', updatedUser);
    });
    await Promise.all(updateUserRank);
    console.log('4. 새로운 topfive의 user rank 수정');

    // 5. update user score submit
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        dailyScoreSubmit: {
          decrement: 1,
        },
      },
    });
    console.log('5. update user score submit');

    res.json({
      ok: true,
    });
  } else if (req.method === 'GET') {
    // const featured = await client.wod.findMany({
    //   orderBy: {
    //     rank: 'asc',
    //   },
    //   take: 5,
    // });
    const scoreSubmitFeatured = await client.user.findMany({
      orderBy: {
        dailyScoreSubmit: 'asc',
      },
      take: 5,
    });
    res.json({
      ok: true,
      scoreSubmitFeatured,
      // featured,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);
