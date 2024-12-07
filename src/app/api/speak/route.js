// app/api/speak/route.js

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
});


function splitText(text, maxBytes = 4000) {
  const chunks = [];
  let currentChunk = '';

  // Include all common Indian sentence-ending characters
  const sentenceDelimiterRegex = /(?<=[.?!।|।۔])\s*/g;

  // Split text by sentence-ending punctuation
  const sentences = text.split(sentenceDelimiterRegex);

  sentences.forEach((sentence) => {
    const encodedLength = new TextEncoder().encode(currentChunk + sentence).length;

    if (encodedLength > maxBytes) {
      // Add the current chunk to chunks array if it exceeds the limit
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // Handle cases where a single sentence exceeds maxBytes
      const sentenceBytes = new TextEncoder().encode(sentence).length;
      if (sentenceBytes > maxBytes) {
        let remaining = sentence;

        while (new TextEncoder().encode(remaining).length > maxBytes) {
          let part = remaining.slice(0, maxBytes);
          chunks.push(part.trim());
          remaining = remaining.slice(maxBytes);
        }

        currentChunk = remaining;
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence + ' ';
    }
  });

  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}


export async function POST(request) {
  const { text, languageCode, name } = await request.json();

  if (!text) {
    return new Response(JSON.stringify({ error: 'No text provided.' }), { status: 400 });
  }

  try {
    const chunks = splitText(text);
    const audioChunks = [];

    for (const chunk of chunks) {
      const [response] = await client.synthesizeSpeech({
        input: { text: chunk },
        voice: { languageCode, name },
        audioConfig: { audioEncoding: 'MP3' },
      });
      audioChunks.push(response.audioContent);
    }

    // Concatenate audio chunks
    const combinedAudio = Buffer.concat(audioChunks.map((chunk) => Buffer.from(chunk, 'base64')));

    return new Response(combinedAudio, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return new Response(JSON.stringify({ error: 'Error synthesizing speech.' }), { status: 500 });
  }
}
