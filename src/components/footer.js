import React from 'react';
import { Link } from "gatsby"

import AddToHomeScreen from 'gatsby-plugin-pwainstall'

const Footer = () => {

    const getCopyright = () => {
        return (<span>
            © {new Date().getFullYear()}, Kévin Soulhol - Atelier les Petites Choses | Illustrations par <a href="https://www.behance.net/viktormillergausa" target="_blank">Viktor Miller-Gausa</a> | version 1.0 - Beta
        </span>)
    }


    return (
        <footer>
            <div className="background"></div>
            <div>
                <div className="col">
                    <Link to="/about">A propos</Link>

                    <Link to="/assistance">Assistance</Link>

                    <AddToHomeScreen suspend='0' acceptedUri='/' dismmissedUri='/'>
                        Installer l'application
                    </AddToHomeScreen>

                    <Link className="btn_paypal" to="https://www.paypal.com/donate?hosted_button_id=9JG996KBXZVE6" target="_blank" rel="noreferrer">M'offrir un café ?</Link>
                </div>
            </div>
            <div className="copyright">
                {getCopyright()}
            </div>

        </footer>
    );
};

export default Footer;