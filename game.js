/**
 * This is a game of tic tac toe created in javascript using factory and modular pattern
 * object constructors inorder to modularise the game and make it accessible to other
 * devs and make changes accordingly easy to the game
 * 
 * 
 * - dom_display[dom element] is the id of the div to render all views to
 */


let dom_display = document.querySelector('#display');


let system = ((dom_display)=>{
/**
 *  `System` Modular object to handle the workings of a game
 * 
 *   Properties :
 *      renderer (module/ object)-> to handle views of the game
 *      
 *   Methods :
 *      initialize: returns [none] -> sets up our default setup for game e.g set main menu to render
 *                  
 */

    let _current_game;

    let Game = ()=>{
        /**
         * `Game` Factory method to create a new game object for system
         */
        let state;

        let players = [
            {token: 'x'},
            {token: 'o'}
        ];

        let player_turn = 0;

        let score = [0, 0];

        let board = [
            null, null, null,
            null, null, null,
            null, null, null
        ];

        let win_conditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let make_move = function(target){
            /**
             * Params: target[int]-> square to make move to
             * 
             * makes a move on this board according to player target square in board array
             */
            if(this.check_sqr(target)){
                this.board[target] = players[player_turn].token;
                // console.log(board);

                if(this.win()){
                    // console.log(players[player_turn], 'wins');
                    console.log('win');
                    this.score[player_turn] ++;
                    this.state = 'finished';
                }else if(this.draw()){
                    console.log('draw');
                    this.state = 'finished';
                }

                player_turn = player_turn == 0 ? 1 : 0;
            }
        };

        let win = function (){
            /**
             * Determines state of game `win` conditions by going through all 
             * avalible winning combonations
             */
            for(let combo of win_conditions){
                // console.log(this.board[combo[0]], this.board[combo[1]], this.board[combo[2]]);
                console.log(combo)
                if(
                    this.board[combo[0]] == this.players[player_turn].token &&
                    this.board[combo[1]] == this.players[player_turn].token &&
                    this.board[combo[2]] == this.players[player_turn].token 
                ){
                    return true
                }
            }

            return false;
        };

        let draw = function (){
            /**
             * Determines if the game is a draw by checking if the board is full
             */
            let full = true;
            for(let col of this.board){
                
                if(col == null){
                    full = false;
                }
                
            }
            return full
        };

        let check_sqr = function (target){
            /**
             * checks if square is empty or not
             */
            return this.board[target] == null;
        };


        return {players, score, board, make_move, check_sqr, draw, win, state};
    };

    let renderer = (()=>{
        /**
         * `Renderer` Object to handle rendering to the screen
         * 
         * Properties:
         *  views: [dictionairy] => list of views to render(functions to call)
         * 
         * Methods:
         *  render => return value [none] => renders a particular view to the viewport
         */

       

        let display = dom_display;

        /**
         * views to render[dictionairy]
         * takes in key-> name of view
         * value -> function () return a dom element to place on screen
         */
        let views = {
            'main_menu': function(){
                let main_menu = document.createElement('div');
                main_menu.setAttribute('id', 'main-menu');
                main_menu.style.position = 'relative';

                let header = document.createElement('h1');
                header.innerText = 'Tic~Tac~Toe';
                header.classList.add('game-header');
                main_menu.appendChild(header);


                let btnContainer = document.createElement('div');
                btnContainer.classList.add('btn-container');
                
                let new_game_btn = document.createElement('button');
                new_game_btn.classList.add('main-menu__btn');
                new_game_btn.innerText = 'New Game';
                new_game_btn.addEventListener('click', ()=>{
                    system.new_game();
                });

                // add btns to btn container
                btnContainer.appendChild(new_game_btn);

                // add button container to main_menu
                main_menu.appendChild(btnContainer);


                // cutoff screen
                main_menu.style.overflow = 'hidden';


                for(let i = 0; i < 10; i ++){
                    let bat = document.createElement('div');
                    bat.classList.add('bat');
                    main_menu.appendChild(bat);
                    let x = Math.floor(Math.random() * 600);
                    let y = Math.floor(Math.random() * 500);

                    bat.style.left = x + 'px';
                    bat.style.bottom = y + 'px';

                    let movement_speed = Math.floor(Math.random(2, 10) * 40)
                    setInterval(() => {
                        bat.style.position = 'absolute';
                        bat.style.left = bat.offsetLeft + movement_speed  + 'px';
                        console.log(bat.offsetLeft)

                        if(bat.offsetLeft > main_menu.offsetWidth){
                            bat.style.left = 0 + 'px';
                        }


                    }, 200);

                    console.log(bat);

                }

                return main_menu;
            },

            'board': function(currentGame){
                // console.log(currentGame);
                let state = currentGame.state;
                let board = currentGame.board;
                let container = document.createElement('div');

                let board_dom = document.createElement('div');
                board_dom.classList.add('board');
                let row = document.createElement('div');
                row.classList.add('board-row');
                for(let col in board){

                    if(col % 3 == 0){
                        row = document.createElement('div');
                        row.classList.add('board-row');
                        // console.log(col);
                    }

                    board_dom.appendChild(row);
                    let dom_col = document.createElement('div');
                    dom_col.setAttribute('data-sqr', col);

                    if(board[col]){
                        dom_col.innerText = board[col];
                        dom_col.classList.add('board-col--taken');
                    }

                    row.appendChild(dom_col);

                    if(state == 'running'){
                        dom_col.addEventListener('click', (e)=>{
                            let target = e.target.getAttribute('data-sqr');
                            // console.log(target);
                            system._current_game.make_move(target);
                            render('board', system._current_game)
                        });
                    }
                    

                    dom_col.classList.add('board-col');
                }

                container.appendChild(board_dom)

                if(state == 'finished'){
                    let buttons = document.createElement('div');
                    buttons.classList.add('btn-container')
                    let new_game_btn = document.createElement('button');
                    new_game_btn.innerText = 'New Game';
                    

                    let main_menu_btn = document.createElement('button');
                    main_menu_btn.innerText = 'Main Menu';


                    main_menu_btn.addEventListener('click', ()=>{
                        system.renderer.render('main_menu');
                        system._current_game = null;
                    });

                    new_game_btn.addEventListener('click', ()=>{
                        system.new_game();
                    });

                    buttons.appendChild(new_game_btn);
                    buttons.appendChild(main_menu_btn);
                    container.appendChild(buttons);
                }

                

                return container;
            }
        };

        let render = function(target, args){
            /**
             * takes in name of a view to render and renders it to display
             * target[string] -> name of view to render
             * args[variables] -> variable to pass to target view
             */
            display.innerHTML = '';
            display.appendChild(views[target](args));
            document.querySelectorAll('button').addEventListener('click', (e)=>{
                e.target.classList.add('button-clicked');
            })
        };

        return {render}
    })(dom_display);

    let initialize = function(){
        /**
         * intializes the game by rendering the main menu view
         */
        renderer.render('main_menu');
    };

    let new_game = function(){
        /**
         * sets up new game
         */
        this._current_game = Game();
        this._current_game.state = 'running';
        // console.log(this._current_game);
        renderer.render('board', this._current_game);
    }

    return {initialize, _current_game, new_game, renderer};
})(dom_display);


system.initialize();