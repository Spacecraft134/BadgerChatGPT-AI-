import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

import TextAppMessageList from "./TextAppMessageList";
import Constants from "../constants/Constants";

function TextApp(props) {
  // Set to true to block the user from sending another message
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  /**
   * Called whenever the "Send" button is pressed.
   * @param {Event} e default form event; used to prevent from reloading the page.
   */
  async function handleSend(e) {
    e?.preventDefault();
    const input = inputRef.current.value?.trim();
    setIsLoading(true);
    if (input) {
      addMessage(Constants.Roles.User, input);
      inputRef.current.value = "";

      const index = messages.length + 1;
      addMessage(Constants.Roles.Assistant, "");
      const Conversation = [
        { role: Constants.Roles.Developer, content: props.persona.prompt },
        ...messages.map(({ role, content }) => ({ role, content })),
        {
          role: Constants.Roles.User,
          content: input,
        },
      ];

      const res = await fetch(
        "https://cs571api.cs.wisc.edu/rest/s25/hw11/completions-stream",
        {
          method: "POST",
          headers: {
            "X-CS571-ID":
              "bid_fe644695e8fbd9ec9d7c0dfa830d466ac60cf83462fbf26e7e2f957a633f3623",
            "Content-type": "application/json",
          },
          body: JSON.stringify(Conversation),
        }
      );
      if (res.status === 200) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let reply = "";
        let done = false;

        while (!done) {
          const resObj = await reader.read();
          const value = resObj.value;
          done = resObj.done;
          if (value) {
            const chucks = decoder.decode(value, { stream: true });
            const lines = chucks
              .split("\n")
              .filter((lines) => lines.trim() !== "");
            for (const line of lines) {
              const { delta } = JSON.parse(line);
              reply += delta;

              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[index] = {
                  ...updatedMessages[index],
                  content: reply,
                };
                return updatedMessages;
              });
            }
          }
        }
      }
    }
    setIsLoading(false);
  }

  /**
   * Adds a message to the ongoing TextAppMessageList
   *
   * @param {string} role The role of the message; either "user", "assistant", or "developer"
   * @param {*} content The content of the message
   */
  function addMessage(role, content) {
    setMessages((o) => [
      ...o,
      {
        role: role,
        content: content,
      },
    ]);
  }

  useEffect(() => {
    const stored = localStorage.getItem(`messages-${props.persona.name}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([
        {
          role: Constants.Roles.Developer,
          content: props.persona.prompt,
        },
        {
          role: Constants.Roles.Assistant,
          content: props.persona.initialMessage,
        },
      ]);
    }
  }, [props.persona.name]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `messages-${props.persona.name}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, props.persona.name]);

  return (
    <div className="app">
      <TextAppMessageList messages={messages} />
      {isLoading ? <BeatLoader color="#36d7b7" /> : <></>}
      <div className="input-area">
        <Form className="inline-form" onSubmit={handleSend}>
          <Form.Control
            ref={inputRef}
            style={{ marginRight: "0.5rem", display: "flex" }}
            placeholder="Type a message..."
            aria-label="Type and submit to send a message."
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default TextApp;
