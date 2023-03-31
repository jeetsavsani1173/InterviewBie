import React, { useEffect } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/monokai.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

function Editor() {
  useEffect(() => {
    async function init() {
      CodeMirror.fromTextArea(document.getElementById("realTimeEditor"), {
        mode: { name: "javascript", json: true },
        theme: "monokai",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
    }
    init();
  }, []);
  return <textarea id="realTimeEditor"></textarea>;
}

export default Editor;
