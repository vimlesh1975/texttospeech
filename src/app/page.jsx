'use client';

import { useState } from 'react';
import 'regenerator-runtime/runtime'

import SpeechToText from "./SpeechToText";

const Page = () => {
    return (
        <div >
                <SpeechToText />
        </div>
    )
}

export default Page