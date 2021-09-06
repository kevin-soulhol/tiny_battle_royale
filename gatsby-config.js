module.exports = {
  siteMetadata: {
    title: `Tiny Battle Royale`,
    description: `Amusez-vous avec ce simulateur de Battle Royale, type Jeux de la Faim (Hunger Game). Seul ou à plusieurs, choisissez vos participants et laissez-les se battre dans l'arène et subir des évènements aléatoires. Qui sera le vainqueur ? A vous de le découvrir en jeu.`,
    author: `Kévin Soulhol`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    `gatsby-image`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-gatsby-cloud`
  ],
}
