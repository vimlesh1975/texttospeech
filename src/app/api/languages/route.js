import { TranslationServiceClient } from '@google-cloud/translate';

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const client = new TranslationServiceClient({
  credentials,
});

export async function GET() {
  try {
    const projectId = credentials.project_id;
    const location = 'global'; // Use 'global' for non-regionalized translations
    const parent = `projects/${projectId}/locations/${location}`;

    const [response] = await client.getSupportedLanguages({ parent });
    const languages = response.languages.map((lang) => ({
      code: lang.languageCode,
      name: lang.displayName,
    }));

    return new Response(JSON.stringify({ languages }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch supported languages.' }), { status: 500 });
  }
}
