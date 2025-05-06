export function extractJsonBlock(text: string) {
  try {
    // Extract the content between ```json ... ```
    const match = text.match(/```json\s*({[\s\S]*?})\s*```/);
    if (!match) {
      throw new Error('No valid JSON block found.');
    }

    const jsonString = match[1];
    const parsed = JSON.parse(jsonString);
    return parsed;

  } catch (error) {
    console.error('Error extracting JSON:');
    return null;
  }
}
