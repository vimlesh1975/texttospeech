'use client';

import { useState, useRef, useEffect } from 'react';
import TranslationApp from './TranslationApp'
import TTS from "./TTS";

const Page = () => {
    const [text, setText] = useState(
        `भारत आणि पोलंड यांच्यातल्या घनिष्ट राजनैतिक संबंधांना ७० वर्षे पूर्ण होत  असतांना आपली पोलंड भेट विशेष महत्वाची असेल, असं पंतप्रधान नरेंद्र मोदी यांनी म्हटलं आहे.`
    );
    return (
        <div style={{ display: 'flex' }}>
            <div style={{border:'1px solid red'}}>
                <textarea
                    rows="10"
                    cols="50"
                    placeholder="Enter text to speak..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
           
                <TTS text={text} />
            </div>
            <div style={{fontSize:100}}>{'>'}</div>
            <div style={{border:'1px solid red'}}>
                <TranslationApp text={text} />
            </div>
        </div>
    )
}

export default Page