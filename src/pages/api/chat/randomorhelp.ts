import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from 'src/libs/server/withHandler';
import { withApiSession } from 'src/libs/server/withSession';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { prompt },
  } = req;

  if (!prompt) {
    return res.status(400).json({ ok: false, error: 'Prompt missing!' });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ ok: false, error: 'Prompt too long' });
  }

  console.log('prompt', prompt);

  if (prompt === 'Create A Random Workout') {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Create a random crossfit Wod`,
      max_tokens: 200,
      temperature: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
    console.log(completion.data);
    const wodCreated = `How about this?${completion.data.choices[0].text?.replaceAll(
      '\n',
      '<br>'
    )}`;
    res.status(200).json({
      ok: true,
      answer: wodCreated,
      saveButtons: ['Super! Save This Wod', 'Create A Random Workout', 'Help Me Create One'],
    });
  } else {
    res.status(200).json({
      ok: true,
      answer: 'Ok! What movements would you like to include?',
      tags: ['Snatch', 'Run', 'Squat Clean', 'Pull-up'],
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
