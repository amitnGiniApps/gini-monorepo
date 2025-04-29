import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const path = require('path');


const client = new OpenAI({
  apiKey: process.env.OPENAI_CONFIGURATION_KEY,
});

function createPrompt(existingHtml: string): string {
  return `
Please review the following FullCalendar-based HTML app. I’d like you to make or suggest enhancements that are compatible with FullCalendar v6.1.8 and won’t break the UI.
You may:

Add new features (like tooltips, custom buttons, event filters, or view switchers)

Apply new styles (like hover effects, dark mode toggle, font size changes, or color themes)
add new elements in the screen but not broke the ui
Enhance the event display (e.g., show icons, use popovers instead of alerts)
Please ensure all changes work well with the current layout, are accessible, and maintain responsiveness.
- return only html without the comments

${existingHtml}
Return the full updated HTML:
`;
}

export const generateProject = async (formData: any) => {
  console.log(formData);
  try {
    const filePath = path.resolve(__dirname, '../public/calendar.html');
    const existingHtml = fs.readFileSync(filePath, 'utf-8');

    const prompt = createPrompt(existingHtml);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const output = response.choices[0].message?.content?.replace(/^```(?:html|jsx)?\s*/i, '')?.replace(/```$/, '');
    console.log(output);
    return output;
  } catch (error: any) {
    console.error('❌ Error generating project:', error);
    throw new Error('Failed to generate project');
  }
};
