import React, { useState, useEffect } from 'react';
import TTS from "./TTS";


const TranslationApp = ({text}) => {
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch supported languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages');
        if (!response.ok) throw new Error('Failed to fetch languages');
        const data = await response.json();
        setLanguages(data.languages);
        // setTargetLanguage(data.languages[0]?.code || ''); // Default to the first language
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!text || !targetLanguage) {
      alert('Please enter text and select a target language!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      });

      if (response.ok) {
        const { translatedText } = await response.json();
        setTranslatedText(translatedText);
      } else {
        alert('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error translating text:', error);
      alert('Error translating text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span>Target Language</span>
      {languages.length > 0 ? (
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.code}{lang.name?-lang.name:''}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading languages...</p>
      )}
      <br />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      <br />
      <textarea
        rows="5"
        cols="50"
        value={translatedText}
        onChange={(e) => setTranslatedText(e.target.value)}
        
        placeholder="Translated text will appear here..."
      />
          { (translatedText!=='') && <TTS text={translatedText} />}

    </div>
  );
};

export default TranslationApp;
