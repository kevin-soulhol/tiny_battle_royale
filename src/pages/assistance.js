import React, { useState } from 'react';
import axios from 'axios';

import Layout from "../components/layout"
import Seo from "../components/seo"
import HeaderPresentation from "../components/header_presentation"

/**
 * Se connecte au fichier send_mail.php pour envoyer le mail
 * @returns 
 */
const Assistance = () => {

    const [message, setMessage] = useState("")
    const [textButton, setTextButton] = useState("Envoyer")
    const [sended, setSended] = useState(false)


    const send_mail = (event) => {

        event.preventDefault()

        let form = event.target;

        if (!sended) {

            let formD = new FormData(form)

            setTextButton("...")

            axios({
                method: "post",
                url: 'https://www.tinybattleroyale.kevin-soulhol.fr/send_email.php',
                data: formD
            })
                .then(function (response) {


                    if (response.data.bool) {
                        setTextButton("Message envoyé")
                        setMessage("")
                        setSended(true)
                    } else {
                        setMessage(response.data.text)
                        setTextButton("Recommencer")
                    }
                })
                .catch(function (err) {
                    // Error happened
                    console.log(err)
                    setMessage("Une erreur est survenue")
                    setTextButton("Recommencer")
                });


        }


    }



    return (
        <Layout className="assistance">
            <Seo title="Assistance" />
            <HeaderPresentation>Assistance</HeaderPresentation>

            <form method="post" onSubmit={send_mail}>

                <h3>Un message à envoyer ?</h3>

                <p>
                    Un problème est survenu, une erreur à partager, un petit message de soutien à envoyer ? Vous êtes au bon endroit.
                    <br />
                    Remplissez le formulaire ci-dessous et envoyez-le. Nous essaierons d'y répondre aussi vite que possible.
                </p>


                <label>
                    Votre nom
                    <input type="text" name="fullname" id="name" />
                </label>
                <label>
                    Votre email
                    <input type="email" name="_reply_to" id="email" />
                </label>
                <label>
                    Objet
                    <input type="text" name="subject" id="subject" />
                </label>
                <label>
                    Message
                    <textarea name="message" id="message" rows="5" />
                </label>

                <small>{message}</small>

                <button type="submit">{textButton}</button>
            </form>

        </Layout>
    );
};

export default Assistance;

//action="https://www.flexyform.com/f/571379c0874532cdd0b4f5dee34b0f677f507091"