import React from 'react';

import Imgplayer from "./Imgplayer"



const Players = ({query}) => {
    console.log(query);
    return (
        <div>
            <Imgplayer img="perso/h001.jpg"/>
        </div>
    );
};

export default Players;


export const query = graphql`
  query {
    fileName: file(relativePath: { eq: "./images/perso/h001.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, maxHeight: 250) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`