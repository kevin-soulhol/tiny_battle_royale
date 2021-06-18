import React from 'react';

const close_cross = (props) => {

    const color = props.color ? props.color : "#D92949"

    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="39.668" height="38" viewBox="0 0 39.668 38">
                <g data-name="Groupe 17" transform="translate(-767.333 -879.333)">
                    <path id="Tracé_11" data-name="Tracé 11" d="M800.25,879.333l-28.917,33.18,2.039,4.82,36.517-32.439Z" transform="translate(-2.888 0)" fill={color} />
                    <path id="Tracé_12" data-name="Tracé 12" d="M767.333,885.839c.927,1.2,32.068,31.976,32.068,31.976l2.781-2.039L771.411,880Z" transform="translate(0 -0.481)" fill={color} />
                </g>
            </svg>

        </div>
    );
};

export default close_cross;