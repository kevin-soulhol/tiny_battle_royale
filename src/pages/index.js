import * as React from "react"

import Layout from "../components/layout"
import Participants from "../components/participants"
import Seo from "../components/seo"

import "../styles/main.scss"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <section id="presentation">
      <div className="background"></div>
      <h2>
        <span className="tiny">Tiny</span>
        <span className="battle">Battle</span>
        <span className="royale">Royale</span>
      </h2>

      <div className="ligne_cta">
        <h3>Choisissez les participants puis lancez-les dans l'arène. Survivront-ils ? Combien de temps ? Tout peut arriver dans Tiny Battle Royale !</h3>
        <button>JOUER</button>
      </div>
    </section>

    <Participants />
  </Layout>
)

export default IndexPage



