import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { FormEvent, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [text, setText] = useState("");
  const [canUse, setCanUse] = useState(true);
  const [asrc, setAsrc] = useState("");
  const aref = useRef<any>();

  async function speech(e: FormEvent) {
    if (!canUse) return;
    e.preventDefault();
    setCanUse(false);
    console.log(aref.current);
    try {
      const res = await fetch("/api/getspeech", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      console.log(res);
      const blob = await res.blob();
      if (asrc) {
        URL.revokeObjectURL(asrc);
      }
      const href = URL.createObjectURL(blob);
      setAsrc(href);
    } catch (err: any) {
      console.log(err);
    } finally {
      setTimeout(() => setCanUse(true), 3000);
    }
  }

  async function downlaod(){
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
        <form onSubmit={speech}>
          <textarea onChange={w => setText(w.target.value)} cols={30} rows={5} />
          <button disabled={!canUse || text.length == 0}>Speak</button>
        </form>
        {asrc !== "" ? <button onClick={downlaod}>Download</button> : ""}
        <audio autoPlay ref={aref} src={asrc}></audio>
      </main>
    </>
  )
}
