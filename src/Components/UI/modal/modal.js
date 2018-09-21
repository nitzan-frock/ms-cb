import React from 'react';

import Backdrop from '../backdrop/backdrop';
import Aux from '../../../tools/auxiliary';

import './modal.scss';

const Modal = (props) => {

    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div
                className="modal"
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                {props.children}
            </div>
        </Aux>
    );
};

export default Modal;