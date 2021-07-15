

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
        let text = this.all_phrases_array("zombify")
        this.text_death = text.textsolo[0]
        this.CARAC.PV = 9999
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
        for(let i in newgroup.all_photo ){
            if(i == 0){
                newgroup.name = newgroup.all_photo[i].name
            } else if(i >= newgroup.all_photo.length-1){
                newgroup.name = newgroup.name + " et " + newgroup.all_photo[i].name
            } else {
                newgroup.name = newgroup.name + ", "+ newgroup.all_photo[i].name 
                
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
     * Retourne un tableau avec plusieurs choix de phrases selon la demande
     * @param {*} cas errance_zombie | fin_group | rencontre_hide_solo | rencontre_hide_group | former_group | fight_1_win_solo | fight_1_win_group | fight_2_win_solo | fight_2_win_group | fight_nodead_1_win_solo | fight_nodead_1_win_group | fight_nodead_2_win_solo | fight_nodead_2_win_group | fight_nodead_2_group_win_solo | fight_nodead_2_group_win_group | fight_equal_solo
     */
    all_phrases_array(cas, player2 = false, player1 = false) {
        let r = []
        let r_group = false
        let without_name = false
        switch (cas) {
            case "errance_zombie":
                r = [
                    "erre sans but",
                    "fait d'étranges sons de gorges",
                    "décide de suivre un bruit quelconque",
                    "cherche de la chaire fraîche"
                ]
                break;

            case "zombie_eat":
                if (player2 && player1) {
                    r = [
                        player1.nom_propre + " dévore " + (player2.is_group ? "les corps" : "le corps") + " de " + player2.nom_propre,
                        player2.nom_propre + " " + (player1.is_group ? "se font" : "se fait") + " entièrement bouffé par " + player1.nom_propre,
                        player1.nom_propre + " se jette sur " + (player2.is_group ? "les corps" : "le corps") + " délicieux de " + player2.nom_propre
                    ]
                    without_name = true
                } else {
                    r = [
                        "dévore un nouveau cadavre parmi les joueurs"
                    ]
                    r_group = [
                        "dévorent un nouveau cadavre parmi les joueurs"
                    ]

                }
                break;

            case "zombify":
                r = [
                    "a un effet étrange dans le corps, meurt, puis finalement se relève dans la non-mort", "ont un effet étrange dans le corps, meurent, puis finalement se relèvent ensemble dans la non-mort"
                ]
                break;

            case "fin_group":
                r = [
                    "se trahissent l'un l'autre",
                    "décident qu'il est grand temps de ne plus faire équipe",
                    "se séparent d'un commun accord"
                ]
                break;

            case "meet":
                if (player2 && player1) {
                    r = [
                        "croise " + player2.nom_propre,
                        "se laisse surprendre par " + player2.nom_propre
                    ]

                    r_group = [
                        "croisent " + player2.nom_propre,
                        "se laissent surprendre par " + player2.nom_propre
                    ]

                }
                break;

            case "meet_fight":
                if (player2 && player1) {
                    r = [
                        "se laisse surprendre par " + player2.nom_propre,
                        "combat contre " + player2.nom_propre,
                        "se lance dans un combat contre " + player2.nom_propre
                    ]

                    r_group = [
                        "se laissent surprendre par " + player2.nom_propre,
                        "combattent contre " + player2.nom_propre,
                        "se jettent sur " + player2.nom_propre
                    ]
                }
                break;

            case "rencontre_hide":
                if (player2) {
                    r = [
                        "repère " + player2.nom_propre + " et se dissimule avant d'être repéré",
                        "se dissimule dans un fourré avant que " + player2.nom_propre + " ne s'en " + (player2.is_group ? "aperçoivent" : "aperçoive"),
                        "voit " + player2.nom_propre + " et préfère se cacher",
                        "s'enfuit pour éviter la rencontre avec " + player2.nom_propre
                    ]
                    r_group = [
                        "repèrent " + player2.nom_propre + " et se dissimulent avant d'être repéré",
                        "se dissimulent dans un fourré avant que " + player2.nom_propre + " ne s'en " + (player2.is_group ? "aperçoivent" : "aperçoive"),
                        "voient " + player2.nom_propre + " et préfèrent se cacher",
                        "s'enfuient pour éviter la rencontre avec " + player2.nom_propre
                    ]
                } else {
                    r = "se dissimule dans un fourré après avoir entendu du bruit"
                    r_group = "se dissimulent dans un fourré après avoir entendu du bruit"
                }
                break;

            case "former_group":
                r = [
                    "La discussion leur permet d'arriver à un terrain d'attente",
                    "Les mots finissent par les rassembler en une seule équipe",
                    "Former un groupe semble être la meilleure solution pour le moment"
                ]
                without_name = true
                break;

            case "love":
                r = [
                    "finissent par tomber amoureux",
                    "ressentent une passion amoureuse et ne peuvent plus se quitter"
                ]
                break;

            case "fin_groupe":
                r = [
                    "décident de mettre fin à leur partenariat",
                    "pensent qu'il est grand temps de se trahir pour faire route en solitaire",
                    "se séparent de bon matin. Après tout, c'est chacun pour soit"
                ]
                break;

            case "fin_lovers_win":
                r = [
                    "prennent des baies empoisonnées et tentent de briser les règles du jeu. A l'instant où vous alliez les mettre à la bouche, vous êtes arrêtés par le jury...",
                    "discourent durant plusieurs minutes pour convaincre le public que l'amour est plus fort que tout..."
                ]
                break;

            case "fin_lovers_die":
                r = [
                    "prennent des baies empoisonnées et tentent de briser les règles du jeu. Mais cela ne convainct pas du tout le jury qui les laissent se suicider."
                ]
                break;

            case "fin_lovers_separate":
                if (player2) {
                    r = [
                        "L'amour est plus fort que tout, mais pas plus que l'argent et la renommé. " + player2.nom_propre + " se séparent donc et il ne pourra y avoir qu'un seul vainqueur"
                    ]
                } else {
                    r = [
                        "décident de se séparer malgré l'amour. Après tout, ce sont les règles..."
                    ]
                }
                without_name = true
                break;

            case "fight_win":
                if (player2 && player1) {
                    //player2 est le perdant du combat
                    r = [
                        player1.nom_propre + " contemple sa victoire au dessus " + (player2.is_group ? "des corps" : "du corps") + " de " + player2.nom_propre,
                        player1.nom_propre + " abandonne " + (player2.is_group ? "les corps meutris" : "le corps meutri") + " de " + player2.nom_propre,
                        player1.nom_propre + " l'emporte largement sur " + player2.nom_propre,
                        player2.nom_propre + " " + (player2.is_group ? "sont fracassés" : "est fracassé") + " par " + player1.nom_propre,
                        player2.nom_propre + " " + (player2.is_group ? "prennent" : "prend") + " coup sur coup et ne se " + (player2.is_group ? "relèvent" : "relève") + " plus"
                    ]
                    r_group = [
                        player1.nom_propre + " contemplent leur victoire au dessus " + (player2.is_group ? "des corps" : "du corps") + " de " + player2.nom_propre,
                        player1.nom_propre + " abandonnent " + (player2.is_group ? "les corps meutris" : "le corps meutri") + " de " + player2.nom_propre,
                        player1.nom_propre + " l'emportent largement sur " + player2.nom_propre,
                        player2.nom_propre + " " + (player2.is_group ? "sont fracassés" : "est fracassé") + " par " + player1.nom_propre,
                        player2.nom_propre + " " + (player2.is_group ? "prennent" : "prend") + " coup sur coup et ne se " + (player2.is_group ? "relèvent" : "relève") + " plus"
                    ]
                    without_name = true
                } else {
                    r = "L'issue du combat est incertaine"
                    without_name = true
                }
                break;

            case "fight_nodead_win":
                if (player2 && player1) {
                    //player1 est le gagnat
                    r = [
                        "Après un difficile combat, " + player1.nom_propre + " semble en meilleur état",
                        "Les combattants, blessés, se séparent tant bien que mal. " + player2.nom_propre + (player2.is_group ? "semblent" : "semble") + " en moins bon état",
                        "Après un difficile combat, " + player1.nom_propre + " laisse " + (player2.is_group ? "des" : "un") + " corps en sale état"
                    ]
                    r_group = [
                        "Après un difficile combat, " + player1.nom_propre + " ne terminent pas le travail",
                        "Les combattants, blessés, se séparent tant bien que mal. " + player1.nom_propre + " semblent en meilleur état",
                        "Après un difficile combat, " + player1.nom_propre + " laissent " + (player2.is_group ? "des" : "un") + " corps en sale état"
                    ]
                    without_name = true
                } else {
                    r = "fuit le combat"
                    r_group = "fuient le combat"
                }
                break;

            case "fight_equal_solo":
                r = [
                    "Après un combat acharné, la fuite est la meilleure solution",
                    "Le combat est finalement assez égal et aucun n'achève l'autre"
                ]
                without_name = true
                break;

            default:
                r = "s'est dissimulé à nos caméras"
                break;
        }

        return { textsolo: r, textgroup: r_group, without_name: without_name }
    }


    /**
     * 
     * @param {*} cas 
     * @param {*} options { nombre : singulier|pluriel }
    */
    get_phrase(cas, options) {
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
                            "se battent, mais " + loser.name + " réussi"+ (loser.is_group? "ssent" : "t") +" à s'enfuir",
                            "se croisent. " + winner.name + " réussi"+ (winner.is_group?"ssent" : "t") +" à mettre plusieurs coups mais ne peu"+ (winner.is_group?"vent":"t") +" l'achever",
                            "se rentrent dedans. " + winner.name + (winner.is_group?" ont" : " a") +" l'avantage mais ça ne suffit pas",
                            "se tabassent la gueule. " + loser.name + " s'enfui"+ (loser.is_group?"ent":"t") +" avant d'y passer",
                            "échangent des coups. " + winner.name + (winner.is_group? " ont" : " a") +" un léger avantage"
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
                            "se foutent sur la gueule. "+ winner.name +" s'en tire"+ (winner.is_group?"nt": "") +" vainqueur",
                            "Violence, coups et blessures ! Sale moment pour "+ death.name,
                            "échangent des coups. Mais "+ winner.name +" en échange"+ (winner.is_group?"nt":"") +" plus"

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
                            "se dissimule dans un fourré pour ne pas être vu par "+player2.name
                        ],
                        pluriel: [
                            "fuient la rencontre avec " + player2.name + " à la vitesse d'un guépard",
                            "choisissent le courage discret de la fuite face à " + player2.name,
                            "n'hésitent pas à prendre ses pieds à son coup face à " + player2.name,
                            "se dissimulent dans un fourré pour ne pas être vu par "+player2.name
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