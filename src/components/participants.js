import React from 'react';

import Players from "../components/Players"

const Participants = () => {
    return (
        <div id="section_participants">
            <h4>Participants</h4>
            <Players></Players>
            <button>Lancer la partie</button>
            <span>Et puisse le sort vous être … bien sympa</span>
        </div>
    );
};

export default Participants;