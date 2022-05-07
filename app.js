function getRandomValue(min, max){
	return Math.floor(Math.random() * (max-min) + min);
}

class Card{
	/*
	Card
	Represents a playing card - holds a value and a suit
	Values:
		1 - ace
		2 through 10: respective
		11 - Jack
		12 - Queen
		13 - King
	Suits:
		c - club
		s - spade
		d - diamond
		h - heart
	Methods:
		getIntegerValue
	*/
	constructor(val, suit){
		this.val = val;
		this.suit = suit;
	}

	/*
	getIntegerValue
	2-10: respective
	ace: 11
	jack, queen, king: 10
	*/
	getIntegerValue(){
		if ( this.val === "Ace" ){
			return 11;
		}
		if ( this.val >= 2 && this.val <= 10 ){
			return this.val;
		}
		return 10;
	}
}

class Deck{
	/*
	Deck
	Represents a deck of playing cards
	Methods:
		push
		pop
		clear
		cardSum
		createDeck
		shuffle
	*/
	constructor(){
		this.cards = [];
	}

	push(card){
		this.cards.push(card);
	}

	pop(){
		return this.cards.pop();
	}

	/*
	clear
	Empties the card stack
	*/
	clear(){
		this.cards = [];
	}

	/* 
	cardSum
	returns the sum of the values of the cards
	*/
	cardSum(){
		let total = 0;
		for ( let i in this.cards ){
			total += this.cards[i].getIntegerValue();
		}
		console.log("total: " + total);
		return total;
	}

	/*
	createDeck
	Creates one of each standard playing card and fills cards
	*/
	createDeck(){
		this.clear();
		const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
		const suits = ["C", "S", "D", "H"];
		for ( let i in values ){
			for ( let j in suits ){
				let card = new Card(values[i], suits[j]);
				this.cards.push(card);
			}
		}
	}

	/*
	shuffle
	*/
	shuffle(){
		let newDeck = [...this.cards];
		this.cards = [];
		while ( newDeck.length !== 0 ){
			let selectedCardIndex = getRandomValue(0, newDeck.length);
			this.cards.push(newDeck[selectedCardIndex]);
			newDeck.splice(selectedCardIndex, 1);
		}		
	}
}

const app = Vue.createApp({
	data(){
		return{
			deck: new Deck(),
			playerHand: new Deck(),
			dealerHand: new Deck(),
			playerBust: false,
			played: false,
			winner: null,
		};
	},
	computed: {
		playerValue(){
			return this.playerHand.cardSum();
		},
		dealerValue(){
			return this.dealerHand.cardSum();
		}
	},
	watch: {
		playerValue(value){
			if ( value > 21 ){
				this.playerBust = true;
				this.endRound();
			}
		},
	},
	methods: {
		restart(){
			this.played = true;
			this.winner = null;
			this.playerBust = false;
			this.playerHand.clear();
			this.dealerHand.clear();
			this.deck.createDeck();
			this.deck.shuffle();
			for ( let i = 0; i<2; i++ ){
				this.drawCard(this.dealerHand);
				this.drawCard(this.playerHand);
			}
		},
		endRound(){
			if ( !this.bust ){
				this.playDealer();
			}
			this.winner = this.findWinner();
		},
		drawCard(who){
			who.push(this.deck.pop());
		},
		playDealer(){
			while ( this.dealerHand.cardSum() < 17 ){
				this.drawCard(this.dealerHand);
				// pause for a second?
			}
		},
		findWinner(){
			if ( !this.playerBust && this.dealerValue > 21 ){
				return "player";
			}
			if ( !this.playerBust && this.playerValue > this.dealerValue ){
				return "player";
			}
			if ( this.playerBust && this.dealerValue > 21 ){
				return "tie";
			}
			if ( this.playerValue === this.dealerValue ){
				return "tie";
			}
			return "dealer";
		}
	},
});

app.mount("#game")