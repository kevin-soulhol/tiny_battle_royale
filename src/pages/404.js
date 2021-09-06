import * as React from "react"
import { Link } from 'gatsby'

import Layout from "../components/layout"
import Seo from "../components/seo"
import HeaderPresentation from "../components/header_presentation"

const NotFoundPage = () => (
  <Layout className="introuvable">
    <Seo title="404" />
    
    <HeaderPresentation>404</HeaderPresentation>
    <p>Oups. Votre page n'existe pas !</p>
    <Link to="/">Retourner à l'accueil</Link>
  </Layout>
)

export default NotFoundPage
