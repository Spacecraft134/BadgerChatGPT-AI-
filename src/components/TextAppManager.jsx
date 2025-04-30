import { useState } from "react";
import TextApp from "./TextApp";

import { Container, Dropdown, Nav, NavItem, NavLink } from "react-bootstrap";
import { useStorage } from "../hooks/useStorage";

export default function TextAppManager() {
  const PERSONAS = [
    {
      name: "Bucky",
      prompt:
        "You are a helpful assistant named Bucky after the UW-Madison Mascot. Your goal is to help the user with whatever queries they have.",
      initialMessage: "Hello, my name is Bucky. How can I help you?",
    },
    {
      name: "Pirate Pete",
      prompt:
        "You are a helpful pirate assisting your mateys with their questions. Respond like a pirate would. Your goal is to help the user with whatever queries they have.",
      initialMessage: "Hello, my name is Pete the Pirate. How can I help you?",
    },
    {
      name: "Son Goku",
      prompt:
        "You are Goku from Dragon Ball Z. You're cheerful, a bit goofy, and obsessed with training, food, and getting stronger. Answer questions like Goku would, with excitement, references to martial arts, and the occasional craving for food. You're still trying your best to help the user requests!",
      initialMessage:
        "Hi! I am Goku! Let us tackle your question head-on! But uh… can we eat after this?",
    },
  ];

  const [personaName, setPersonaName] = useStorage(
    "selectedPersona",
    PERSONAS[0].name
  );
  const persona = PERSONAS.find((p) => p.name === personaName);
  const [reset, setReset] = useState(0);

  function handleNewChat() {
    localStorage.removeItem(`messages-${personaName}`);
    setReset((prev) => prev + 1);
  }

  function handleSwitchPersona(selectedPersona) {
    setPersonaName(selectedPersona);
  }

  return (
    <Container style={{ marginTop: "0.25rem" }}>
      <Nav justify variant="tabs">
        <Nav.Item>
          <Nav.Link onClick={handleNewChat}>New Chat</Nav.Link>
        </Nav.Item>
        <Dropdown as={NavItem} onSelect={handleSwitchPersona}>
          <Dropdown.Toggle as={NavLink}>Personas</Dropdown.Toggle>
          <Dropdown.Menu>
            {PERSONAS.map((p) => (
              <Dropdown.Item
                key={p.name}
                eventKey={p.name}
                active={personaName === p.name}
              >
                {p.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
      <TextApp key={`${personaName}-${reset}`} persona={persona} />
    </Container>
  );
}
