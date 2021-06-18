import * as React from "react"
import { Link } from "gatsby"

const Header = () => (
  <header>
    <h1><Link to="/"><div>Tiny</div><div>Battle</div></Link></h1>
    <ul className="menu">
      <li><Link to="/about">A propos</Link></li>
      <li><Link to="/assistance">Assistance</Link></li>
    </ul>
  </header>
)

export default Header
