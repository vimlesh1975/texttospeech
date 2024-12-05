import { TranslationServiceClient } from '@google-cloud/translate';
const credentials=JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const client = new TranslationServiceClient({
  credentials
});
// console.log(client);

export async function POST(request) {
  const { text, targetLanguage } = await request.json();

  if (!text || !targetLanguage) {
    return new Response(JSON.stringify({ error: 'Text and target language are required.' }), { status: 400 });
  }

  try {
    const projectId =credentials.project_id;
    const location = 'global'; // Use 'global' for non-regionalized translations
    const parent = `projects/${projectId}/locations/${location}`;

    const [response] = await client.translateText({
      contents: [text],
      targetLanguageCode: targetLanguage,
      parent,
    });

    const translatedText = response.translations[0].translatedText;

    return new Response(JSON.stringify({ translatedText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to translate text.' }), { status: 500 });
  }
}
