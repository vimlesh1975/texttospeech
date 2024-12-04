'use client';

import React, { useEffect, useState } from 'react';

const LanguageSelector = ({ setLanguage, language, setAudioUrl }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/list-voices');
        if (!response.ok) {
          throw new Error('Failed to fetch languages.');
        }

        const data = await response.json();
        console.log(data)
        setLanguages(data.languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return <p>Loading languages...</p>;
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <label htmlFor="language-select">Language:</label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          setAudioUrl('');
        }
        }
        style={{ marginLeft: '10px' }}
      >
        {languages.map((lang, index) => (
          <option key={index} value={lang.code}>
            {lang.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
