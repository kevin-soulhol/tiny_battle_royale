

export default class Player {
    constructor(index, name, fluid, carac) {
        this.index = index
        this.name = name ? name : "Number " + index
        this.fluid = fluid

        this.CARAC = {
            FORCE: carac?.FORCE ?? Math.floor(Math.random() * Math.floor(4)), //carrure et force
            RAPIDITE: carac?.RAPIDITE ?? Math.floor(Math.random() * Math.floor(4)), //fuit
            SURVIE: carac?.SURVIE ?? Math.floor(Math.random() * Math.floor(4)), //trouve moyen avec la nature
            CHARME: carac?.CHARME ?? Math.floor(Math.random() * Math.floor(4)), //peut avoir des sponsors
            FIGHT: carac?.FIGHT ?? Math.floor(Math.random() * Math.floor(4)), // capacité de combats
            CHANCE: carac?.CHANCE ?? Math.floor(Math.random() * Math.floor(4))
        }
        this.CARAC.PV = carac?.PV ?? 4 + (this.CARAC.FORCE / 2)
        this.CARAC.DEGAT = carac?.DEGAT ?? 1 + (this.CARAC.FORCE / 2)

        /** Chaque participant a des caracteristiques qui vont l'aider ou non a faire face aux events */

        this.ALIVE = true
        this.is_group = false
        this.is_love = false
        this.is_zombie = false
        this.hidden = false

        this.phrases = []
        this.membre_phrase = []
    }


    /**
 * return false si tué
 */
    set_life(number, text_death) {
        this.CARAC.PV += parseInt(number)
        if (this.CARAC.PV <= 0) {
            this.ALIVE = false
            return false
        }
        return true
    }

    is_dead() {
        if (this.ALIVE == false || this.CARAC.PV < 1) {
            return true
        } else {
            return false
        }
    }

    zombify() {
        this.is_zombie = true;
        this.text_death = this.get_phrase("dead_by_zomby")
        this.CARAC.PV = 5
        this.CARAC.FIGHTER = 3
        this.CARAC.DEGAT = 10
        this.CARAC.CHANCE = 10
        this.name = "Zombie " + this.name
        this.ALIVE = false

    }

    group(player) {

        let newgroup = new Player(
            new Date().getTime(),
            this.name + " et " + player.name,
            [this.fluid, player.fluid],
            {
                FORCE: this.CARAC.FORCE + player.CARAC.FORCE,
                RAPIDITE: this.CARAC.RAPIDITE + player.CARAC.RAPIDITE,
                SURVIE: this.CARAC.SURVIE + player.CARAC.SURVIE,
                CHARME: this.CARAC.CHARME + player.CARAC.CHARME,
                FIGHT: this.CARAC.FIGHT + player.CARAC.FIGHT,
                CHANCE: this.CARAC.CHANCE + player.CARAC.CHANCE,
            }
        )

        if (!newgroup.membres) {
            newgroup.membres = []
        }

        newgroup.membres.push(this)
        newgroup.membres.push(player)


        //on récupère tous les membres pour afficher les photos
        if (!newgroup.all_photo) {
            newgroup.all_photo = []
        }

        if (this.all_photo && this.all_photo.length > 1) {
            const array3 = [...newgroup.all_photo, ...this.all_photo]
            newgroup.all_photo = array3
        } else {
            newgroup.all_photo.push(this)
        }

        if (player.all_photo && player.all_photo.length > 1) {
            const array3 = [...newgroup.all_photo, ...player.all_photo]
            newgroup.all_photo = array3
        } else {
            newgroup.all_photo.push(player)
        }

        for (let i in newgroup.all_photo) {
            newgroup.all_photo[i].in_group = true
        }

        newgroup.is_group = true
        newgroup.passion = 7


        newgroup.name = ""
        for (let i in newgroup.all_photo) {
            if (i == 0) {
                newgroup.name = newgroup.all_photo[i].name
            } else if (i >= newgroup.all_photo.length - 1) {
                newgroup.name = newgroup.name + " et " + newgroup.all_photo[i].name
            } else {
                newgroup.name = newgroup.name + ", " + newgroup.all_photo[i].name

            }
        }


        return newgroup
    }

    degroup() {
        if (this.membres) {
            let players = []
            for (let i in this.membres) {
                this.membres[i].in_group = false
                players.push(this.membres[i])

            }

            this.ALIVE = false

            return players
        }
    }


    /**
     * return false si la cible (who) meurt
     * @param {*} who 
     * @returns 
     */
    frappe(who) {
        if (!this.roll_dice("FIGHT", who.CARAC.FIGHTER)) {
            return true
        }

        //-this.CARAC.DEGAT
        if (!who.set_life(-this.CARAC.DEGAT)) {
            return false
        }


        return true
    }



    roll_dice(on_what, difficulte = 10, return_number = false) {
        let result = Math.floor(Math.random() * Math.floor(20));
        if (on_what) {
            result = result + this.CARAC[on_what]
        }

        if (return_number) {
            return result
        }

        if (result > difficulte) {
            return true
        } else {
            return false
        }
    }



    /**
     * 
     * @param {*} cas 
     * @param {*} options { nombre : singulier|pluriel }
    */
    get_phrase(cas, options, cas_precision = false) {
        let phrases = {}
        let player2 = options?.player2 ?? false
        let winner = options?.winner ?? false
        let loser = options?.loser ?? false
        let death = options?.death ?? false

        switch (cas) {
            case "fight":
                phrases = {
                    singulier: [
                        "se bat"
                    ],
                    pluriel: [
                        "se battent"
                    ]
                }

                if (winner && loser) {
                    phrases = {
                        singulier: [
                            "se bat"
                        ],
                        pluriel: [
                            "se battent, mais " + loser.name + " réussi" + (loser.is_group ? "ssent" : "t") + " à s'enfuir",
                            "se croisent. " + winner.name + " réussi" + (winner.is_group ? "ssent" : "t") + " à mettre plusieurs coups mais ne peu" + (winner.is_group ? "vent" : "t") + " l'achever",
                            "se rentrent dedans. " + winner.name + (winner.is_group ? " ont" : " a") + " l'avantage mais ça ne suffit pas",
                            "se tabassent la gueule. " + loser.name + " s'enfui" + (loser.is_group ? "ent" : "t") + " avant d'y passer",
                            "échangent des coups. " + winner.name + (winner.is_group ? " ont" : " a") + " un léger avantage"
                        ]
                    }

                }

                if (winner && death) {
                    phrases = {
                        singulier: [
                            "se bat"
                        ],
                        pluriel: [
                            "se battent jusqu'à la mort. Pas de chance pour " + death.name,
                            "se foutent sur la gueule. " + winner.name + " s'en tire" + (winner.is_group ? "nt" : "") + " vainqueur",
                            "Violence, coups et blessures ! Sale moment pour " + death.name,
                            "échangent des coups. Mais " + winner.name + " en échange" + (winner.is_group ? "nt" : "") + " plus"

                        ]
                    }

                }


                break;


            case "run_away":
                if (player2) {
                    phrases = {
                        singulier: [
                            "fuit la rencontre avec " + player2.name + " à la vitesse d'un guépard",
                            "choisit le courage discret de la fuite face à " + player2.name,
                            "n'hésite pas à prendre ses pieds à son cou face à " + player2.name,
                            "se dissimule dans un fourré pour ne pas être vu par " + player2.name
                        ],
                        pluriel: [
                            "fuient la rencontre avec " + player2.name + " à la vitesse d'un guépard",
                            "choisissent le courage discret de la fuite face à " + player2.name,
                            "n'hésitent pas à prendre ses pieds à son coup face à " + player2.name,
                            "se dissimulent dans un fourré pour ne pas être vu par " + player2.name
                        ]
                    }
                } else {
                    phrases = {
                        singulier: [
                            "fuit la rencontre avec la vitesse d'un guépard",
                            "choisit le courage discret de la fuite",
                            "n'hésite pas à prendre ses pieds à son cou",
                            "se dissimule dans un fourré pour ne pas être vu"
                        ],
                        pluriel: [
                            "fuient la rencontre avec la vitesse d'un guépard",
                            "choisissent le courage discret de la fuite",
                            "n'hésitent pas à prendre leur pieds à son cou",
                            "se dissimulent dans un fourré pour ne pas être vu"
                        ]
                    }
                }

                break;



            case "group":
                phrases = {
                    singulier: [
                        "décide de faire un bout de chemin avec quelqu'un d'autre"
                    ],
                    pluriel: [
                        "décident que l'union fait la force.",
                        "choisissent de constituer un groupe",
                        "se mettent d'accord pour se suivre l'un l'autre, pour l'instant",
                        "joigent leur force (jusqu'à une future trahison)"
                    ]
                }
                break;




            case "degroup":
                phrases = {
                    singulier: [
                        "décide que, finalement, la jouer solitaire c'est pas plus mal"
                    ],
                    pluriel: [
                        "décident que, finalement, la jouer solitaire, c'est pas plus mal",
                        "se trahissent l'un l'autre",
                        "se quittent en bon terme, mais prêt à se tuer l'un l'autre",
                        "décident de mettre fin à leur alliance",
                        "mettent fin à leur 'joyeuse' communauté",
                    ]
                }

                break;



            case "lovers_end":
                phrases = {
                    singulier: [
                        "décide que, finalement, la jouer solitaire c'est pas plus mal"
                    ],
                    pluriel: [
                        "L'amour, c'est pour les romans et les chochottes. C'est la fin de leur amour !",
                        "Sur le terrain, l'amour n'a pas sa place ! Le couple se sépare",
                        "L'argent et la gloire semble être plus important que l'amour sur le terrain. C'est la fin de leur couple..."
                    ]
                }
                break;


            case "love":
                phrases = {
                    singulier: [
                        "décide de se mettre en couple malgré le jeu"
                    ],
                    pluriel: [
                        "Cupidon a planté sa flèche dans leur groupe. Il semble qu'une relation amoureuse se soit formé",
                        "ont trouvé plus qu'un coéquipier l'un dans l'autre et forment maintenant un couple",
                        "Le jeu n'a pas suffit à empêcher l'amour de se montrer. Les voici en couple !"
                    ]
                }
                break;




            case "delove":
                phrases = {
                    singulier: [
                        "ne peut plus tenir ainsi. Il est temps de reprendre sa liberté !"
                    ],
                    pluriel: [
                        "décident d'un commun accord que l'amour ne vaut pas le jeu"
                    ]
                }
                break;




            case "tisse_lien":
                phrases = {
                    singulier: [
                        "a la chance de passer un peu de temps tranquillement et se repose donc",
                        "discute au bord d'un lac et tisse des liens",
                        "profite du coucher de soleil"
                    ],
                    pluriel: [
                        "ont la chance de passer un peu de temps tranquillement et se reposent donc",
                        "discutent au bord d'un lac et tissent des liens",
                        "profitent du coucher de soleil ensemble",
                        "ont passé la journée à discuter et apprendre à se connaître"
                    ]
                }
                break;




            case "break_lien":
                phrases = {
                    singulier: [
                        "a une sévère dispute concernant la suite des évènements",
                        "ne partage pas du tout les mêmes idées concernant le conflit Israelo-Palestinien",
                        "a insulté sous le coup de la pression"
                    ],
                    pluriel: [
                        "ont une sévère dispute concernant la suite des évènements",
                        "ne partagent pas du tout les mêmes idées concernant le conflit Israelo-Palestinien",
                        "se sont insultés sous le coup de la pression"
                    ]
                }
                break;



            case "test":
                phrases = {
                    singulier: [
                        "???? singulier"
                    ],
                    pluriel: [
                        "???? pluriel"
                    ]
                }
                break;


            case "zombify":
                phrases = {
                    singulier: [
                        "se fait mordre par un cadavre",
                        "se fait mordre par un fou qui semble particulièrement fatigué... ou mort"
                    ],
                    pluriel: [
                        "se font mordre par un cadavre",
                        "se font mordre par un fou qui semble particulièrement fatigué... ou mort"
                    ]
                }
                break;



            case "zomby":
                phrases = {
                    singulier: [
                        "erre sans but",
                        "dévore un lapin malchanceux",
                        "fait des grognements de gorge",
                        "avance bêtement les bras tendus",
                        "espère trouver un humain à bouffer",
                        "se tamponne contre une porte sans comprendre qu'il faut l'ouvrir",
                        "perd un bras",
                        "aimerait trouver l'amour.... non, grogne seulement !"
                    ],
                    pluriel: [
                        "errent sans but"
                    ]
                }
                break;




            default:
                phrases = {
                    singulier: [
                        "n'a pas été aperçu par nos caméras aujourd'hui"
                    ],
                    pluriel: [
                        "n'ont pas été aperçu par nos caméras aujourd'hui"
                    ]
                }
                break;
        }


        if (this.is_group) {
            this.text = phrases.pluriel[Math.floor(Math.random() * phrases.pluriel.length)]
        } else {
            this.text = phrases.singulier[Math.floor(Math.random() * phrases.singulier.length)]
        }
        return this.text
    }

}