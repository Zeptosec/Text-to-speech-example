import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { FormEvent, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })
const voices = [{
  name: "English(US)",
  value: "en-US",
  voice: [{
    name: "Jenny",
    value: "JennyNeural"
  },
  {
    name: "Jason",
    value: "JasonNeural"
  }]
}, {
  name: "Lithuania(LT)",
  value: "lt-LT",
  voice: [{
    name: "Leonas",
    value: "LeonasNeural"
  }, {
    name: "Ona",
    value: "OnaNeural"
  }]
}, {
  name: "Italy(IT)",
  value: "it-IT",
  voice: [{
    name: "Diego",
    value: "DiegoNeural"
  }]
}]

export default function Home() {

  const [text, setText] = useState("");
  const [canUse, setCanUse] = useState(true);
  const [asrc, setAsrc] = useState("");
  const [country, setCountry] = useState(0);
  const [voice, setVoice] = useState(0);
  const aref = useRef<any>();

  async function speech(e: FormEvent) {
    if (!canUse) return;
    e.preventDefault();
    setCanUse(false);
    try {
      const res = await fetch("/api/getspeech", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice: `${voices[country].value}-${voices[country].voice[voice].value}` })
      });
      const blob = await res.blob();
      if (asrc) {
        URL.revokeObjectURL(asrc);
      }
      const href = URL.createObjectURL(blob);
      setAsrc(href);
    } catch (err: any) {
      console.log(err)
    } finally {
      setTimeout(() => setCanUse(true), 3000);
    }
  }

  async function downlaod() {
    const link = document.createElement('a');
    link.href = asrc;
    link.setAttribute('download', "tts.mp3");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  return (
    <>
      <Head>
        <title>Lab14 TTS</title>
        <meta name="description" content="Text to speech" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h2>LAB 1.4 azure cognitive services</h2>
        <div className='voices'>
          <p>Country:</p>
          <select defaultValue={country} onChange={w => { setCountry(parseInt(w.target.value)); setVoice(0); }}>
            {voices.map((w, ind) => (<option key={ind} value={ind}>{w.name}</option>))}
          </select>
          <p>Voice:</p>
          <select defaultValue={voice} onChange={w => setVoice(parseInt(w.target.value))}>
            {voices[country].voice.map((w, ind) => (<option key={ind} value={ind}>{w.name}</option>))}
          </select>
        </div>
        <form onSubmit={speech}>
          <textarea onChange={w => setText(w.target.value)} cols={30} rows={5} />
          <button disabled={!canUse || text.length == 0}>Speak</button>
        </form>
        {asrc !== "" ? <button onClick={downlaod}>Download</button> : ""}
        <audio autoPlay ref={aref} src={asrc}></audio>
        <div className='foot'>By Armandas</div>
      </main>
    </>
  )
}
