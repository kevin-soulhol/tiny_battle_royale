import React, { useEffect, useState } from 'react';
import { StaticQuery, useStaticQuery, graphql, Link } from "gatsby"


import Layout from "../components/layout"
import Seo from "../components/seo"
import HeaderGame from "../components/HeaderGame"
import HeaderPresentation from "../components/header_presentation"

const About = () => {

    const [SeoText, setSeoText] = useState({})

    //récupération de toutes les images
    const data = useStaticQuery(
        graphql`
        query {
            allMarkdownRemark(filter: {frontmatter: {title: {eq: "about_text"}}}) {
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
        <Layout>
            <Seo 
            title="About" 
            description="Des joueurs, un terrain fermé, des armes et qu'un seul survivant. Bienvenue dans l'univers des Battle royales ! Choisissez vos participants, lancer le jeu et laissez vous porter par le scenario. Tour après tour, ils essaieront de survivre. Faites des paris et essayez de deviner qui sera le dernier debout de VOTRE Tiny Battle Royale !"/>
            <HeaderPresentation>A propos de Tiny Battle Royale</HeaderPresentation>

            <div 
            className = "text_seo_about"
            dangerouslySetInnerHTML={{ __html: SeoText?.html }} 
            />

        </Layout>
    );
};

export default About;