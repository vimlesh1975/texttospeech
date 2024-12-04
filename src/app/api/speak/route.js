// app/api/speak/route.js

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
});

export async function POST(request) {
  const { text, languageCode , name} = await request.json();
  if (!text) {
    return new Response(JSON.stringify({ error: "No text provided." }), { status: 400 });
  }

  try {
    // Configure the request for Google Cloud Text-to-Speech API
    const requestParams = {
      input: { text },
      voice: {
        languageCode,
        name
        // ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(requestParams);

    // Return the audio content as a binary stream
    return new Response(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    return new Response(JSON.stringify({ error: "Error synthesizing speech." }), { status: 500 });
  }
}
