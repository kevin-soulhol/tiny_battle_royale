module.exports = {
  siteMetadata: {
    title: `Tiny Battle Royale`,
    description: `Amusez-vous avec ce simulateur de Battle Royale, type Jeux de la Faim (Hunger Game). Seul ou à plusieurs, choisissez vos participants et laissez-les se battre dans l'arène et subir des évènements aléatoires. Qui sera le vainqueur ? A vous de le découvrir en jeu.`,
    author: `Kévin Soulhol`,
    siteUrl : `https://www.tinybattleroyale.kevin-soulhol.fr`,
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
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tiny Battle Royale`,
        short_name: `Tiny Battle`,
        description : `L'application de simulation de Battle Royale.`,
        lang: `fr`,
        start_url: `/`,
        background_color: `#F27D16`,
        theme_color: `#F27D16`,
        display: `fullscreen`,
        icon: `src/images/favicons/favicon.png`,
        icons: [
          {
            src: `src/images/favicons/favicon_512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
          {
            src: `src/images/favicons/favicon_192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
  ],
}
