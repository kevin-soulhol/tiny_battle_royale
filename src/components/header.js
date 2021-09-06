import * as React from "react"
import { Link } from "gatsby"

import Logo from "../components/mini_components/Logo"


const Header = () => (
  <header>
    < link rel = " manifest " href = ""  />
    <Logo />
    <ul className="menu">
      <li><Link to="/about">A propos</Link></li>
      <li><Link to="/assistance">Assistance</Link></li>
    </ul>
  </header>
)

export default Header
