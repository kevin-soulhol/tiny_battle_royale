import React from 'react';

const DisplayDay = (props) => {
    return (
        <div className={props.isNight ? "contain_day nightmode" : "contain_day"}>
            <span className="journee">{props.isNight ? "Morts de la journée" : "Journée"}</span>
            {!props.isNight ? (
                <div className="contain_number_day">
                    <div className="ligne_day"></div>
                    <div className="number_day">{props.day}</div>
                    <div className="ligne_day"></div>
                </div>
            ) : (
                <div className="contain_deathhead">
                    <div className="eclat left"></div>
                    <div className="head"></div>
                    <div className="eclat right"></div>
                </div>
            )}
            {(props.specialEvent && !props.isNight) && (
                <div className="containerSpecialEvent">
                    <div className="specialEventTitle">{props.specialEvent.name}</div>
                    <div className="guillemet">‘‘</div>
                    <div className="descSpecialEvent">{props.specialEvent.desc}</div>
                </div>
            )}
        </div>
    );
};

export default DisplayDay;