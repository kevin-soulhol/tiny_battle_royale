import React, { useState } from 'react';
import Img from "gatsby-image"

import CloseCross from '../components/mini_components/close_cross'

const Imgplayer = (props) => {

  const ADD = props.add ? true : false
  const img_fluid = props.fluid



  const add_players = () => {
    props.adder()
  }

  const delete_players = () => {
    props.deleter(props.index)
  }

  const handleChange = (e) => {
    props.changerName(props.index, e.target.value)
  }

  const handleClickImage = () => {
    props.openerImage(props.index)
  }


  if (!ADD) {
    return (
      <div className="img_player">
        <div
          className="containImg"
          onClick={handleClickImage}>
          <Img fluid={img_fluid} />
        </div>
        <div className="close" onClick={delete_players}><CloseCross /></div>
        <input
          className="name_player"
          type="text" value={props.nom}
          placeholder="Quel nom ?"
          onChange={handleChange} />
      </div>
    )
  } else {
    return (

      <div className="img_player add" onClick={add_players}>
        <div className="containImg">
          +<br />Ajouter un joueur
        </div>
      </div>
    )
  }

};

export default Imgplayer;
