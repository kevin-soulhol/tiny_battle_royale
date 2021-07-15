import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import Logo from "../components/mini_components/Logo"

const variant = {
    init: { background: "linear-gradient(-45deg, #33739D, #034874)" },
    visible: { background: "linear-gradient(-45deg, #EE7752, #E73C7E)" }
}

const HeaderGame = (props) => {

    return (
        <div className="headergame">
            <AnimatePresence>
                    <motion.div
                        animate={ !props.change ? "visible" : "init"}
                        transition={{ duration: 1 }}
                        variants={variant}
                        //className={!props.change ? "background paused" : "background"}
                        className="background paused"
                    ></motion.div>

            </AnimatePresence>
            <Logo />

        </div>
    );
};

export default HeaderGame;