class Gamectrl{
    constructor(){
        this.gameview = new GameView(new Game(new Maze(RAW_MAZE.table)));
        this.pacmanview = new PacmanView(new PacmanCtrl(this.gameview.pacman));
    }

    run() {
        this._timer = setInterval(() => {
            this.gameview.test();
            this.gameview.updateFrame();
        }
        , 300);
    }

    canChangeDirection(){
        let futurPos = this.pacmanview.pacmanCtrl.Pacman.futurPos();

        let bool =  this.gameview.gameview.game.canWalkOn(futurPos);

        return bool;
    }
}

$(document).ready(function () {
    jeu = new Gamectrl();
    document.addEventListener("keydown", function (event) {
        let touche = event.key;
        if(jeu.pacmanview && jeu.pacmanview instanceof PacmanView){
            switch(touche){
                case 'ArrowLeft':
                    console.log("gauche");
                    jeu.pacmanview.pacmanCtrl.askToChangeDirection(Direction.WEST);
                    if(jeu.canChangeDirection() == true){
                        jeu.pacmanview.pacmanCtrl.Pacman.changeDirection();
                    }
                    break;
                case 'ArrowRight':
                    console.log("droite");
                    jeu.pacmanview.pacmanCtrl.askToChangeDirection(Direction.EAST);
                    if(jeu.canChangeDirection() == true){
                        jeu.pacmanview.pacmanCtrl.Pacman.changeDirection();
                    }
                    break;
                case 'ArrowUp':
                    console.log("haut");
                    jeu.pacmanview.pacmanCtrl.askToChangeDirection(Direction.NORTH);
                    if(jeu.canChangeDirection() == true){
                        jeu.pacmanview.pacmanCtrl.Pacman.changeDirection();
                    }
                    break;
                case 'ArrowDown':
                    console.log("bas");
                    jeu.pacmanview.pacmanCtrl.askToChangeDirection(Direction.SOUTH);
                    if(jeu.canChangeDirection() == true){
                        jeu.pacmanview.pacmanCtrl.Pacman.changeDirection();
                    }
                    break;
            }
        }
    })
    jeu.run();
});
