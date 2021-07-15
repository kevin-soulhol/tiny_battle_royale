import React from 'react';


import Layout from "../components/layout"
import Seo from "../components/seo"
import HeaderPresentation from "../components/header_presentation"

const assistance = () => {
    return (
        <Layout className="assistance">
            <Seo title="Assistance" />
            <HeaderPresentation>Assistance</HeaderPresentation>

            <form method="post" action="#">
                <label>
                    Name
                    <input type="text" name="name" id="name" />
                </label>
                <label>
                    Email
                    <input type="email" name="email" id="email" />
                </label>
                <label>
                    Objet
                    <input type="text" name="subject" id="subject" />
                </label>
                <label>
                    Message
                    <textarea name="message" id="message" rows="5" />
                </label>
                <button type="submit">Envoyer</button>
            </form>

        </Layout>
    );
};

export default assistance;