import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_CONFIGURATION_KEY,
});

export const generateProject = async () => {
  try {
    const response = await client.responses.create({
      model: 'gpt-4o',
      instructions: 'You are a coding assistant that talks like a pirate',
      input: 'Are semicolons optional in JavaScript?',
    });

    console.log(response.output_text);

  } catch (error: any) {
    console.log('error');
    console.log(error);
    console.log(error.response.statusText);
  }
};

