import React, { useCallback } from "react";
import { ModalContext } from "../contexts";
import { Content, Modal } from "react-bulma-components";
import parse from 'html-react-parser';


export default function  ModalContextProvider({ children }) {
  const [node, setNode] = React.useState(null);

  const onClose = useCallback(() => setNode(null), []);

  console.log(node)

  return (
    < ModalContext.Provider value={setNode}>
      {children}
      <Modal show={node} closeOnEsc onClose={onClose}>
        <Modal.Card>
          <Modal.Card.Header>
            <Modal.Card.Title>{node && node.name}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <Content>
              {node && parse(node.description)}
            </Content>
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </ ModalContext.Provider>
  )
}

