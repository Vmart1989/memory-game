import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SingleCard from "./SingleCard";

const cardImages = [
  { src: "../src/assets/img/game-cards-logos/america.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/black_panther.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/black_widow.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/captain_marvel.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/daredevil.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/deadpool.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/hawkeye.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/hulk.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/ironman.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/loki.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/punisher.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/spiderman.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/storm.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/thor.jpg", matched: false },
  { src: "../src/assets/img/game-cards-logos/wolverine.jpg", matched: false },
];

function Board({}) {
  const { difficulty } = useParams();
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);


  //shuffle cards
  const shuffledCards = () => {
    const cardDeck = document.getElementById("card-deck");
    const instruction = document.getElementById("instruction");
    
    // game info indicators
    const timeLeft = document.getElementById("time_left");
    const turns = document.getElementById("turns");

    //filter cards based on difficulty level
    let filteredCards = [...cardImages];
    if (difficulty == "easy") {
      filteredCards.splice(0, 7);
    } else if (difficulty == "medium") {
      filteredCards.splice(0, 3);
    } else {
      filteredCards;
    }
    // spread cards array and duplicate them
    const shuffledCards = [...filteredCards, ...filteredCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);

    // refresh turns
    setTurns(0);


    // hide card deck and show game info
    cardDeck.style.display = "none";
    instruction.style.display = "none";
    turns.style.display = "block";
    timeLeft.style.display = "block";

  };

  function shake() {
    const cardDeck = document.getElementById("card-deck");
    cardDeck.classList.toggle("shake");
  }

  // handle choice
  // if choice one has a value, then we set choice two
    const handleChoice = (card) => {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    // compare 2 selected cards
    useEffect(()=> {
      if (choiceOne && choiceTwo) {
        if (choiceOne.src === choiceTwo.src) {
          setCards(prevCards => {
            return prevCards.map(card => {
              if (card.src === choiceOne.src) {
                return {...card, matched: true}
              } else {
                return card;
              }
            })
          })
          resetTurn();
        } else {
          
          resetTurn();
        }
      }
    }, [choiceOne, choiceTwo]);

    console.log(cards);

    //reset choices & increase turn
    const resetTurn = () => {
      setChoiceOne(null);
      setChoiceTwo(null);
      setTurns(prevTurns => prevTurns +1);
    }
  


  return (
    <>
      <nav>
        <button
          onClick={shuffledCards}
          onMouseOver={shake}
          onMouseLeave={shake}
        >
          SHUFFLE CARDS
        </button>
        <Link to="/">
          <button>BACK HOME</button>
        </Link>
        <span className="right game_info">
          DIFFICULTY: {difficulty.toUpperCase()}
        </span>
        <span id="turns" className="game_info hidden">
          TURNS: 2
        </span>
        <span id="time_left" className="game_info hidden">
          TIME LEFT: 59seg
        </span>
      </nav>

      {/* SHUFFLE ANIMATION */}
      <div className="backdrop">
        <img
          id="card-deck"
          className="card_deck gentle-hover-shake"
          onClick={shuffledCards}
          src="..\src\assets\img\card-deck2.png"
          alt="card deck"
        />
        <p id="instruction">Click on deck to shuffle cards</p>
      </div>

    {/* LAYOUT CARDS */}
      <div className={
              difficulty == "easy"
                ? "card-grid-44"
                : difficulty == "medium"
                ? "card-grid-64"
                : "card-grid-65"
            }>
        {cards.map((card) => (
          < SingleCard 
            key={card.id} 
            card={card} 
            difficulty={difficulty}
            handleChoice={handleChoice}
            flipped = {card === choiceOne || card === choiceTwo || card.matched} />
        ))}
      </div>
    </>
  );
}

export default Board;
