'use client';

import { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';

export default function Home() {
  const [text, setText] = useState(
    `भारत आणि पोलंड यांच्यातल्या घनिष्ट राजनैतिक संबंधांना ७० वर्षे पूर्ण होत  असतांना आपली पोलंड भेट विशेष महत्वाची असेल, असं पंतप्रधान नरेंद्र मोदी यांनी म्हटलं आहे. पोलंड आणि युक्रेन दौऱ्यावर रवाना होण्यापूर्वी जारी केलेल्या निवेदनात त्यांनी हे सांगितलं. लोकशाही आणि सर्वसमावेशक तत्त्वांप्रती असलेली सामायिक वचनबद्धता दोन्ही देशांमधले संबंध वृद्धिंगत करणारी आहे, असं पंतप्रधान म्हणाले. पोलंडचे राष्ट्रपती आणि पंतप्रधानांशी चर्चा करायला आपण उत्सुक असल्याचं त्यांनी सांगितलं. पंतप्रधान आज आणि उद्या  पोलंडला भेट देणार असून गेल्या ४५ वर्षांमध्ये भारतीय पंतप्रधानांची पोलंडची ही पहिली भेट असेल. ते पोलंडचे राष्ट्रपती आंद्रेज सेबॅस्टियन डुडा आणि पंतप्रधान डोनाल्ड टस्क यांच्याशी द्विपक्षीय चर्चा करतील. याशिवाय पंतप्रधान पोलंड मधल्या भारतीय समुदायाशी संवाद साधतील.
त्यानंतर पंतप्रधान युक्रेनसाठी प्रस्थान करतील. युक्रेन आणि भारत या दोन देशांमध्ये १९९२ मध्ये निर्माण झालेल्या द्विपक्षीय धोरणात्मक संबंधांनंतर भारतीय पंतप्रधानांची ही पहिलीच युक्रेन भेट असेल.
  भारत आणि युक्रेन यांच्यातलं द्विपक्षीय सहकार्य द्विगुणित करण्यासाठी युक्रेनचा दौरा लाभदायी ठरेल,असं पंतप्रधानांनी आपल्या निवेदनात म्हटलं आहे. सध्या सुरु असलेल्या युक्रेन - रशिया संघर्षात शांततामय मार्गानं तोडगा काढण्यासाठी भारताची कशाप्रकारे मदत होऊ शकेल, याचाही विचार या दौऱ्यात करण्याची संधी मिळेल, भविष्यात या दोन्ही देशांचे भारताबरोबरचे संबंध अधिकाधिक दृढ होत जातील, असंही पंतप्रधानांनी म्हटलं आहे. `
  );
  const [language, setLanguage] = useState('mr-IN');
  const [gender, setGender] = useState('NEUTRAL');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Text-to-Speech in Multiple Indian Languages</h1>

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
          <input
            type="radio"
            name="gender"
            value="NEUTRAL"
            checked={gender === 'NEUTRAL'}
            onChange={() => setGender('NEUTRAL')}
          />
          Neutral
        </label>
      </div>

      <button onClick={handleSpeak} style={{ padding: '10px 20px' }} disabled={loading}>
        {loading ? 'Loading...' : 'Speak'}
      </button>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
