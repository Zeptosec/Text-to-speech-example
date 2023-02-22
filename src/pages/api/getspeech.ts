// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: "Text is missing!" });
    console.log(text);
    try {
        const rs = await fetch("https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1", {
            method: "POST",
            headers: {
                'Ocp-Apim-Subscription-Key': '20684852041844e797a3d35e49ce1226',
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                'Content-Type': 'application/ssml+xml'
            },
            body: `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-AriaNeural"><prosody rate="0%" pitch="0%">${text}</prosody></voice></speak>`
        })
        const blob = await rs.blob();
        const buff = await blob.arrayBuffer();
        return res.send(Buffer.from(buff))
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}
