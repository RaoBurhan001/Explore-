import React from 'react';

import { CSSTransition } from'react-transition-group';
import Backdrop from'./Backdrop';
import ModalOverlay from './ModalOverlay';
import './Modal.css';


const Modal = props => {
    return (
      <React.Fragment>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition
          in={props.show}
          mountOnEnter
          unmountOnExit
          timeout={200}
          classNames="modal"
        >
          <ModalOverlay {...props} />
        </CSSTransition>
      </React.Fragment>
    );
  };
export default Modal;