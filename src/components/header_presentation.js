import React from 'react';

const Header_presentation = (props) => {
    

    return (
        <section id="presentation" className="presentation_about">
            <div className="background"></div>
            <h1>{props.children}</h1>
        </section>
    );
};

export default Header_presentation;