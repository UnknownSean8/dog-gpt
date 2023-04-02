import axios from "axios";
import { useState } from "react";
import TypewriterComponent from "typewriter-effect";
import "./App.css";

const configuration = {
  headers: {
    Authorization: "Bearer " + process.env.REACT_APP_OPENAPI_KEY,
  },
};

function App() {
  const [inputText, setInputText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  async function getReply() {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "davinci",
        prompt: inputText,
      },
      configuration
    );

    const imageRes = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: "Dog" + inputText,
        n: 1,
        size: "256x256",
      },
      configuration
    );

    console.log(imageRes);
    console.log(response.data.choices[0].text);
    setImgURL(imageRes.data.data[0].url);
    setReplyText(response.data.choices[0].text);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (inputText.length === 0) {
      alert("No input, wuf wuf!")
    }
    getReply();
  }

  return (
    <div className="App">
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Enter your Wufff:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button type="submit">Generate Wuf!</button>
      </form>

      {imgURL && <img src={imgURL} alt="new" />}

      {replyText && (
        <TypewriterComponent
          onInit={(typewriter) => {
            typewriter
              .changeDelay(35)
              .typeString(replyText.replace(/(\w+)/g, "wuf"))
              .callFunction(() => {
                setIsTyping(false);
              })
              .start();
          }}
        />
      )}
    </div>
  );
}

export default App;
