import Player from "./player.class"


export default class Game {
    constructor(players, allEvents) {
        return new Promise((r, f) => {
            /** VARIABLES */
            this.PLAYERS = []
            players.map((player) => {
                let newPlay = new Player(player.index, player.nom, player.fluid)
                this.PLAYERS.push(newPlay)
            })


            this.SPECIALEVENT = false
            this.PARTICIPANTS_DAY = []
            this.DEADS = []
            this.LAST_DEADS = []
            this.GROUPS = []
            this.ZOMBIES = []
            this.TO_ZOMBIFY = []


            this.DAY = 0
            this.EVENTS = allEvents
            for (let i in this.EVENTS) {
                this.EVENTS[i] = this.randomize(this.EVENTS[i])
            }


            this.difficulte_rencontre = 14 // 14
            this.difficulte_charmer = 13 // 13
            this.difficulte_cacher = 18 // 18
            this.difficulte_keep_group = 10 // 10
            this.difficulte_amour = 20 //20
            this.difficulte_keep_love = 3 //3
            this.difficulte_win_love = 24 // 24
            this.difficulte_tisse_lien = 10 //10
            this.passion_step = { love: 18, quit_group: 3 }

            this.avantages_love = 5

            r(this)
        })
    }


    /*********************************** SET */

    set_day(number) {
        this.DAY = parseInt(number) + this.DAY

        //chaque nouveau jour, changement :
        this.difficulte_rencontre--
        this.difficulte_charmer++
    }


    /*********************************** ACTIONS */

    async start_day() {

        console.log("----------C'EST PARTI !---------")


        // MISE A JOUR AVANT JEU
        this.SPECIALEVENT = null
        this.SPECIALEVENT = {}
        await this.mise_a_jour_players()

        //Il n'y a plus de joueurs. Fin du jeu
        let is_end = this.is_end()
        if (is_end.endgame) {
            return false
        }


        //préparation de la journée
        this.set_day(1)
        let event_type = await this.choose_special_day() ?? false
   
      
        if(event_type && event_type.index){
            this.SPECIALEVENT = event_type
            event_type = event_type.index

        } else if(event_type != "main"){
            this.SPECIALEVENT = {
                index : event_type,
                name : this.EVENTS[event_type][0].name,
                desc : this.EVENTS[event_type][0].desc
            }
        } else {
            this.SPECIALEVENT = false
        }


        // JOURNEE : PREPARATION AFFICHAGE

        this.PLAYERS = this.randomize(this.PLAYERS)

        this.CACHE_PARTICIPANTS_DAY = await this.recup_participants_day()
        for (let i in this.CACHE_PARTICIPANTS_DAY) {
            let player = this.CACHE_PARTICIPANTS_DAY[i]
            let event = this.EVENTS[event_type][Math.floor(Math.random() * this.EVENTS[event_type].length)]
            

            let participant = await this.do_day(player, event)
            
            if (participant) { this.PARTICIPANTS_DAY.push(participant) }

        }

        console.log(this)
        return this.PARTICIPANTS_DAY

    }

    /**
     * Prépare l'affichage et l'activité du joueur
     * @param {*} player 
     * @param {*} event 
     */
    async do_day(player, event) {

        return new Promise((r, f) => {

            let new_group = false
            let meet = false
            player.action = player.action ? player.action : false
            //que fait-il ?
            if (!player.action) {

                if (player.is_group && !player.is_love && !this.SPECIALEVENT.index ) {
                    //SI GROUPE
                    // GERE LA PASSION ENTRE EUX
                    player = this.passion_and_love(player)
                }


                if (player.is_group && player.is_love && !player.action && !this.SPECIALEVENT.index ) {
                    //SI AMOUR
                    player = this.couple_is_love(player)
                }


                // RENCONTRES : peuvent s'éviter, se regrouper ou se battre
                if (!player.action && player.roll_dice("CHANCE", this.difficulte_rencontre) && (!this.SPECIALEVENT.index || this.SPECIALEVENT.index == "starter") ) {

                    //selection de la personne rencontrée
                    for (let i in this.CACHE_PARTICIPANTS_DAY) {
                        if (!this.CACHE_PARTICIPANTS_DAY[i].action && this.CACHE_PARTICIPANTS_DAY[i].index !== player.index) {
                            meet = this.CACHE_PARTICIPANTS_DAY[i]
                        }
                    }

                    if (meet) {
                        player.action = "meet"
                        //si meet est plus fort en combat, alors fuite
                        let dice = false
                        if (meet.CARAC.FIGHT > player.CARAC.FIGHT) {
                            dice = player.roll_dice("RAPIDITE", this.difficulte_cacher)
                        }

                        if (!dice) {

                            if (meet && this.CACHE_PARTICIPANTS_DAY.length > 2 && !meet.is_zombie && player.roll_dice("CHARME", this.difficulte_charmer)) {
                                player.action = "group"
                                meet.action = "group"
                                new_group = this.group(player, meet)

                            } else {
                                player.action = "fight"
                                meet.action = "fight"
                                let result = this.figth(player, meet)

                                if (result && result.death) {
                                    this.kill_player(result.death, "Mort sous les coups de " + result.winner.name)

                                    if (result.winner.is_zombie) {
                                        this.prepare_zombifying(result.death)
                                    }

                                }

                                new_group = this.group(player, meet, "fight", result)
                            }

                        } else {
                            player.action = "run_away"
                        }
                    }

                }


                //si aucun cas précédent, alors évènement aléatoire du fichier json
                if (!player.action) {
                    //EVENT ALEATOIRE
                    player.action = "aleatoire event"
                    if(player.is_zombie){
                        player.get_phrase("zomby")
                    } else {
                        this.do_event(player, event)
                    }

                } else {
                    if (!meet) { meet = false }

                    player.get_phrase(player.action, {
                        player2: meet
                    })
                }




                r(new_group ? new_group : player)
            } else {
                r(false)
            }


        })


    }



    async recup_participants_day() {
        return new Promise((r, f) => {
            let participants = []

            for (let i in this.PLAYERS) {
                let player = this.PLAYERS[i]

                if (!player.ALIVE && !player.is_zombie) {
                    continue
                } else if (player.in_group) {
                    continue
                } else {
                    participants.push(player)
                }
            }

            for (let i in this.GROUPS) {
                if (!this.GROUPS[i].ALIVE || this.GROUPS[i].hidden) {
                    continue
                }
                participants.push(this.GROUPS[i])
            }


            for(let i in this.ZOMBIES){
                participants.push(this.ZOMBIES[i])
            }

            r(participants)
        })
    }


    async mise_a_jour_players() {
        return new Promise((r, f) => {
            for (let i in this.PLAYERS) {
                let player = this.PLAYERS[i]

                if (player.next_move && player.next_move == "dead" && !player.is_zombie) {
                    this.DEADS.push(player)
                }

                this.PLAYERS[i].action = false
            }

            for (let i in this.GROUPS) {
                this.GROUPS[i].action = false
                if (this.GROUPS[i].next_move && this.GROUPS[i].next_move == "degroup") {
                    this.GROUPS[i].action = "degroup"
                    for (let d in this.GROUPS[i].membres) {
                        this.GROUPS[i].membres[d].in_group = false

                        //si l'un des membres est un groupe, alors il revient comme tel
                        if (this.GROUPS[i].membres[d].is_group) {
                            this.GROUPS[i].membres[d].hidden = false
                        }
                    }
                    delete this.GROUPS[i]
                }
            }

            for(let i in this.ZOMBIES){
                this.ZOMBIES[i].action = false
            }

            this.last_deads_to_deads().then(() => {
                r(true)
            })

        })
    }

    choose_special_day() {
        return new Promise((r, f) => {
            let result = {}
            switch (this.DAY) {
                case 1:
                    result = {
                        index : "starter",  
                        name: "Coup d'envoi",
                        desc: "Les joueurs s'élancent sur le terrain, chacun pour soi et les combats commencent déjà !"
                    }
                    break;

                //case 2:
                case 5:
                case 10:
                    let events = [
                        "cold",
                        "sun",
                        "troupeau",
                        "tempete",
                        "volcan"
                    ]
                    result = events[Math.floor(Math.random() * events.length)]
                    result = "volcan";
                    break;

                default:
                    result = "main"
                    break;
            }

            r(result)
        })
    }


    last_deads_to_deads() {
        return new Promise((r, f) => {

            let indexer = []
            let copy = this.PLAYERS
            let copy_zomby = this.TO_ZOMBIFY

            for (let i in this.LAST_DEADS) {
                if (!this.LAST_DEADS[i].is_zombie) {
                    indexer.push(this.LAST_DEADS[i].index)
                    this.DEADS.push(this.LAST_DEADS[i])
                }
            }

            for (let i in this.PLAYERS) {
                if (indexer.indexOf(this.PLAYERS[i].index) >= 0) {
                    delete copy[i]
                }
            }

            for(let i in this.TO_ZOMBIFY){
                this.ZOMBIES.push(this.TO_ZOMBIFY[i])
                this.TO_ZOMBIFY[i].zombify()
                delete copy_zomby[i]
            }


            this.PLAYERS = copy.filter(function (n) { return n != undefined });
            this.TO_ZOMBIFY = copy_zomby.filter(function (n) { return n != undefined });

            this.LAST_DEADS = []
            this.PARTICIPANTS_DAY = []
            r(true)


        })

    }

    delete_player_from_PLAYERS(player, replace = false) {
        return new Promise((r, f) => {
            let copy = this.PLAYERS
            for (let i in this.PLAYERS) {
                if (this.PLAYERS[i].index == player.index) {
                    if (!replace) {
                        delete copy[i]
                    } else {
                        copy[i] = replace
                    }
                }
            }

            this.PLAYERS = copy
            r(copy)

        })

    }

    delete_group_from_GROUPS(group) {
        let copy = this.GROUPS
        for (let i in this.GROUPS) {
            if (this.GROUPS[i].index == group.index) {
                delete copy[i]
            }
        }

        this.GROUPS = copy
    }

    is_end() {
        //fin d'une personne
        //fin d'un groupe
        //fin lover
        //fin zombie

        let result = {
            endgame: false,
            winner: false
        }

        //si il reste un groupe
        let group_alive = 0
        let last_group = false
        for (let i in this.GROUPS) {
            if (this.GROUPS[i].ALIVE && !this.GROUPS[i].hidden) {
                group_alive++
                last_group = this.GROUPS[i]
            }
        }

        //si tout le monde est mort sauf 1
        let players_alive = 0
        let zomby_alive = 0
        let last_player = false
        for (let i in this.PLAYERS) {
            if (this.PLAYERS[i].ALIVE == true) {
                players_alive++
                last_player = this.PLAYERS[i]
            }
            if(this.PLAYERS[i].is_zombie){
                zomby_alive++
            }
        }





        //Analyse des résultats
        if (players_alive == 1 && !zomby_alive) {
            //qu'un seul survivant
            result.endgame = true
            result.winner = last_player
        } else if(zomby_alive == players_alive){
            //que des zombies restants
            result.endgame = true
            result.winner = {name : "Zombicalipse !", text_win : "Les zombies ont pris le contrôle du terrain ! J'espère que nos équipes arriveront à les contenir avant que tout cela ne dégènère..."}
        } else if (last_group && players_alive <= last_group.all_photo.length && group_alive == 1) {
            //qu'un groupe survivant = degroup
            result.endgame = false
            last_group.passion = -999
            this.difficulte_charmer = 900 // empêche de se remettre ensemble
        } else if(!players_alive && !last_group){
            result.endgame = true
            result.winner = {name : "Personne", text_win : "Incroyable ! Tout le monde est mort sur la dernière ligne droite ! Ce n'est pas arrivé depuis les années 80'"}
        }


        if (result.winner) {
            this.WINNER = result.winner
        }
        return result
    }

    /*********************************** EVENTS */

    /**
     * Vérifie chaque tour, pour un groupe non amoureux, si leurs liens se tissent ou se dégradent.
     * Passé un niveau de passion, ils tombent amoureux. En dessous d'un autre, ils quittent le groupe (this.passion_step{love, quit_group})
     * @param {*} player_group 
     * @returns 
     */
    passion_and_love(player_group) {


        if (player_group.passion >= this.passion_step.love) {
            player_group.action = "love"
            this.love(player_group)
        } else if (player_group.passion <= this.passion_step.quit_group) {
            player_group.action = "degroup"
            player_group.next_move = "degroup"
        } else {
            let dice = player_group.roll_dice("CHARME", this.difficulte_tisse_lien, true)
            if (dice >= 20) {
                player_group.action = "tisse_lien"
                player_group.passion = player_group.passion + 8

            } else if (dice <= 2) {
                player_group.action = "break_lien"
                player_group.passion = player_group.passion - 5

            } else if (dice < 9) {
                player_group.passion = player_group.passion - 1

            } else {
                player_group.passion = player_group.passion + 1

            }
        }

        return player_group

    }


    /**
     * Verifie que le couple tiennent toujours.
     * @param {*} player_lovers 
     * @returns 
     */
    couple_is_love(player_lovers) {
        let dice = player_lovers.roll_dice("CHARME", this.difficulte_keep_love, true)
        if (dice >= 20) {
        } else if (dice <= 0) {
            player_lovers.action = "delove"
            player_lovers.next_move = "degroup"
        } else if (dice > this.difficulte_keep_love - player_lovers.passion) {
            player_lovers.action = "tisse_liens"
            player_lovers.passion = player_lovers.passion ? 5 : player_lovers.passion + 5
        } else {
            player_lovers.passion = player_lovers.passion ? 0.1 : player_lovers.passion + 0.1
        }


        return player_lovers
    }


    do_event(player, event) {
        let dice_result_event = player.roll_dice(event.on, event.diff, true)


        if (dice_result_event == 0) {
            player.text = player.is_group ? event.text_gr?.crit_lose??"" : event.text.crit_lose
            this.result_event(player, event, "crit_lose")
            player.result_event = "damage"

        } else if (dice_result_event == 20) {
            player.text = player.is_group ? event.text_gr?.crit_win?? "" : event.text.crit_win
            this.result_event(player, event, "crit_win")
            player.result_event = "default"

        } else if (dice_result_event < event.diff) {
            player.text = player.is_group ? event.text_gr?.lose?? "" : event.text.lose
            this.result_event(player, event, "lose")
            player.result_event = "damage"
            //player.CARAC.PV = 0

        } else {
            player.text = player.is_group ? event.text_gr?.win??"" : event.text.win
            this.result_event(player, event, "win")
            player.result_event = "default"
        }

        if (Array.isArray(player.text)) {
            player.text = player.text[Math.floor(Math.random() * player.text.length)]
        }

        if(player.CARAC.PV <= 0){
            this.kill_player(player, event.result.death)
        }
    }


    result_event(player, event, win_or_lose) {
        if (event.result[win_or_lose].carac == "ZOMBIE" ) {
            this.prepare_zombifying(player)
            this.kill_player(player, "a été mordu par un zombie.")
        } else {
            player.CARAC[event.result[win_or_lose].carac] = player.CARAC[event.result[win_or_lose].carac] + parseInt(event.result[win_or_lose].number)
        }

    }

    /*********************************** ON PLAYER */

    kill_player(player, text) {
        this.LAST_DEADS.push(player)
        player.next_move = "dead"
        player.text_death = text ? text : "Mort de raisons inconnues"
        if (player.is_group) {
            for (let i in player.membres) {
                this.kill_player(player.membres[i])
                player.membres[i].hidden = true
            }
        }
    }

    love(player) {
        let newname = "Couple"
        for (let i in player.membres) {
            newname = newname + ((i == 0) ? " " : " et ") + player.membres[i].name
        }
        player.is_love = true
        player.get_phrase("love")
        player.name = newname
        for (let i in player.CARAC) {
            player.CARAC[i] += this.avantages_love
        }
    }


    /**
     * Retourne {winner : le gagnant, death : si l'un des deux est mort} si quelqu'un meurt
     * @param {*} player1 
     * @param {*} player2 
     * @returns 
     */
    figth(player1, player2) {
        let result = {
            winner: false,
            death: false,
            loser: false
        }

        //on fait le combat
        let coup = 3
        for (let i = 0; i <= coup; i++) {
            if (i % 2 === 0) {
                if (!player1.frappe(player2)) {
                    //player1 a tué player2
                    result.winner = player1
                    result.death = player2
                    result.loser = player2
                    return result

                }
            } else {
                if (!player2.frappe(player1)) {
                    //player2 a tué player1
                    result.winner = player2
                    result.death = player1
                    result.loser = player1
                    return result
                }
            }
        }

        //personne n'est mort
        if (player1.CARAC.PV > player2.CARAC.PV) {
            result.winner = player1
            result.loser = player2
        } else if (player2.CARAC.PV > player1.CARAC.PV) {
            result.winner = player2
            result.loser = player1
        } else {
            result.winner = player1
            result.loser = player2
        }
        return result

    }

    prepare_zombifying(player){
        this.TO_ZOMBIFY.push(player)
        player.ALIVE = false
        player.zombifing = true

    }


    async group(player1, player2, type = "group", result_fight) {
        let new_group = player1.group(player2)
        if (type == "fight" || type == "degroup") {
            new_group.next_move = "degroup"
        }
        new_group.get_phrase(type, (type == "fight") ? result_fight : false)
        new_group.action = type ?? false

        //on retire le groupe si il existait déjà
        if (player1.is_group) {
            player1.hidden = true
        }
        if (player2.is_group) {
            player2.hidden = true
        }


        this.GROUPS.push(new_group)

        return new_group
    }

    /*********************************** BONUS */

    randomize(arr) {

        var i, j, tmp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }
}



// groupe qui meurt : apparait aussi les membres comme mort lors de la nuit

//fin zombie + fin lovers


