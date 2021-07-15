import React from 'react';
import Img from "gatsby-image"

const displayAllImagePlayers = (props) => {
    const allImage = props.data


    return (
        <div className="allImagePlayers">
            {allImage.map((img) => (
                <div
                    className="propositions_image"
                    onClick={() => props.changerImage(props.indexPlayer, img.node.childrenImageSharp[0].fluid)}
                >
                    <Img
                        fluid={img.node.childrenImageSharp[0].fluid}
                        objectFit="cover"
                        style={{ "height": "100%" }}
                    />
                </div>
            ))}
        </div>
    );
};

export default displayAllImagePlayers;