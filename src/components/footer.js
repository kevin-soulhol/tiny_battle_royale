import React from 'react';
import { Link } from "gatsby"

const Footer = () => {
    return (
        <footer>
            <div className="background"></div>
            <div>
                <div className="col">
                    <Link to="/about">A propos</Link>
                    <Link to="/assistance">Assistance</Link>
                    <Link to="/">Autres jeux</Link>
                </div>
                <div className="col">
                    <button>M'offrir un café</button>
                    Réseaux
                </div>
            </div>
            <div className="copyright">
                © {new Date().getFullYear()}, Kévin Soulhol | Illustrations par
                <a href="https://www.behance.net/viktormillergausa" target="_blank" style={{margin:"0 3px"}}>Viktor Miller-Gausa</a>
                | version 1.0
                
            </div>

        </footer>
    );
};

export default Footer;