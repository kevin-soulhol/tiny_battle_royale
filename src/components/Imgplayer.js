import React from 'react';
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import CloseCross from '../components/mini_components/close_cross'

const Imgplayer = (props) => {

    console.log(props);

    const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "perso/h001.jpg" }) {
        childImageSharp {
          fluid(quality: 10, maxWidth: 500) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)


    const IMG = data.placeholderImage.childImageSharp.fluid
  


    console.log("IMG");
    console.log(IMG.src);

    
    return (
        <div className="img_player">
            <Img fluid={data.placeholderImage.childImageSharp.fluid} />
            <div className="close"><CloseCross /></div>
            <div className="name_player">John</div>
        </div>
    );
};

export default Imgplayer;

/*

            <div className="bg_player"  style={{backgroundImage:IMG.src}}></div>
            */