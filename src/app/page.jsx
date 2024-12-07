'use client';

import { useState } from 'react';
import 'regenerator-runtime/runtime'

import SpeechToText from "./SpeechToText";

const Page = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div>
                <SpeechToText />
            </div>
            <div style={{ border: '1px solid red' }}>
                <h1>Storage Area</h1>
                <textarea
                    rows="5"
                    cols="50"
                    placeholder="Put you text here..."
                />
            </div>
        </div>
    )
}

export default Page