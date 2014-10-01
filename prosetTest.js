var pool_size = 7;
var selected = [];
var score = 0;

var binaryString = function (int) {
	// prints and pads, used to display dots
	binary_string = int.toString(2);
	while (binary_string.length < 6){
		binary_string = '0' + binary_string;
	}
	return binary_string;
}

var create_deck = function () {
	//just an array from 1 to 64
	unshuffled_deck = []
	var i = 1; // Stewart Stewart says: The trivial card is too trivial (exclude the blank card, 64 (2^6) permutations but 63 cards)
	while (i < 8){
		unshuffled_deck.push(i);
		i ++;
	}
	return unshuffled_deck;
}

var shuffle = function (unshuffled_deck) {
	shuffled_deck = [];
	while (unshuffled_deck.length>0){
		randInt = Math.floor(Math.random() * (unshuffled_deck.length));
		shuffled_deck.push(unshuffled_deck.splice(randInt,1)[0]);
	}
	return shuffled_deck;
}

var deal = function (shuffled_deck, pool, index) {
	pool[index] = null;
	if (shuffled_deck){
		// adds card from deck into corect index
		pool[index]=(shuffled_deck.pop())
		return pool;
	}
}

var game_over = function (pool){
	for (var i = 0; i < pool.length; i++){
		console.log(i);
		if (pool[i]){
			console.log("card exists: ", pool[i]);
			return false;
		}
	}
	return true;
}

var display = function (pool) {
	// turns css on and off
    var wrapper = document.getElementById("wrapper");
    for (var i = 0; i < pool.length; i++) {
    	// if card has been dealt
    	if (pool[i]){
			var binary_string = binaryString(pool[i]);
	    	for (var j = 0; j < 6; j ++) {
	    		var card_id_and_dot = 'div.card' + '#' + i + ' .dot' + ':eq(' + j + ')' ;
	    		if (binary_string[j] == 0) {
		    		$(card_id_and_dot).removeClass('on').addClass('off');
	    		}
	    		else {
	    			$(card_id_and_dot).removeClass('off').addClass('on');
	    		}
			}
		}else{
			// turn card off
			$('div.card#'+i).addClass('off');
			$('div.card#'+i+"> .dot").addClass('off');
		}
    }
}


var check = function (id) {
	// poorly named function
	var index = $.inArray(pool[id], selected); //returns -1 if not in array
	if (index != -1) {
 		selected.splice(index, 1); 
		$('#'+ id).removeClass('selected');
	}
	else {
		selected.push(pool[id]);
		$('#'+ id).addClass('selected');
	}
	if (my_xor(selected) == 0) {
		for (var i = 0; i < selected.length; i ++) {
			var index = $.inArray(selected[i], pool); //have to find them all again, this is dumb
			$('#'+ index).fadeOut(150).fadeIn(150).removeClass('selected');
			deal(shuffled_deck, pool, index);
		}
		setTimeout(function() { display(pool); }, 150); //wait until fadeout/in is finished
		selected = [];
		increment_score();
		
	}
	if (game_over(pool)){
		document.body.innerHTML = "<h1>GAME OVER!</h1><p>You found " + score + " sets.</p>" 
	}
}

var my_xor = function (list) {
	// regular xor for each card in the list
	var result = list[0];
	for (var i = 1; i < list.length; i ++) {
		result = result ^ list[i];
	}
	return result;
}


var increment_score = function () {
	score ++;
	$('#score').text(score);
}

var deck = create_deck();

var shuffled_deck = shuffle(deck);
//initialize pool of cards
var pool = [];
for (var i = 0; i < pool_size; i ++) {
	pool = deal(shuffled_deck, pool, i);
}

display(pool);

$('div.card').bind('click', function() { check($(this).attr('id')) });

