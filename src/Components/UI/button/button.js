import React from 'react';
import PropTypes from 'prop-types';

import './button.scss';

const button = (props) => {
    return (
        <div className="button-container">
            <div className="button" onClick={() => props.clicked(props.value)} >{props.children}</div>
        </div>        
    );
};

button.propTypes = {
    clicked: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired,
    value: PropTypes.string
}

export default button;