import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, irBlack } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { RxCopy } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { FiSun, FiMoon } from "react-icons/fi";
import { MdOutlineWrapText } from "react-icons/md";
import "./style.css";

const CodeDisplay = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("docco");
  const [wrapLines, setWrapLines] = useState(true);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Unable to copy to clipboard", err);
      });
  };
  const toggleWrapLines = () => {
    setWrapLines((prevWrapLines) => !prevWrapLines);
  };
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "docco" ? "irBlack" : "docco"));
  };

  const codeString = code;
  const numberOfLines = codeString.split("\n").length;
  const blackAndWhite = {
    hljs: {
      display: "block",
      overflowX: "auto",
      padding: "0.5em",
      color: "#000000",
      background: "#F8F8FF",
    },
    "hljs-keyword": { color: "#000000" },
    "hljs-literal": { color: "#000000" },
    "hljs-symbol": { color: "#000000" },
    "hljs-name": { color: "#000000" },
    "hljs-comment": { color: "#000000" },
    "hljs-tag": { color: "#000000" },
    "hljs-string": { color: "#000000" },
  };
  let codeStyle = theme === "irBlack" ? irBlack : docco;
  // if (font === "Consolas") {
  //   codeStyle = blackAndWhite;
  // }
  // Determine language based on codeString content
  const language = codeString.startsWith("<") ? "htmlbars" : "auto";

  return (
    <div className="code-container">
      <div className="code-tool">
        <div className="left-elements"></div>
        <div className="right-elements">
          <span
            className="copy-button"
            onClick={() => {
              handleCopy();
            }}
          >
            {copied ? <IoMdCheckmark /> : <RxCopy />}{" "}
            {copied ? `Copied` : `Copy`}
          </span>
          <span className="switch-button" onClick={toggleTheme}>
            {theme === "irBlack" ? <FiSun /> : <FiMoon />}
          </span>
          <span className="wrapline-button" onClick={toggleWrapLines}>
            <MdOutlineWrapText />
          </span>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={{
          ...codeStyle,
        }}
        showLineNumbers={numberOfLines > 1}
        wrapLines={wrapLines}
        lineProps={{ style: { whiteSpace: "pre-wrap" } }}
        customStyle={{
          fontSize: "14px",
          padding: "16px",
          margin: 0,
          backgroundColor: "white",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;
