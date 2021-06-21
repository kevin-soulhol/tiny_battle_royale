let default_id = 0

function id_up(){
    default_id++
    return default_id
}

export default class Player{
    constructor(obj_game, nom, carac = {FORCE : false, RAPIDITE : false, SURVIE : false, CHARME : false, CHANCE : false, PV : false, DEGAT : false}, group = false){
        this.id = default_id
        id_up()
        this.OBJGAME = obj_game



        this.NAME = nom.name
        this.IMG = nom.img
        this.CARAC = {
            FORCE : carac.FORCE ? carac.FORCE : Math.floor(Math.random() * Math.floor(4)), //carrure et force
            RAPIDITE : carac.RAPIDITE ? carac.RAPIDITE : Math.floor(Math.random() * Math.floor(4)), //fuit
            SURVIE : carac.SURVIE ? carac.SURVIE : Math.floor(Math.random() * Math.floor(4)), //trouve moyen avec la nature
            CHARME : carac.CHARME ? carac.CHARME : Math.floor(Math.random() * Math.floor(4)), //peut avoir des sponsors
            FIGHTER : carac.FIGHTER ? carac.FIGHTER : Math.floor(Math.random() * Math.floor(4)), // capacité de combats
            CHANCE : carac.CHANCE ? carac.CHANCE : Math.floor(Math.random() * Math.floor(4))
        }
        this.CARAC.PV = carac.PV ? carac.PV :  4 + (this.CARAC.FORCE/2)
        this.CARAC.DEGAT = carac.DEGAT ? carac.DEGAT : 1+(this.CARAC.FORCE/2)

        /** Chaque participant a des caracteristiques qui vont l'aider ou non a faire face aux events */

        this.ALIVE = true
        this.is_group = false
        this.is_love = false
        this.zombie = false
        this.hidden = false

        this.phrases = []
        this.members = []
        this.membre_phrase = []
    }

    /********************************* GET */
    get nom_propre(){
        return "<span class='nom'>"+this.NAME+"</span>"
    }

    get bloc_resume_journey(){
        //pour la phrase
        let r = ''
        if(this.phrases.length == 0){
            return false
        } else {
            for(let i in this.phrases){
                r += this.phrases[i] + ".<br/>"
            }
        }

        //pour les images
        let participants = []
        if(this.is_group){
            for( let i in this.is_group){
                participants.push(this.is_group[i])
            }
        } else {
            participants.push(this)
        }

        for( let i in this.members){
            if(this.members[i].is_group){
                for( let t in this.members[i].is_group){
                    participants.push(this.members[i].is_group[t])
                }
            } else {
                participants.push(this.members[i])
            }
        }

        /*console.log("participants")
        console.log(participants)*/


        //return createBlocEvent(r, participants)
    }

    /********************************* SET */
    /**
     * return false si tué
     */
    set_life(number, text_death){
        this.CARAC.PV += parseInt(number)
        if(this.CARAC.PV <= 0){
            this.die(text_death)
            return false
        }
        return true
    }

    /**
     * 
     * @param {string | array} textsolo 
     * @param {string | array} textgroup 
     * @param {bool} without_name 
     */
    set_phrase({textsolo, textgroup=false, without_name = false}){
        let final_text = ''
        let use = false
        
        if(!without_name){
            final_text += this.nom_propre + " "
        }

        if(this.is_group && textgroup){
            use = textgroup
        } else {
            use = textsolo
        }

        if(Array.isArray(use)){
            final_text += use[Math.floor(Math.random() * Math.floor(use.length))]
        } else {
            final_text += use
        }

        this.phrases.push(final_text)
    }

    /**
     * 
     * @param {string|array} text 
     */
    set_dead_phrase(text){
        this.dead_phrase = Array.isArray(text) ? text[Math.floor(Math.random() * Math.floor(text.length))] : text
    }

    /********************************* ACTIONS */
    event(special_event = false){
        //on récupère un event
        let event
        if(this.OBJGAME.ALL_EVENTS[special_event.id]){
            event = this.OBJGAME.ALL_EVENTS[special_event.id][Math.floor(Math.random() * Math.floor(this.OBJGAME.ALL_EVENTS[special_event.id].length))]
        } else {
            event = this.OBJGAME.ALL_EVENTS.main[Math.floor(Math.random() * Math.floor(this.OBJGAME.ALL_EVENTS.main.length))]
        }
        
        //on lance le dé pour
        let dice = this.throw_dice(event.on, event.diff, true)
        let problm

        let text = ''
        let text_gr = ''
        if(dice > 20){//reussite critique
            text_gr =  event.text_gr ? event.text_gr.crit_win : event.text.crit_win
            text = event.text.crit_win
            problm = event.result.crit_win
        } else if(dice < 1){ // echec critique
            text_gr =  event.text_gr ? event.text_gr.crit_lose : event.text.crit_lose
            text = event.text.crit_lose
            problm = event.result.crit_lose
        } else if(dice > event.diff){ //reussite simple
            text_gr =  event.text_gr ? event.text_gr.win : event.text.win
            text = event.text.win
            problm = event.result.win
        } else { //echec
            text_gr = event.text_gr ? event.text_gr.lose : event.text.lose
            text = event.text.lose
            problm = event.result.lose
        }
        this.set_phrase({textsolo : text, textgroup : text_gr})

        this.OCCUPED = true
        let death_phrase = event.result.death
        if(this.is_group){ death_phrase = event.result.death_gr ? event.result.death_gr : event.result.death}
        this.resolve(problm, death_phrase)
    }

    resolve(event, phrase_dead){
        switch(event.carac){
            case "PV":
                this.set_life(event.number, phrase_dead)
                break;
            case "DEGAT":
                this.CARAC.DEGAT += event.number
                break;
            case "CHARME":
                this.CARAC.CHARME += event.number
                break;
            case "SURVIE":
                this.CARAC.SURVIE += event.number
                break;
            case "ZOMBIE" :
                this.zombify()
                break;
            default :
                break;
            
        }

    }

    die(text_death){
        this.ALIVE = false
        this.set_dead_phrase(text_death)

        if(this.is_group){
            for(let i in this.is_group){
                this.is_group[i].ALIVE = false
            }
        }
        
        this.OBJGAME.DEADS.push(this)
    }

    /**
     * retourne false si who est tué
     * @param {obj} who 
     */
    frappe(who){
        if(!this.throw_dice("FIGHTER", who.CARAC.FIGHTER)){
            return true
        }

        let text_death = ''
        if(this.is_zombie){
            text_death = "a été dévoré par "+this.nom_propre
        } else {
            if(who.is_group){
                text_death = "sont décédés sous les coups de "+this.nom_propre
            } else {
                text_death = "a été tué par "+this.nom_propre
            }
        }
        if(!who.set_life(-this.CARAC.DEGAT, text_death )){
            return false
        }

        return true
    }

    zombify(){
        this.set_phrase(this.OBJGAME.all_phrases_array("zombify"))
        this.is_zombie = true
        this.IMG = "url(./assets/img/profil_zombi.png)"
        for(let i in this.CARAC){
            this.CARAC[i] = 0
        }
        this.CARAC.PV = 9999
        this.CARAC.FIGHTER = 3
        this.CARAC.DEGAT = 10
        this.CARAC.CHANCE = 10
        this.NAME = "Zombie "+this.NAME
    }

    love(){
        this.is_love = true
        this.set_phrase(this.OBJGAME.all_phrases_array("love"))
        this.NAME = this.NAME + " (❤️)"
        this.set_life(+10)
        this.difficulte_keep_group = 1

        for(let i in this.is_group){
            this.is_group[i].love_group = this.id
        }
    }

    /**
     * retourne si il réussit ou non
     * @param {string} on_what 
     * @param {int} difficulte 
     * @param {boolean} return_number Est-ce que le résultat est le jet de dé ou juste un bool
     */
    throw_dice(on_what, difficulte = 10, return_number = false){
        let result = Math.floor(Math.random() * Math.floor(20));
        if(on_what){
            result = result + this.CARAC[on_what]
        }

        if(return_number){
            return result
        }

        if(result > difficulte){
            return true
        } else {
            return false
        }
    }
    

    
    /********************************* RETURN ZERO */
    delete_phrases(){
        this.phrases = []
        this.membre_phrase = []
    }

}
