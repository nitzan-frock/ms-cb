import React from 'react';

import './card.scss';

const card = (props) => {
    return (
        <div className="card-container">
            <div className="card-title-container">
                <div className="card-title">
                    {props.title}
                </div>
                <div className="card-description">
                    {props.description}
                </div>
            </div>
            {props.children}
        </div>        
    );
};

export default card;