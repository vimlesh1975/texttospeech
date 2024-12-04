'use client';

import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './components/LanguageSelector';

export default function Home() {
  const [text, setText] = useState(
    `भारत आणि पोलंड यांच्यातल्या घनिष्ट राजनैतिक संबंधांना ७० वर्षे पूर्ण होत  असतांना आपली पोलंड भेट विशेष महत्वाची असेल, असं पंतप्रधान नरेंद्र मोदी यांनी म्हटलं आहे.`
  );
  const [language, setLanguage] = useState('mr-IN');
  const [gender, setGender] = useState('FEMALE');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const audioRef = useRef(null);

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert('Please enter some text!');
      return;
    }

    setLoading(true);
    setAudioUrl('');

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, languageCode: language, gender }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      alert('Failed to generate speech.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Text-to-Speech</h1>

      <textarea
        rows="10"
        cols="50"
        placeholder="Enter text to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />

      <LanguageSelector setLanguage={setLanguage} language={language} />

      <div style={{ marginBottom: '10px' }}>
        <label>
          Gender:
          <input
            type="radio"
            name="gender"
            value="MALE"
            checked={gender === 'MALE'}
            onChange={() => setGender('MALE')}
          />
          Male
          <input
            type="radio"
            name="gender"
            value="FEMALE"
            checked={gender === 'FEMALE'}
            onChange={() => setGender('FEMALE')}
          />
          Female
        </label>
      </div>

      <label htmlFor="autoPlay">
        <input
          type="checkbox"
          id="autoPlay"
          checked={autoPlay}
          onChange={() => setAutoPlay((val) => !val)}
        />
        Auto Play
      </label>
      <button onClick={handleSpeak} style={{ padding: '10px 20px' }} disabled={loading}>
        {loading ? 'Loading...' : 'Speak'}
      </button>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <audio
            controls
            src={audioUrl}
            autoPlay={autoPlay}
            ref={audioRef}
          ></audio>
          <br />
          <button
            style={{ marginTop: '10px', padding: '5px 10px' }}
            onClick={() => {
              const a = document.createElement('a');
              a.href = audioUrl;
              a.download = 'speech.mp3';
              a.click();
            }}
          >
            Download Audio
          </button>
          <br />
          <label style={{ marginTop: '10px', display: 'block' }}>
            Playback Speed: {playbackSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            style={{ width:100}}
          />
        </div>
      )}
    </div>
  );
}
