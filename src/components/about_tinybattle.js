import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from "gatsby"

const About_tinybattle = () => {

    const [SeoText, setSeoText] = useState({})

    //récupération de toutes les images
    const data = useStaticQuery(
        graphql`
        query {
            allMarkdownRemark(filter: {frontmatter: {title: {eq: "seo_text"}}}) {
              edges {
                node {
                  id
                  html
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `
    )

    useEffect(() => {
        let seo_text = data.allMarkdownRemark?.edges[0]?.node
        setSeoText(seo_text)
    }, [])



    return (
        <section id="descriptiontinybattle">
            <div dangerouslySetInnerHTML={{ __html: SeoText?.html }} />
        </section>
    );
};




export default About_tinybattle;