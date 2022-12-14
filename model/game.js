/**
 * The Game class will serve as a front for us.
 * Game has a rawMaze argument which allows initialization of the game's Maze.
 * Game create automatically a pacman and 4 ghosts
 * this.specialghostDir is an array who contains the 4 direction in a certain order
 * this.indexSpecial is useful to browse specialghotDir
 */
class Game{
    constructor(rawMaze){
        this.game = rawMaze;
        this.pac = new Pacman("pacman", new Position(rawMaze.getPacmanSpawn().getRow(), rawMaze.getPacmanSpawn().getColumn()), Direction.WEST);
        this.ghosts = this.makeGhost();
        this.score = 0; 
        this.removeDot;
        this.highScore = localStorage.getItem('HighScore');
        this.specialGhostDir = [Direction.NORTH, Direction.SOUTH, Direction.WEST, Direction.EAST];
        this.indexSpecialDir = 0;
    }

    /**
     * Create a array of 4 ghosts
     * @returns ghosts[4]
     */
    makeGhost(){
        let tab = [];
        for(let i = 0; i < 4;i++){
            tab.push(new Ghost("empty", new Position(this.game.getGhostSpawn().getRow(), this.game.getGhostSpawn().getColumn()), this.makeRandomDir()))
            tab[i].choiceNewDirection();
        }
        return tab;
    }

    /**
     * Return a random direction
     * @returns Direction
     */
    makeRandomDir(){
        let random = Math.floor(Math.random() * 4) + 1;
        switch(random){
            case 1:
                return Direction.WEST;
            case 2:
                return Direction.EAST;
            case 3:
                return Direction.NORTH;
            default:
                return Direction.SOUTH;
        }
    }

    //getter for highscore
    getHighScore(){
        return this.highScore;
    }

    //getter for score
    getScore(){
        return this.score;
    }

    //getter for this.game (the rawmaze)
    getLabyrinthe(){
        return this.game;
    }

    //getter for pacman
    getPacman(){
        return this.pac;
    }

    saveScore(){
        localStorage.setItem("HighScore", this.getScore()); 
    }

    /**
     * This method will move the Pacman. 
     * Special case: If a change of direction has been requested and it is possible to go in the desired direction,
     *  then this change of direction must be made before moving the Pacman.
     */
    moveSprites(){
        let pacPos = this.getPacman().getPosition();
        let nextPos = pacPos.nextPosition(this.getPacman().getDirection());
        let top = (15*(nextPos.getRow()));
        let left = (15*(nextPos.getColumn()));
        let theclass = $('#case-'+top/15+'-'+left/15+'').attr("class");
        /**
         * console.log("Direction : " + this.getPacman().getDirection().getDeltarow() + ", " + this.getPacman().getDirection().getDeltaColumn());
         * console.log("current pos = " + pacPos.getRow() + ", " + pacPos.getColumn());
         * console.log("next pos = " + nextPos.getRow() + ", " + nextPos.getColumn());
         */

        if(this.getLabyrinthe().canWalkOn(nextPos) == true){
            this.getPacman().move();
            if(theclass == "pacdot"){
                this.score = this.getScore() + 10;
            }
            else if(theclass == "energizer"){
                this.score = this.getScore() + 10;
            }
            if(this.getScore() > this.getHighScore()){
                this.saveScore();
            }
            for(let i = 0; i < this.ghosts.length; i++){
                if(this.getLabyrinthe().canWalkOn(this.ghosts[i].futurPos()) == true){
                    this.ghosts[i].move();
                }
                else{
                    if(i == this.ghosts.length - 1){
                        this.choiceDirSpeGhost(i);
                    }
                    else{
                        this.ghosts[i].notifyIsBlocked();
                    }
                    
                }
                if(this.ghosts[i].canEat(this.pac) == true){
                    this.respawnAllSprite();
                    console.log("Niark !! Niark !! je bouffe pacman !! Niark !! Niark !!");
                }
            }
        }
    }

    /**
     * call choiceNewDir who will choice a random direction for the ghosts
     */
    choiceDirGhost(i){
        this.ghosts[i].choiceNewDirection();
    }   
    
    /**
     * Choice the direction for the The fourth ghost (or the last ghost of the list)
     * the choice follow a patern : NORTH SOUTH EAST WEST
     * @param {*} i | the special ghost position in the array of this.ghost
     */
    choiceDirSpeGhost(i){  
        
        this.ghosts[i].changeDirectionSpecialGhost(this.specialGhostDir[this.indexSpecialDir]);
        if(this.indexSpecialDir == this.specialGhostDir.length - 1){
            this.indexSpecialDir = 0;
        }
        else{
            this.indexSpecialDir++;
        }
    }

    pacmanHasBeenEaten(){
        return this.pac.isSpriteDead();
    }
    
    isGameOver(){
        if(this.pac.getLives() == 0 && this.pacmanHasBeenEaten() == true){
            return true;
        }
        return false;
    }

    respawnAllSprite(){
        this.pac.changeDirectionRespawn(Direction.WEST);
        this.pac.setPosition(this.game.getPacmanSpawn().getRow(), this.game.getPacmanSpawn().getColumn());
        this.pac.respawn();

        for(let i =0; i < this.ghosts.length; i++){
            this.ghosts[i].changeDirectionRespawn(this.makeRandomDir());
            this.ghosts[i].setPosition(this.game.getGhostSpawn().getRow(), this.game.getGhostSpawn().getColumn());
            this.ghosts[i].respawn();
        }
    }

    /**
     * Used to find out if the current level has ended if yes -> true else -> false.
     * @returns boolean
     */
    lvlSucced(){
        if(this.game.isEmpty() == true){
            return true;
        }
        return false;
    }

    nextLevel(maze){
        this.game = new Maze(maze);
        this.respawnAllSprite();
    }
}