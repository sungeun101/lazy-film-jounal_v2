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
      body,
    } = req;
    //1.기존에 저장된 topfive의 user rank 수정
    const previousTopFives = await client.topFiveRecord.findMany({
      where: {
        wod: {
          createDate: date.toString(),
        },
      },
    });
    console.log('해당 날짜 기존 topFive -> ', previousTopFives);
    if (previousTopFives && previousTopFives.length > 0) {
      const updatePreviousRank = previousTopFives.map(
        async (record: TopFiveRecord, index: number, array: TopFiveRecord[]) => {
          const updatedUser = await client.user.update({
            where: {
              id: record.userId,
            },
            data: {
              rank: {
                increment: array.length - index,
              },
            },
          });
          console.log(
            'rank 수정될 유저 아이디: ',
            record.userId,
            ', 더하기: ',
            array.length - index
          );
          console.log('updatedUser', updatedUser);
        }
      );
      await Promise.all(updatePreviousRank);
      console.log('1.기존에 저장된 topfive의 user rank 수정');

      // 2. 기존 topfive 전부 삭제
      await client.topFiveRecord.deleteMany({
        where: {
          wod: {
            createDate: date.toString(),
          },
        },
      });
      console.log('2. 기존 topfive 해당 날짜 전부 삭제');
    }

    // 3. 새로운 topfive 저장
    const saveTopFive = body.map(async (record: any, index: number) => {
      await client.topFiveRecord.create({
        data: {
          user: {
            connect: {
              id: record.userId,
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
    console.log('3. 새로운 topfive 저장 => ', body);

    // 4. 새로운 topfive의 user rank 수정
    const updateUserRank = body.map(
      async (record: TopFiveRecord, index: number, array: TopFiveRecord[]) => {
        const updatedUser = await client.user.update({
          where: {
            id: record.userId,
          },
          data: {
            rank: {
              decrement: array.length - index,
            },
          },
        });
        console.log('rank 수정될 유저 아이디: ', record.userId, ', 빼기: ', array.length - index);
        console.log('updatedUser', updatedUser);
      }
    );
    await Promise.all(updateUserRank);
    console.log('4. 새로운 topfive의 user rank 수정');

    res.json({
      ok: true,
    });
  } else if (req.method === 'GET') {
    const scoreSubmitFeatured = await client.user.findMany({
      orderBy: {
        dailyScoreSubmit: 'asc',
      },
      take: 5,
    });
    res.json({
      ok: true,
      scoreSubmitFeatured,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);
