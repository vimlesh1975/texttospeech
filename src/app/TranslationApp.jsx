import React, { useState, useEffect, useCallback } from 'react';
import TTS from "./TTS";
import { languagelist } from './languages'


const languages = languagelist;

const TranslationApp = ({ currentText, transcript }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [loading, setLoading] = useState(false);

  const [isChecked, setIsChecked] = useState(false);





  // Memoize handleTranslate to prevent re-creating the function on every render
  const handleTranslate = useCallback(async () => {
    const text = isChecked ? transcript : currentText;

    if (!text || !targetLanguage) {
      console.log('returning')
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
  }, [isChecked, targetLanguage, currentText, transcript]); // Add all dependencies

  useEffect(() => {
    let timer;
    if (isChecked) {

      if (!loading) { // Skip if a previous translation is still in progress
        handleTranslate();
      }
      // Start the timer when the checkbox is checked
      timer = setInterval(() => {
        if (!loading) { // Skip if a previous translation is still in progress
          handleTranslate();
        }
      }, 5000); // 1-second interval
    } else {
      // Clear the timer when the checkbox is unchecked
      clearInterval(timer);
    }

    // Cleanup the timer on component unmount or when `isChecked` changes
    return () => clearInterval(timer);
  }, [isChecked, handleTranslate]);

  return (
    <div>
      <h1>Translation</h1>
      <span>Target Language</span>
      {languages.length > 0 ? (
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.code}{lang.name ? -lang.name : ''}
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

      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        Auto Translate
      </label>

      <br />
      <textarea
        rows="5"
        cols="50"
        value={translatedText}
        onChange={(e) => setTranslatedText(e.target.value)}

        placeholder="Translated text will appear here..."
      />
      {(translatedText !== '') && <TTS text={translatedText} />}

    </div>
  );
};

export default TranslationApp;
