import React, { useEffect, useState } from 'react';
import { Link } from "gatsby"


import DisplayDay from "../components/mini_components/displayDay"
import DisplayEvent from "../components/mini_components/displayEvent"

import Seo from "../components/seo"
import Footer from "../components/footer"
import HeaderGame from "../components/HeaderGame"


import GameClass from "../classes/game.class"
import Events from "../classes/events.json"
import Layout from '../components/layout';

const variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
}


const Game = ({ location }) => {

    const [players, setPlayers] = useState(location?.state?.joueurs)
    const [isNight, setIsNight] = useState(false)
    const [endGame, setEndGame] = useState(false)

    const [GAME, setGAME] = useState()
    const [lastDead, setLastDead] = useState([])
    const [playerDay, setPlayerDay] = useState([])
    const [winner, setWinner] = useState({})



    useEffect(() => {
        //construction du jeu seulement au premier chargment de la page   
        new GameClass(players, Events).then((newgame) => {
            setGAME(newgame)
        })

    }, [])

    useEffect(() => {
        GAME?.start_day().then((result) => {
            setPlayerDay(result)
            setLastDead(GAME?.LAST_DEADS)
        })
    }, [GAME])


    const nextDay = () => {
        changeTime()
    }

    const endDay = () => {
        setPlayerDay([])
        setLastDead([])
        changeTime().then(() => {
            GAME?.start_day().then((result) => {
                if (result) {
                    setPlayerDay(GAME?.PARTICIPANTS_DAY)
                    setLastDead(GAME?.LAST_DEADS)
                } else {
                    setEndGame(true)
                    setWinner(GAME?.WINNER)
                }
            })
        })


    }

    const restart = () => {
        window.location.reload()
    }


    const changeTime = () => {
        return new Promise((r, f) => {
            scrollToTop().then(e => {
                if (isNight) { setIsNight(false) } else { setIsNight(true) }
                r(true)
            })
        })
    }

    const scrollToTop = () => {
        return new Promise((r, f) => {
            window.scrollTo({
                top: 1,
                behavior: "smooth"
            });
            setTimeout(() => {
                r(true)
            }, 300);
        })
    };


    return (
        <Layout className="appGame" header="false">
            <Seo title="Game" />
            <HeaderGame change={isNight} />
            {(!endGame) && (
                <DisplayDay day={GAME?.DAY ?? "0"} isNight={isNight} specialEvent={GAME?.SPECIALEVENT} />
            )}


            {!endGame && playerDay?.map((participant) => (

                !isNight && <DisplayEvent
                    player={participant}
                    img={participant.fluid}
                    dead={false}
                    is_zombie={participant.is_zombie}
                    player_action={participant.action}
                />


            ))}
            {
                !endGame && isNight && (lastDead?.map((participant) => (
                    (participant.hidden == false) &&
                    <DisplayEvent
                        player={participant}
                        img={participant.fluid}
                        dead={true}
                    />
                )))
            }
            {
                (endGame) && (
                    <DisplayEvent
                        player={winner}
                        img={winner.fluid}
                        winner={true}
                        day={GAME?.DAY ?? false}
                    />
                )
            }
            {
                (GAME?.LAST_DEADS?.length < 1 && isNight) && <div className="message">Aucun mort cette nuit.</div>
            }
            {
                !endGame && (
                    <button
                        className={!isNight ? "nextDay" : "nextDay night"}
                        onClick={!isNight ? nextDay : endDay}
                    >
                        {isNight ? "Journée suivante" : "Fin de journée"}
                    </button>
                )
            }
            {
                endGame && (
                    <div className = "container_btns_endgame">
                        <button
                            className="restart"
                            onClick = {restart}
                        >
                            Relancer la partie
                        </button>
                        <Link
                        to = "/"
                        className="restart"
                        state={{ joueurs : players }}
                        >
                            Retourner au menu
                        </Link>
                    </div>
                )
            }
            
        </Layout>
    );
};

export default Game;
