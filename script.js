
my_canvas = document.getElementById("canvas");
canvas.addEventListener("mousedown", doMouseDown, false);

context = my_canvas.getContext("2d");

legalPos = [                                                [13, 1],
                                                        [12, 2],[14, 2],
                                                    [11, 3],[13, 3],[15, 3],
                                                [10, 4],[12, 4],[14, 4],[16, 4],
            [ 1, 5],[ 3, 5],[ 5, 5],[ 7, 5],[ 9, 5],[11, 5],[13, 5],[15, 5],[17, 5],[19, 5],[21, 5],[23, 5],[25, 5],
                [ 2, 6],[ 4, 6],[ 6, 6],[ 8, 6],[10, 6],[12, 6],[14, 6],[16, 6],[18, 6],[20, 6],[22, 6],[24, 6],  
                    [ 3, 7],[ 5, 7],[ 7, 7],[ 9, 7],[11, 7],[13, 7],[15, 7],[17, 7],[19, 7],[21, 7],[23, 7],          
                        [ 4, 8],[ 6, 8],[ 8, 8],[10, 8],[12, 8],[14, 8],[16, 8],[18, 8],[20, 8],[22, 8],                  
                            [ 5, 9],[ 7, 9],[ 9, 9],[11, 9],[13, 9],[15, 9],[17, 9],[19, 9],[21, 9],                          
                        [ 4,10],[ 6,10],[ 8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],[22,10],                  
                    [ 3,11],[ 5,11],[ 7,11],[ 9,11],[11,11],[13,11],[15,11],[17,11],[19,11],[21,11],[23,11],          
                [ 2,12],[ 4,12],[ 6,12],[ 8,12],[10,12],[12,12],[14,12],[16,12],[18,12],[20,12],[22,12],[24,12],  
            [ 1,13],[ 3,13],[ 5,13],[ 7,13],[ 9,13],[11,13],[13,13],[15,13],[17,13],[19,13],[21,13],[23,13],[25,13],
                                                [10,14],[12,14],[14,14],[16,14],
                                                    [11,15],[13,15],[15,15],
                                                        [12,16],[14,16],
                                                            [13,17]];

agentStartPos = [[[13, 1], [12, 2], [14, 2], [11, 3], [13, 3], [15, 3], [10, 4], [12, 4], [14, 4], [16, 4]],
                 [[ 1,13], [ 3,13], [ 2,12], [ 5,13], [ 4,12], [ 3,11], [ 7,13], [ 6,12], [ 5,11], [ 4,10]],
                 [[25,13], [24,12], [23,13], [23,11], [22,12], [21,13], [22,10], [21,11], [20,12], [19,13]]];

agentFinalPos = [[[10,14],[12,14],[14,14],[16,14],[11,15],[13,15],[15,15],[12,16],[14,16],[13,17]],
                 [[19, 5],[21, 5],[23, 5],[25, 5],[20, 6],[22, 6],[24, 6],[21, 7],[23, 7],[22, 8]],
                 [[ 1, 5],[ 3, 5],[ 5, 5],[ 7, 5],[ 2, 6],[ 4, 6],[ 6, 6],[ 3, 7],[ 5, 7],[ 4, 8]]];

/*
var Actions = {
	createNew: function(){
		var action = {};
		action.moves = [[1,1], [1,-1], [-1,1], [-1,-1], [2,0], [-2,0]];
		action.hops = [[2,2], [2,-2], [-2,2], [-2,-2], [4,0], [-4,0]];
		return action;
	}
}
*/

actionMoves = [[1,1], [1,-1], [-1,1], [-1,-1], [2,0], [-2,0]];
actionHops = [[2,2], [2,-2], [-2,2], [-2,-2], [4,0], [-4,0]];


xscale=30;
yscale=40;
radius=15;

function drawCircle(color, x, y, r){
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI*2, false);
	context.fillStyle = color;
	context.lineWidth = 2;
	context.strokeStyle = "gray";
	context.fill();
	context.stroke();
}

function drawCircle_scale(color,x,y,r){
	drawCircle(color,x*xscale,y*yscale,radius);
}

function drawChecker(color, Pos){
	for(i=0; i<Pos.length; ++i){
		x = Pos[i][0];
		y = Pos[i][1];
		drawCircle_scale(color,x,y,radius);
	}
}

function drawBoard(checkerPos, playerTurn){
	//console.log(playerTurn);
	//context.clearRect(0, 0, 800, 800);
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(0, 0, 800, 800);
	for(i=0; i<legalPos.length; i++){
		x = legalPos[i][0];
		y = legalPos[i][1];
		drawCircle_scale("rgb(32, 32, 32)",x,y,radius);
	}
	drawChecker((playerTurn==0)?"rgb(0,512,0)":"rgb(0,128,0)",checkerPos[0]);
	drawChecker((playerTurn==1)?"rgb(512,0,0)":"rgb(128,0,0)",checkerPos[1]);
	drawChecker((playerTurn==2)?"rgb(512,512,0)":"rgb(128,128,0)",checkerPos[2]);
}


function add(x, y){
    return [x[0]+y[0], x[1]+y[1]];
}

function minus(x, y){
    return [x[0]-y[0], x[1]-y[1]];
}

function checkerDistance(x, y){
	d = minus(x,y);
	d[0] = (d[0]>0) ? d[0] : -d[0];
	d[1] = (d[1]>0) ? d[1] : -d[1];
	return (d[0]>d[1]) ? d[0]+d[1] : d[1]+d[1];
}
var State = {
	createNew: function(firstTurn){
		var state = {};
		state.playerTurn = firstTurn;
		state.agentPos = agentStartPos;

		state.takeTurn = function(){
			state.playerTurn = (state.playerTurn+1)%3;
		}

		state.getPossibleActions = function(playerIndex){
			var actions = [];
			var checkerPos = state.agentPos[playerIndex]
			for(var index=0 in checkerPos){
				pos = checkerPos[index]
				possible = state.getCheckerActions(pos);
				actions.push(possible);
			}
			return actions;
		}
		state.getTable = function(){
			var row = [];
			for(j=0;j<25+2;j++)
				row.push(100);
			var table = [];
			for(i=0;i<17+2;i++)
				table.push(row.slice());
			for(var i in legalPos){
				pos2 = legalPos[i];
				table[pos2[1]][pos2[0]]=10;
			}
			for(var turn=0; turn<3; turn++){
				if(turn!=state.playerTurn){
					for(var i in agentFinalPos[turn]) {
						pos2 = agentFinalPos[turn][i]; 
						table[pos2[1]][pos2[0]]=turn+11;
					}
				}
				for(var i in state.agentPos[turn]){
					pos2 = state.agentPos[turn][i]; 
					table[pos2[1]][pos2[0]]=turn+1;
				}

			}
			return table;
		}
		state.getCheckerActions = function(pos){
			var possible = [];
			//console.log(pos);
			var table = state.getTable();
			//console.log(table);
			for(index in actionMoves){
				vec = actionMoves[index];
				next_pos = add(pos, vec);
				//console.log(next_pos);
				//console.log(table[next_pos[1]][next_pos[0]]);
				if(table[next_pos[1]][next_pos[0]]==10){
					possible.push([vec]);
				}
			}
			visited = [];
			state.getPossibleHops(pos, visited, table, possible);
			//console.log(possible);
			return possible;
		}
		state.getPossibleHops = function(pos, visited, table, possible){
			var ii = 0;
			table[pos[1]][pos[0]]=100;
			for(ii=0; ii<actionMoves.length; ii++){
				var next_pos = add(pos, actionMoves[ii]);
				var next_next_pos = add(pos, actionHops[ii]);
				if(table[next_pos[1]][next_pos[0]]<=3 && table[next_next_pos[1]][next_next_pos[0]]==10){
					visited.push(actionHops[ii]);
					//console.log(visited);
					possible.push(visited.slice());
					state.getPossibleHops(next_next_pos, visited, table, possible);
					//console.log(possible);
					visited.pop();
				}
			}
			return;
		}

		state.getActionResult = function(pos, action){
			var ret = [pos[0], pos[1]];
			for(var ii=0; ii<action.length; ii++)
				ret = add(ret, action[ii]);
			return ret;
		}
    
		state.takeAction = function(action, playerIndex, checkerIndex){
			var pos = state.agentPos[playerIndex][checkerIndex];
			state.agentPos[playerIndex][checkerIndex] = state.getActionResult(pos, action);
		}

		state.getActionOriginal = function(pos, action){
			var ret = [pos[0], pos[1]];
			for(var ii=0; ii<action.length; ii++)
				ret = minus(ret, action[ii]);
			return ret;
		}
		state.reverseAction = function(action, playerIndex, checkerIndex){
			var pos = state.agentPos[playerIndex][checkerIndex];
			state.agentPos[playerIndex][checkerIndex] = state.getActionOriginal(pos, action);
		}
		state.getCheckerProgress = function(playerIndex, checkerIndex, table){
			var goalPoses = agentFinalPos[playerIndex];
			var pos = state.agentPos[playerIndex][checkerIndex];
			var max = 0;;
			var isInGoal=false;
			for(var goalPosIndex in goalPoses){
				var goalPos = goalPoses[goalPosIndex];
				if(goalPos[1]==pos[1] && goalPos[0]==pos[0])
					isInGoal=true;
				if(table[goalPos[1]][goalPos[0]]==10) {
					var value = checkerDistance(pos, goalPos);
					if(max < value)
						max = value;
				}
			}
			return (isInGoal) ? 0 : max;
		}

		state.getProgress = function(playerIndex){
			var table = state.getTable();
			var distance = 0;
			for(var checkerIndex in state.agentPos[playerIndex])
				distance = distance + state.getCheckerProgress(playerIndex, checkerIndex, table);
			return distance;
		}
		state.isWin = function(playerIndex){
			var table = state.getTable();
			var goalPoses = agentFinalPos[playerIndex];
			for(var goalPosIndex in goalPoses){
				var goalPos = goalPoses[goalPosIndex];
				//console.log(table[goalPos[1]][goalPos[0]]);
				if(table[goalPos[1]][goalPos[0]]!=playerIndex+1)
					return false;
			}
			return true;
		}


		return state;
	}
}



var Game = {
	createNew: function(agent0, agent1, agent2){
		var game = {};
		game.gameState = State.createNew(0);
        game.agents = [agent0.createNew(game.gameState, 0), agent1.createNew(game.gameState, 1), agent2.createNew(game.gameState, 2)];
		game.isWin = function(playerIndex){
			return game.gameState.isWin(playerIndex);
		}
		game.isEnd = function(){
			for(var i=0; i<3; i++){
				if(game.isWin(i)) 
					return [true, i];
			}
			return [false, 0]
		}
		return game;
	}
}


var MANUAL_Agent = {
	createNew: function(state, index){
		var agent = {};
        agent.playerIndex = index;
        agent.gameState = state;
		agent.getAction = function(){
			return [0, [[1,1],[1,1]] ];
		}
		agent.getName = function(){
			return "manual";
		}
		return agent;
	}
}

var REFLEX_Agent = {
	createNew: function(state, index){
		var agent = {};
        agent.playerIndex = index;
        agent.gameState = state;
		agent.getEvaluation = function(playerIndex){
			return agent.gameState.getProgress(playerIndex);
		}
		agent.getCheckerAction = function(playerIndex, checkerIndex){
			var pos = agent.gameState.agentPos[playerIndex][checkerIndex];
			var possible = agent.gameState.getCheckerActions(pos);
			var minIndex = 0;
			var min = 99999;
			for(var index in possible){
				var action = possible[index];
				agent.gameState.takeAction(action, playerIndex, checkerIndex);
				value = agent.getEvaluation(playerIndex);
				if(min > value){
					min = value;
					minIndex = index;
				}
				agent.gameState.reverseAction(action, playerIndex, checkerIndex);
			}

			return (possible.length==0) ? [[],min] : [possible[minIndex], min];
		}
		agent.reflex = function(playerIndex){
			var minCheckerIndex = 0;
			var minAction = [];
			var min = 99999;
			for(var checkerIndex=0; checkerIndex<10; checkerIndex++){
				var ret = agent.getCheckerAction(playerIndex, checkerIndex);
				var action = ret[0];
				var value = ret[1];
				//table = agent.gameState.getTable();
				//penalty = agent.gameState.getCheckerProgress(playerIndex, checkerIndex, table);
				//value = (value > 50) ? value-penalty : value-10000;
				//console.log(ret);
				if(min > value){
					min = value;
					minAction = action;
					minCheckerIndex = checkerIndex;
				}
			}
			//console.log(minCheckerIndex);
			//console.log(minAction);
			return [minCheckerIndex, minAction];
		}
		agent.getAction = function(){
			return agent.reflex(agent.playerIndex);
		}
		agent.getName = function(){
			return "reflex";
		}
		return agent;
	}
}

var MultiDepth2_Agent = {
	createNew: function(state, index){
		var agent = REFLEX_Agent.createNew(state, index);
		agent.DFS = function(depth, agentIndex){
			if (agent.gameState.isWin(agentIndex) ||  depth <= 1)
				return agent.getEvaluation(agent.playerIndex)-depth;
			agentIndex = (agentIndex+1) %3;
			var min = 999999;
			//console.log(agentIndex);
			if(agentIndex != agent.playerIndex){
				//var ret = agent.reflex(agentIndex);
				//var checkerIndex = ret[0];
				//var action=ret[1];
				//agent.gameState.takeAction(action, agentIndex, checkerIndex);
				var value = agent.DFS(depth, agentIndex);
				if(min > value) min = value;
				//agent.gameState.reverseAction(action, agentIndex, checkerIndex);
			} else{
				for(var checkerIndex=0; checkerIndex<10; checkerIndex++){
					var pos = agent.gameState.agentPos[agent.playerIndex][checkerIndex];
					var possible = agent.gameState.getCheckerActions(pos);
					//table = agent.gameState.getTable();
					//penalty = agent.gameState.getCheckerProgress(agent.playerIndex, checkerIndex, table);
					for(var index in possible){
						var action = possible[index];
						agent.gameState.takeAction(action, agent.playerIndex, checkerIndex);
						var value = agent.DFS(depth-1, agent.playerIndex);
						//value = (true) ? value-penalty : value-10000;
						if(min > value) min = value;
						agent.gameState.reverseAction(action, agent.playerIndex, checkerIndex);
					}
				}
			}
			return min;
		}
		agent.getAction = function(){
			var minCheckerIndex = 0;
			var minAction = [];
			var min = 99999;
			for(var checkerIndex=0; checkerIndex<10; checkerIndex++){
				var pos = agent.gameState.agentPos[agent.playerIndex][checkerIndex];
				var possible = agent.gameState.getCheckerActions(pos);
				for(var index in possible){
					var action = possible[index];
					agent.gameState.takeAction(action, agent.playerIndex, checkerIndex);
					var value = agent.DFS(2, agent.playerIndex);
					//console.log(value);
					if(min > value){
						min = value;
						minAction = action;
						minCheckerIndex = checkerIndex;
					}
					agent.gameState.reverseAction(action, agent.playerIndex, checkerIndex);
				}
			}
			//console.log(minCheckerIndex);
			//console.log(minAction);
			return [minCheckerIndex, minAction];
		}
		agent.getName = function(){
			return "MDepth2";
		}
		return agent;
	}
}

var Block_Agent = {
	createNew: function(state, index){
		var agent = REFLEX_Agent.createNew(state, index);
		agent.enemyPlayer = 0;
		agent.getEvaluation = function(playerIndex){
			var value = agent.gameState.getProgress(playerIndex);
			var enemyActions = 0;
			for(var checkerIndex=0; checkerIndex<10; checkerIndex++){
				var pos = agent.gameState.agentPos[agent.enemyPlayer][checkerIndex];
				var possible = agent.gameState.getCheckerActions(pos);
				enemyActions = enemyActions + possible.length;
			}
			return value + enemyActions;
		}
		agent.getName = function(){
			return "Block";
		}
		return agent;
	}
}   

//game = Game.createNew(MANUAL_Agent, REFLEX_Agent, REFLEX_Agent);
//game = Game.createNew(MANUAL_Agent, Block_Agent, Block_Agent);
//game = Game.createNew(MANUAL_Agent, Block_Agent, MultiDepth2_Agent);
game = Game.createNew(MANUAL_Agent, MultiDepth2_Agent, Block_Agent);
drawBoard(agentStartPos, game.gameState.playerTurn);

function checkEnd(){
	var ret = game.isEnd();
	if(ret[0]==true) {
		if(ret[1]==0)
			openFancybox("http://images5.fanpop.com/image/photos/25200000/Keroro-Gunso-Wallpaper-anime-25246094-1280-1024.jpg");
		else if(ret[1]==1)
			openFancybox("http://images4.fanpop.com/image/photos/22600000/Giroro-giroro-22623312-1024-768.jpg");
		else
			openFancybox("http://images4.fanpop.com/image/photos/22500000/kururu-kururu-22510515-1024-768.jpg");
		//console.log(ret[1]);
		//console.log("Win!!!!");
	}
}

function nextStep(){
	var who = game.gameState.playerTurn;
	var ret = game.agents[who].getAction();
	var checkerIndex = ret[0];
	var action = ret[1];
	game.gameState.takeAction(action, who, checkerIndex);
	game.gameState.takeTurn();
	drawBoard(game.gameState.agentPos, game.gameState.playerTurn);
	checkEnd();
}

phase = "choose";
choice = 0;
possible = [];

function getChoose(x,y){
	var ret_x = Math.round(x/xscale);
	var ret_y = Math.round(y/yscale);
	return [ret_x, ret_y];
}

function doChoose(x,y){
	var who = game.gameState.playerTurn;
	var arr = game.gameState.agentPos[who];
	for(i=0; i<arr.length; i++){
		var checkerPos = arr[i];
		if(checkerPos[0]==x && checkerPos[1]==y){
			choice = i;
			drawBoard(game.gameState.agentPos, who);
			drawCircle_scale("blue",x,y,radius);
			possible = game.gameState.getCheckerActions(checkerPos);
			//console.log(possible);
			for(var k in possible){
				var action = possible[k];
				var result = game.gameState.getActionResult(checkerPos,action);
				drawCircle_scale("rgb(0, 128, 128)",result[0],result[1],radius);
			}
			phase = "move";
		}
	}
}

function doMouseDown(event){
	var pos = getChoose(event.pageX, event.pageY);
	var x=pos[0];
	var y=pos[1];
	var who = game.gameState.playerTurn;
	if(phase=="choose"){
		doChoose(x,y);
	} else if(phase=="move"){
		for(k in possible){
			var action = possible[k];
			var result = game.gameState.getActionResult(game.gameState.agentPos[who][choice],action);
			if(x==result[0] && y==result[1]){
				game.gameState.agentPos[who][choice] = [x,y];
				checkEnd();
				game.gameState.takeTurn();
				who = game.gameState.playerTurn;
				while(game.agents[who].getName()!="manual"){
					nextStep();
					who = game.gameState.playerTurn;
				}
				drawBoard(game.gameState.agentPos, who);
				phase = "choose";
				return;
			}
		}
		doChoose(x,y);
	}
}

function openFancybox(link) {
	$.fancybox({
		'autoScale': true,
	'transitionIn': 'elastic',
	'transitionOut': 'elastic',
	'speedIn': 500,
	'speedOut': 300,
	'autoDimensions': true,
	'centerOnScroll': true,
	'href': link
	});
}
