var solitaire = function(){
"use strict";
// Обозначение карточных мастей: h – червы (hеarts), d –бубны (diamonds), c – трефы (clubs), s – пики (spades). Достоинство карт: A – туз (Ace), K – король (King), Q – дама (Queen), J – валет (Jack), T — десятка (Ten), дальше все понятно.
var cards = [{name:"2h"},{name:"3h"},{name:"4h"},{name:"5h"},{name:"6h"},{name:"7h"},{name:"8h"},{name:"9h"},{name:"Th"},{name:"Jh"},{name:"Qh"},{name:"Kh"},{name:"Ah"},
			{name:"2d"},{name:"3d"},{name:"4d"},{name:"5d"},{name:"6d"},{name:"7d"},{name:"8d"},{name:"9d"},{name:"Td"},{name:"Jd"},{name:"Qd"},{name:"Kd"},{name:"Ad"},
			{name:"2c"},{name:"3c"},{name:"4c"},{name:"5c"},{name:"6c"},{name:"7c"},{name:"8c"},{name:"9c"},{name:"Tc"},{name:"Jc"},{name:"Qc"},{name:"Kc"},{name:"Ac"},
			{name:"2s"},{name:"3s"},{name:"4s"},{name:"5s"},{name:"6s"},{name:"7s"},{name:"8s"},{name:"9s"},{name:"Ts"},{name:"Js"},{name:"Qs"},{name:"Ks"},{name:"As"}];
var deckClose = [],
	deckOpen = [],
	column1 = [],
	column2 = [],
	column3 = [],
	column4 = [],
	column5 = [],
	column6 = [],
	column7 = [],
	suit1 = [],
	suit2 = [],
	suit3 = [],
	suit4 = [];

var CARDS_IN_1_COLUMN = 1,
	CARDS_IN_2_COLUMN = 2,
	CARDS_IN_3_COLUMN = 3,
	CARDS_IN_4_COLUMN = 4,
	CARDS_IN_5_COLUMN = 5,
	CARDS_IN_6_COLUMN = 6,
	CARDS_IN_7_COLUMN = 7,
	CARDS_IN_DECK = 24,
	PLACE_CARD_WIDTH = 110,
	PLACE_CARD_HEIGHT = 170;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//begin model
function addColumnPosition(){
	column1.position = {X:10,Y:240};
	column2.position = {X:130,Y:240};
	column3.position = {X:250,Y:240};
	column4.position = {X:370,Y:240};
	column5.position = {X:490,Y:240};
	column6.position = {X:610,Y:240};
	column7.position = {X:730,Y:240};
	suit1.position = {X:370,Y:10};
	suit2.position = {X:490,Y:10};
	suit3.position = {X:610,Y:10};
	suit4.position = {X:730,Y:10};
	deckClose.position = {X:10,Y:10};
	deckOpen.position = {X:130,Y:10};
	suit1.nonShift = suit2.nonShift = suit3.nonShift = suit4.nonShift = deckClose.nonShift = deckOpen.nonShift = true;
}

function shuffleCard(){
	column1 = firstAddCardInColumn(CARDS_IN_1_COLUMN);
	column2 = firstAddCardInColumn(CARDS_IN_2_COLUMN);
	column3 = firstAddCardInColumn(CARDS_IN_3_COLUMN);
	column4 = firstAddCardInColumn(CARDS_IN_4_COLUMN);
	column5 = firstAddCardInColumn(CARDS_IN_5_COLUMN);
	column6 = firstAddCardInColumn(CARDS_IN_6_COLUMN);
	column7 = firstAddCardInColumn(CARDS_IN_7_COLUMN);
	deckClose = firstAddCardInColumn(CARDS_IN_DECK);
}

function firstAddCardInColumn(cardSum){
	var column = [];
	for(var i = 0; i < cardSum; i++){
		var number = random(0,cards.length - 1);
		column.push(cards.splice(number,1)[0]);
	}
	return column;
}
// end model

// begin view
function createCard(card){
	var cardName = card.name;
	var suit = cardName.slice(1);
	var	weight = cardName.slice(0,1);
	var suitGraph = choiseCardPictures(suit);
	var field = document.querySelector('.field');
	var cardDiv = document.createElement('div');
	var leftTopCardName = document.createElement('div');
	var rightBottomCardName = document.createElement('div');
	var centerCardName = document.createElement('div');
	if(suit === "h" || suit === "d"){
		cardDiv.classList.add("red");
	}else{
		cardDiv.classList.add("black");
	}
	card.close = true;
	cardDiv.classList.add("card");
	cardDiv.setAttribute("data-card", cardName);
	cardDiv.classList.add("close_card");
	leftTopCardName.classList.add('left_top_card_name')
	rightBottomCardName.classList.add('right_bottom_card_name');
	centerCardName.classList.add('center_card_name');
	leftTopCardName.innerHTML = weight + suitGraph;
	rightBottomCardName.innerHTML = weight + suitGraph;
	centerCardName.innerHTML = suitGraph;
	moveCard(cardDiv);
	cardDiv.appendChild(leftTopCardName);
	cardDiv.appendChild(rightBottomCardName);
	cardDiv.appendChild(centerCardName);
	field.appendChild(cardDiv);
	return cardDiv;
}

function choiseCardPictures(suit){
	var suitGraph;
	switch (suit) {
   		case "h":
   			suitGraph = "♥";
      		break;
   		case "d":
   			suitGraph = "♦";
      		break;
   		case "c":
   			suitGraph = "♣";
      		break;
      	case "s":
      		suitGraph = "♠";
      		break;
   		default:
   		console.log("switch suit error");
      	break;
	}
	return suitGraph;
}
//end view

//begin controller
document.querySelector(".deck_close").addEventListener("click", function(e){
	if(deckClose.length > 0){
		deckOpen.push(deckClose.pop());
		if(deckClose.length === 0){
			e.target.classList.remove("deck_close_suit");
		}
		sortCardInCol({deckOpen});
	}else{
		var dol = deckOpen.length;
		for(var i = 0; i < dol; i++){
			deckClose.push(deckOpen.pop());
		}
		sortCardInCol({deckClose,deckOpen});
		e.target.classList.add("deck_close_suit");
	}
});

function moveCard(card){
	card.addEventListener("mousedown",function(eventDown){
		if(!card.classList.contains("close_card")){
			eventDown.target.classList.add("top_card");
			document.onmousemove = function(eventMove){
				cardPositioner(eventDown,eventMove);
    		}
  			document.onmouseup = function(eventUp){
  				pushCardInCol(eventUp, eventDown);
    			document.onmousemove = null; 
    			eventDown.target.classList.remove("top_card"); 
    			document.onmouseup = null;
			}
  		}
	});
}

function cardPositioner(eventDown,eventMove){
	var elemsMove = searchElemInCol(eventDown,{column1,column2,column3,column4,column5,column6,column7});
	var takeCardPlace = 30;
    var positionX = eventMove.clientX,
    	positionY = eventMove.clientY;
  		elemsMove.forEach(function(item){
  			item.div.style.left = positionX - takeCardPlace + "px";
    		item.div.style.top = positionY - takeCardPlace  + "px";
  		});
}

function sortCardInCol(clmns){
	var cardShiftDown = 40;
	for(var key in clmns){
		var pos = clmns[key].position.Y;
		if(clmns[key].length > 0){
			clmns[key].forEach(function(item,i){
				item.div.style.left = clmns[key].position.X + "px";
				item.div.style.top = pos + "px";
				item.div.style.zIndex = i;
				if(clmns[key].length - 1 === i){
					item.close = false;
				}
				if(!item.close){
					item.div.classList.remove("close_card");
				}
				if(!clmns[key].nonShift){
					pos = pos + cardShiftDown;
				}
			});
		}		
	}
}

function pushCardInCol(eventUp,eventDown){
	var upX = eventUp.clientX,
		upY = eventUp.clientY,
		downX = eventDown.clientX,
		downY = eventDown.clientY;
	var upColumnNum = choiceColumnOnXandY(upX,upY),
		downColumnNum = choiceColumnOnXandY(downX,downY);
	var downColumn = choiceColumn(downColumnNum),
		upColumn = choiceColumn(upColumnNum);
	var downCardSuit,downCardVal,upCardSuit,upCardVal,clickCardNum;
	var cardDownData = eventDown.target.getAttribute("data-card");
	
	downColumn.forEach(function(item, i){
		if(item.name === cardDownData){
			clickCardNum = i;
		}
	});
	if(downColumn != undefined && clickCardNum != undefined  && downColumn.length > 0){
		downCardSuit = downColumn[clickCardNum].name.slice(1);
		downCardVal = downColumn[clickCardNum].name.slice(0,1);
	}
	if(upColumn != undefined && upColumn.length > 0){
		upCardSuit = upColumn[upColumn.length - 1].name.slice(1);
		upCardVal = upColumn[upColumn.length - 1].name.slice(0,1);
	}
	downCardVal = changeValueCardToNumber(downCardVal);
	upCardVal = changeValueCardToNumber(upCardVal);
	if(upColumnNum <= 7){
		moveCardToColumn(upColumn,downColumn,clickCardNum,upCardVal,downCardVal,downCardSuit,upCardSuit);	
	} 
	if(upColumnNum > 7){
		moveCardToColumnSuit(upColumn,downColumn,clickCardNum,upCardVal,downCardVal,downCardSuit,upCardSuit);
	}
	sortCardInCol({column1,column2,column3,column4,column5,column6,column7, suit1, suit2, suit3, suit4, deckOpen});
}

function moveCardToColumn(upColumn,downColumn,clickCardNum,upCardVal,downCardVal,downCardSuit,upCardSuit){
	var dCL = downColumn.length,
		cCN = clickCardNum;
	var	king = 13;	
	if(+upCardVal - 1 === +downCardVal && compareSuit(downCardSuit,upCardSuit)){		
		for(var j = cCN; j < dCL; j++){
			upColumn.push(downColumn.splice(cCN,1)[0]);
		}
	}
	if(upCardVal === undefined && downCardVal === king){
		for(var j = cCN; j < dCL; j++){
			upColumn.push(downColumn.splice(cCN,1)[0]);
		}
	}
}

function moveCardToColumnSuit(upColumn,downColumn,clickCardNum,upCardVal,downCardVal,downCardSuit,upCardSuit){
	if(upCardVal === undefined && downCardVal === 1){
		upColumn.push(downColumn.pop());
	}
	if(+upCardVal === +downCardVal -1 && upCardSuit === downCardSuit){
		upColumn.push(downColumn.pop());
	}
}
function choiceColumn(column){
	switch (column) {
		case 0:
			return deckOpen;
   		case 1:
   			return column1;
   		case 2:
   			return column2;
   		case 3:
   			return column3;
      	case 4:
   			return column4;
   		case 5:
   			return column5;
   		case 6:
   			return column6;
      	case 7:
      		return column7;
      	case 8:
   			return suit1;
   		case 9:
   			return suit2;
      	case 10:
   			return suit3;
   		case 11:
   			return suit4;
   		default:
   		break;
   	}
}

function changeValueCardToNumber(value){
	var numValue;
	switch (value) {
   		case "A":
   			numValue = 1;
      		break;
   		case "K":
   			numValue = 13;
      		break;
   		case "Q":
   			numValue = 12;
      		break;
      	case "J":
   			numValue = 11;
      		break;
   		case "T":
   			numValue = 10;
      		break;
   		default:
   			numValue = value;
      	break;
	}
	return numValue;
}

function compareSuit(downCardSuit, upCardSuit){
	if(setCompareSuitAntipod(downCardSuit) === setCompareSuitAntipod(upCardSuit)){
		return false;
	}else{
		return true;
	}
}

function setCompareSuitAntipod(suit){
	var suitColor;
	switch (suit) {
   		case "h":
   			suitColor = "red";
      		break;
   		case "d":
   			suitColor = "red";
      		break;
   		case "c":
   			suitColor = "black";
      		break;
      	case "s":
      		suitColor = "black";
      		break;
   		default:
   		console.log("switch suit color error");
      	break;
	}
	return suitColor;
}

function searchElemInCol(event, columns){
	var elemAndElemsUnder = [];
	var cols = choiceColumn(choiceColumnOnXandY(event.clientX,event.clientY));
	if(cols !== undefined){
		cols.forEach(function(item, i){
			if(item.div === event.target){
				for(var k = i; k < cols.length; k++){
					elemAndElemsUnder.push(cols[k]);
				}
			}
		});
	}
	return elemAndElemsUnder;
}

function choiceColumnOnXandY(x,y){
	var column;
	if(x > 130 && x < 240 && y > 10 && y < 180){
		column = 0;
	}
	if(x > 10 && x < 120 && y > 240){
		column = 1;
	}
	if(x > 130 && x < 240 && y > 240){
		column = 2;
	}
	if(x > 250 && x < 360 && y > 240){
		column = 3;
	}
	if(x > 370 && x < 480 && y > 240){
		column = 4;
	}
	if(x > 490 && x < 600 && y > 240){
		column = 5;
	}
	if(x > 610 && x < 720 && y > 240){
		column = 6;
	}
	if(x > 730 && x < 840 && y > 240){
		column = 7;
	}
	if(x > 370 && x < 480 && y > 10 && y < 180){
		column = 8;
	}
	if(x > 490 && x < 600 && y > 10 && y < 180){
		column = 9;
	}
	if(x > 610 && x < 720 && y > 10 && y < 180){
		column = 10;
	}
	if(x > 730 && x < 840 && y > 10 && y < 180){
		column = 11;
	}
	return column;
}
//end controller
this.init = function(){
	for(var i = 0; i < cards.length; i++){
		cards[i].div = createCard(cards[i]);
	}
	shuffleCard();
	addColumnPosition();
	sortCardInCol({column1,column2,column3,column4,column5,column6,column7});	
}
}

var newSolitaire = new solitaire();
newSolitaire.init();