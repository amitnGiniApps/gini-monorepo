import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();  // Loads environment variables from .env file

const client = new OpenAI({
  apiKey: process.env.OPENAI_CONFIGURATION_KEY,
});

function createPrompt(data: any): string {
  return `
Create a complete responsive HTML page with internal CSS only, no JavaScript.

Use the following preferences:
- Project Name: ${data.projectName}
- Theme: ${data.theme}
- Font: ${data.font}
- Primary color: ${data?.primaryColor ?? 'default green'}
- Logo: ${data.logo ? 'User will provide logo' : 'No logo'}

Sections to include: ${data.sections.join(', ')}

Details per section:
${data.sections
    .map((section: any) => {
      const sectionData = data[section];
      if (!sectionData) return '';
      if (Array.isArray(sectionData)) {
        return `- ${section}:
${sectionData.map((item, i) => `  ${i + 1}. ${JSON.stringify(item)}`).join('\n')}`;
      } else {
        return `- ${section}: ${JSON.stringify(sectionData, null, 2)}`;
      }
    })
    .join('\n')}

Output valid HTML code only.
  `.trim();
}

export const generateProject = async (formData: any) => {
  try {

    const prompt = createPrompt(formData);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend developer. Based on the user\'s input, generate a clean and well-structured responsive one-page HTML template. Do not include explanations — return only the HTML content. Include inline styles or minimal CSS in <style> tags. Use only light green as the main color theme.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const output = response.choices[0].message?.content;

    console.log(output);
    return output;
  } catch (error: any) {
    console.error('❌ Error generating project:', error);
    console.error(error.response?.statusText);
    throw new Error('Failed to generate project');
  }
};

