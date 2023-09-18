import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/call-python-script');
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // async function onSubmit(event) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ animal: animalInput }),
  //     });

  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       throw data.error || new Error(`Request failed with status ${response.status}`);
  //     }

  //     setResult(data.stdout);
  //     setAnimalInput("");
  //   } catch(error) {
  //     // Consider implementing your own error handling logic here
  //     console.error(error);
  //     alert(error.message);
  //   }
  // }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>OpenAI Q&A</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a question about OPENAI"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate answers" />
        </form>
        <div className={styles.result}>
          {/* Display the result */}
          {result && (
            <div>
              {result && <p>{result}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
