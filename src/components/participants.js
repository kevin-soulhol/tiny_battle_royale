import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql, Link } from "gatsby"

import Players from "../components/Imgplayer"
import DisplayAllImagePlayers from "../components/displayAllImagePlayers"

const Participants = () => {
    const MaxPlayers = 5
    const autoPlayerStarter = 2
    const [Indexer, setIndexer] = useState(0)
    const [Participants, setParticipants] = useState([])
    const [imagesPrises, setImagesPrises] = useState([])

    const [openedImages, setOpenedImages] = useState(false)
    const [selectPlayer, setSelectPlayer] = useState()


    //récupération de toutes les images
    const data = useStaticQuery(
        graphql`
        query {
            allFile(filter: {relativeDirectory: {eq: "perso"}}) {
              edges {
                node {
                  id
                  absolutePath
                  relativeDirectory
                  name
                  childrenImageSharp {
                    fluid {
                      base64
                      tracedSVG
                      srcWebp
                      srcSetWebp
                      originalImg
                      originalName
                      src
                    }
                  }
                  childImageSharp {
                    fluid {
                      base64
                      tracedSVG
                      srcWebp
                      srcSetWebp
                      originalImg
                      originalName
                    }
                  }
                }
              }
            }
          }
        `
    )


    useEffect(() => {
        //Création d'un premier joueur au démarrage de la page
        add_players()
    }, [])

    useEffect(() => {
        if(Participants.length < autoPlayerStarter){
            add_players()
        }
    }, [Participants])

    const add_players = () => {
        if (Participants.length < MaxPlayers) {
            let participant = createPlayer()

            let newArr = [...Participants]
            newArr.push(participant)
            setParticipants(newArr)
            setIndexer(Indexer + 1)
        }
    }


    const delete_players = (index) => {
        if (Participants.length > 2) {
            let newArr = [...Participants]
            newArr.splice(newArr.findIndex(item => item.index === index), 1)
            setParticipants(newArr)
        }
    }

    const changeName = (index, newname) => {
        let newArr = [...Participants]
        newArr[newArr.findIndex(item => item.index === index)].nom = newname
        setParticipants(newArr)
    }

    const openImages = (indexPlayer) => {
        setSelectPlayer(indexPlayer)
        setOpenedImages(true)
    }

    const closeImages = () => {
        setOpenedImages(false)
    }


    /** *************** CHANGEMENT SUR PLAYER */

    const createPlayer = () => {
        let random_number_img = 0
        let new_array = imagesPrises

        do {
            random_number_img = Math.floor(Math.random() * data.allFile.edges.length)
        } while (imagesPrises.indexOf(random_number_img) !== -1)

        new_array.push(random_number_img)
        setImagesPrises(new_array)

        let participant = {
            index: Indexer,
            nom: "",
            fluid: data.allFile.edges[random_number_img].node.childrenImageSharp[0].fluid
        }

        return participant
    }

    const setImagePlayer = (index, fluid) => {
        let newArr = [...Participants]
        newArr[newArr.findIndex(item => item.index === index)].fluid = fluid
        setParticipants(newArr)
        closeImages()
    }



    return (
        <div id="section_participants">
            <h4>Choisissez vos participants</h4>
            <div className="contain_players">
                {Participants.map((participant) => (
                    <Players
                        index={participant.index}
                        nom={participant.nom}
                        fluid={participant.fluid}
                        deleter={delete_players}
                        changerName={changeName}
                        openerImage={openImages}
                    ></Players>

                ))}
                {
                    (Participants.length < MaxPlayers) &&
                    <Players add="true" adder={add_players}></Players>
                }
            </div>
            <Link
                to="/game/"
                state={{ joueurs: Participants }}
            >
                <button>Lancer la partie</button>
            </Link>
            <span className="soustitre_btn">(Et puisse le sort vous être … bien <em>sympa</em>)</span>
            {openedImages &&
                <DisplayAllImagePlayers
                    data={data.allFile.edges}
                    indexPlayer={selectPlayer}
                    closer={closeImages}
                    changerImage={setImagePlayer}
                />
            }

        </div>
    );
};


export default Participants;