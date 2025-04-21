import { useState } from "react";
import TextApp from "./TextApp";

import { Container, Dropdown, Nav, NavItem, NavLink } from "react-bootstrap";

export default function TextAppManager() {

    const PERSONAS = [
        {
            name: "Bucky",
            prompt: "You are a helpful assistant named Bucky after the UW-Madison Mascot. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Bucky. How can I help you?"
        },
        {
            name: "Pirate Pete",
            prompt: "You are a helpful pirate assisting your mateys with their questions. Respond like a pirate would. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Pete the Pirate. How can I help you?"
        }
    ];

    const [personaName, setPersonaName] = useState(PERSONAS[0].name);
    const persona = PERSONAS.find(p => p.name === personaName);

    function handleNewChat() {
        alert("I should handle starting a new chat.");
    }

    function handleSwitchPersona(selectedPersona) {
        alert(`I should check with the user first, then switch to the '${selectedPersona}' persona.`);
    }

    return <Container style={{ marginTop: "0.25rem" }}>
        <Nav justify variant="tabs">
            <Nav.Item>
                <Nav.Link onClick={handleNewChat}>New Chat</Nav.Link>
            </Nav.Item>
            <Dropdown as={NavItem} onSelect={handleSwitchPersona}>
                <Dropdown.Toggle as={NavLink}>Personas</Dropdown.Toggle>
                <Dropdown.Menu >
                    {
                        PERSONAS.map(p => <Dropdown.Item key={p.name} eventKey={p.name} active={personaName === p.name}>{p.name}</Dropdown.Item>)
                    }
                </Dropdown.Menu>
            </Dropdown>
        </Nav>
        <TextApp persona={persona}/>
    </Container>
}