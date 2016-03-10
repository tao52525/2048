var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSlideLength = 100;
	}

	$("#grid_container").css("width",gridContainerWidth - 2*cellSpace);
	$("#grid_container").css("height",gridContainerWidth - 2*cellSpace);
	$("#grid_container").css("padding",cellSpace);
	$("#grid_container").css("board-radius",0.02*gridContainerWidth);

	$(".grid_cell").css("width",cellSlideLength);
	$(".grid_cell").css("height",cellSlideLength);
	$(".grid_cell").css("board-radius",0.02*cellSlideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//再随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	//初始化棋盘格中每个小格的位置
	for(var i=0; i<4; i++)
		for(var j=0; j<4; j++){
			var gridCell = $("#grid_cell_"+i+"_"+j);
			gridCell.css("top",getPosTop(i, j));
			gridCell.css("left",getPosLeft(i, j));
		}
	//初始化每个小格的数字和hasConflicted(有无需要显示的数字)
	for(var i = 0; i < 4; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j<4; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();
	score = 0;
	updateScore(score);
}

function updateBoardView(){
	$(".number_cell").remove();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			$("#grid_container").append("<div class='number_cell' id='number_cell_"+i+"_"+j+"'>");
			var theNumberCell = $("#number_cell_"+i+"_"+j);

			if (board[i][j] == 0) {
				theNumberCell.css("width","0px");
				theNumberCell.css("height","0px");
				theNumberCell.css("top",getPosTop(i,j)+cellSlideLength/2);
				theNumberCell.css("left",getPosLeft(i,j)+cellSlideLength/2);
			} else {
				theNumberCell.css("width",cellSlideLength);
				theNumberCell.css("height",cellSlideLength);
				theNumberCell.css("top",getPosTop(i,j));
				theNumberCell.css("left",getPosLeft(i,j));
				theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color",getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}
	$(".number_cell").css("line-height",cellSlideLength+"px");
	$(".number_cell").css("font-size",0.56*cellSlideLength+"px");

}

function generateOneNumber(){
	if(nospace(board))
		return false;

	// //随机一个位置
	// var randx = parseInt(Math.floor(Math.random()*4));
	// var randy = parseInt(Math.floor(Math.random()*4));

	// var times = 0;
	// while(times <50){
	// 	if(board[randx][randy] == 0)
	// 		break;

	// 	randx = parseInt(Math.floor(Math.random()*4));
	// 	randy = parseInt(Math.floor(Math.random()*4));
	// 	times++;
	// }

	// if (times == 50){
	// 		for( var i=0; i<4; i++)
	// 			for(var j=0; j<4; j++){
	// 				if(board[i][j] == 0){
	// 					randx = i;
	// 					randy = j; 
	// 				} 
	// 			}
	// }
	//随机一个位置
	var num = 0;
	var randx,randy;
	var randFlag = false;
	for( i=0; i<4; i++)
		for(var j=0; j<4; j++){
			if(board[i][j] == 0)
				num++;
		}
	var randPosition = parseInt(Math.floor(Math.random()*num));
	for( i=0; i<4; i++){
		for(j=0; j<4; j++){
			if(board[i][j] == 0){
				if(randPosition == 0){
					randx = i;
					randy = j;
					randFlag = true;
					break;
				} else {
					randPosition--;
				}
			}
		}
		if(randFlag)
			break;	 	
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx , randy ,randNumber);

	return true;

}

$(document).keydown(function(event){
	switch (event.keyCode){
		case 37: //left
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38: //up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39: //right
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40: // down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default: //default
			break;
	}
});

document.addEventListener("touchstart",function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	
});

document.addEventListener("touchend",function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	event.preventDefault();
	var deltax = endx - startx;
	var deltay = endy - starty;

	if( Math.abs( deltax ) < 0.2*documentWidth && Math.abs( deltay ) < 0.2*documentWidth)
		return;

	if(Math.abs( deltax) >Math.abs(deltay)){
		if (deltax > 0){
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		} else {
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	} else{
		if( deltay >0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		} else {
			//move up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
})

function isgameover(){
	if( nospace( board ) && nomove( board ) )
		gameover();
}

function gameover(){
	alert("Game Over!");
}

function moveLeft(){
	if(!canMoveLeft(board))
		return false;

	//moveLeft
	for(var i=0; i<4; i++)
		for(var j=1; j<4; j++){
			if(board[i][j] != 0){

				for(var k=0; k<j; k++){
					if(board[i][k] == 0 && noBlockHorizontal(i ,k, j, board)){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} 
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];

						hasConflicted[i][k] = true;
						updateScore(score);
						continue; 
					}
				}
			}
		}

	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;

	//moveRight
	for(var i=0; i<4; i++)
		for(var j=2; j>=0; j--){
			if(board[i][j] != 0){
				for(var k=3; k>j; k--){
					if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board) ){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k] ){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];

						hasConflicted[i][k] = true;
						updateScore(score);
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()",200);
	return true;
}


function moveUp(){
	if(!canMoveUp(board))
		return false;

	//moveUp
	for(var i=1; i<4; i++)
		for(var j=0; j<4; j++){
			if(board[i][j] != 0){
				for(var k=0; k<i; k++){
					if(board[k][j] == 0 && noBlockVertical(i, k, j, board)){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];

						hasConflicted[k][j] = true;
						updateScore(score);
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()",200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board))
		return false;

	//moveUp
	for(var i=2; i>=0; i--)
		for(var j=0; j<4; j++){
			if(board[i][j] != 0){
				for(var k=3; k>i; k--){
					if(board[k][j] == 0 && noBlockVertical(k, i, j, board)){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];

						hasConflicted[k][j] = true;
						updateScore(score);
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()",200);
	return true;
}

