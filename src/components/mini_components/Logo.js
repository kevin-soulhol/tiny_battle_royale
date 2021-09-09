import React from 'react';
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"


const Logo = () => {

  //récupération de toutes les images
  const data = useStaticQuery(
    graphql`
      query {
          allFile(filter: {name: {eq: "logo"}}) {
            edges {
              node {
                id
                absolutePath
                relativeDirectory
                name
                childrenImageSharp {
                  fluid {
                    base64
                    tracedSVG
                    srcWebp
                    srcSetWebp
                    originalImg
                    originalName
                    src
                  }
                }
                childImageSharp {
                  fluid {
                    base64
                    tracedSVG
                    srcWebp
                    srcSetWebp
                    originalImg
                    originalName
                  }
                }
              }
            }
          }
        }
      `
  )

  
  return (
    <Link to="/" className="logo">
      <Img fluid={data.allFile.edges[0].node.childImageSharp.fluid} />
      <h1><div>Tiny</div><div>Battle</div></h1>
    </Link >
  );
};



export default Logo;