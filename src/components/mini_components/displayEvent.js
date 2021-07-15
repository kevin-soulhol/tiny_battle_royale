import React from 'react';
import Img from "gatsby-image"
import { motion } from 'framer-motion'

import CloseCross from './close_cross'


/**Animation */
const variants = {
    init: { scale: 0 },
    visible: { scale: 1 },
    hover: { scale: 1.2 }
}


const DisplayEvent = (props) => {

    let type = props.player.result_event ?? ""
    if (props.dead) {
        type = "dead"
    } else if (props.winner) {
        type = "winner"
    }

    if (props.is_zombie) {
        type = "zombie"
    }

    if (props.player.membres && props.player.membres.length > 1) {
        type = type + " group"
    }


    return (
        <motion.div
            initial="init"
            animate="visible"
            whileHover="hover"
            exit={{ transform: "translateY(100px)" }}
            variants={variants}
            className={"displayEvent " + type}>
            <div className="img_player">
                {(type == "default") && (
                    <div>
                        <div className="triangle"></div>
                        <div className="triangle top_triangle"></div>
                    </div>
                )}
                {(type == "damage") && (
                    <div>
                        <div className="explose"></div>
                        <div className="explose top_explose"></div>
                    </div>
                )}
                {(type == "winner") && (
                    <div className="back"></div>
                )
                }
                {(type == "zombie") && (
                    <div className="deadhead"></div>
                )
                }
                {(props.player_action == "fight") && (
                    <div className="fight"></div>
                )}
                {(props.player_action == "group") && (
                    <div className="group"></div>
                )}
                {props.dead && <CloseCross />}
                <div className="containImg">
                    {props.player.all_photo ? (props.player.all_photo.map((membre) => (

                        <Img fluid={membre.fluid} className={(membre?.is_zombie ? "zomby" : "") + (membre.CARAC.PV <= 0 ? " dead" : "")} />

                    )
                    )) : (
                        <Img fluid={props.img} className={(props?.is_zombie ? "zomby" : "")} />
                    )}

                </div>
            </div>
            <div className="containTextEvent">
                <div className="name">{props.player.name}</div>
                {!props.winner && !props.dead && <div className="text">{props.player.text ?? ""}</div>}
                {!props.winner && props.dead && <div className="text">{props.player.text_death ?? ""}</div>}
                {props.winner && <div className="text">{props.player.text_win ?? 'a remporté la partie ! BRAVO !'}</div>}
                {(props.winner && props.day) && <div className="day_past">{props.day} jour{props.day <= 1 ? "" : "s"} de Battle</div>}
            </div>
        </motion.div >
    );
};

export default DisplayEvent;