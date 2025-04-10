import React, { useEffect, useState } from "react";

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(20);
  const [explodedParts, setExplodedParts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [log, setLog] = useState([]);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [accepted, setAccepted] = useState(null);
  const [showExplosion, setShowExplosion] = useState(false);

  const allQuestions = [
    { text: "Le cristal vibre intensément. Quel outil utilisez-vous ?", choices: ["A. Sceptre conducteur", "B. Gants isolants", "C. Injecteur à mana"], correct: "B. Gants isolants" },
    { text: "Une fissure s'ouvre ! Que faites-vous ?", choices: ["A. Injecter du mana pur", "B. Le refroidir", "C. Fuir"], correct: "B. Le refroidir" },
    { text: "Le cristal devient rouge. Il pulse !", choices: ["A. Le frapper", "B. Canaliser le flux", "C. L’absorber"], correct: "B. Canaliser le flux" },
    { text: "Une onde résonne dans la pièce. Réaction ?", choices: ["A. Se recroqueviller", "B. Analyser la fréquence", "C. Poser un cristal miroir"], correct: "C. Poser un cristal miroir" },
    { text: "Le sol tremble légèrement.", choices: ["A. Stabiliser avec une rune", "B. Sauter dessus", "C. Ignorer le phénomène"], correct: "A. Stabiliser avec une rune" },
    { text: "Des éclats flottent autour du cristal.", choices: ["A. Utiliser une cage de stabilisation", "B. Toucher les éclats", "C. Attendre sans rien faire"], correct: "A. Utiliser une cage de stabilisation" },
    { text: "Un sifflement aigu se fait entendre.", choices: ["A. Couvrir ses oreilles", "B. Résonner avec un champ de mana", "C. Parler au cristal"], correct: "B. Résonner avec un champ de mana" },
    { text: "Le cristal devient noir quelques secondes.", choices: ["A. Souffler dessus", "B. L’éloigner", "C. Injecter un peu de lumière"], correct: "C. Injecter un peu de lumière" },
    { text: "Une aura froide envahit la pièce.", choices: ["A. Canaliser de la chaleur interne", "B. Sortir immédiatement", "C. Taper le mur"], correct: "A. Canaliser de la chaleur interne" },
    { text: "Le cristal projette une image inconnue.", choices: ["A. Tenter une communication mentale", "B. La briser", "C. Toucher l’image"], correct: "A. Tenter une communication mentale" }
  ];

  useEffect(() => {
    if (!started) return;
    const shuffled = shuffleArray(allQuestions).slice(0, 10).map(q => ({
      ...q,
      choices: shuffleArray(q.choices)
    }));
    setQuestions(shuffled);
  }, [started]);

  useEffect(() => {
    if (!started || gameOver) return;
    if (timer === 0) {
      penalize();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, gameOver, started]);

  const penalize = () => {
    setLog((prev) => [...prev, `❌ Mauvaise réponse`]);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setTimer(20);
    } else {
      setGameOver(true);
      if (score < 5) setShowExplosion(true);
    }
  };

  const handleChoice = (choice) => {
    const correct = questions[questionIndex].correct;
    if (choice === correct) {
      setScore((prev) => prev + 1);
      setLog((prev) => [...prev, `✅ Bonne réponse`]);
    } else {
      setLog((prev) => [...prev, `❌ Mauvaise réponse`]);
    }
    nextQuestion();
  };

  const getAdvertMessage = () => {
    if (score === 0) return "/advert *NA* L'utilisateur a échoué. Le cristal l'a consumé. État : CK ☠️";
    if (score < 2) return "/advert *NA* Blessures critiques : perte d'un œil et d'une main. Gravement touché 🩸";
    if (score < 5) return "/advert *NA* Perte d'une main 🖐️ à la suite d'une mauvaise manipulation.";
    return "/advert *NA* Le cristal a été stabilisé avec succès. Aucun membre perdu. 🎉";
  };

  const getFinalMessage = () => {
    if (score === 0) return "☠️ Échec total. Le cristal vous consume. Vous êtes déclaré CK.";
    if (score < 2) return "🩸 Résultat critique : Perte d'un œil et d'une main. État : gravement blessé.";
    if (score < 5) return "🖐️ Résultat faible : Perte d'une main.";
    return "🎉 Cristal stabilisé. Aucun membre perdu de façon définitive.";
  };

  const getWhatIfMessage = () => {
    return (
      <>
        <h3 className="text-md font-semibold mt-6 text-indigo-400">🧠 Et si tu avais échoué ?</h3>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-400">
          <li>0 bonnes réponses : CK instantané ☠️</li>
          <li>1 à 2 bonnes réponses : Perte d'un œil + d'une main 🩸</li>
          <li>3 à 4 bonnes réponses : Perte d'une main 🖐️</li>
          <li>5 ou plus : survivant 🧍‍♂️</li>
        </ul>
      </>
    );
  };

  const restartGame = () => {
    setQuestionIndex(0);
    setTimer(20);
    setExplodedParts([]);
    setGameOver(false);
    setLog([]);
    setScore(0);
    setStarted(false);
    setAccepted(null);
    setShowExplosion(false);
  };

  if (accepted === null) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">🧪 Vous voulez lutter pour votre vie ?</h1>
        <div className="space-x-4">
          <button onClick={() => { setAccepted(true); setStarted(true); }} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Oui</button>
          <button onClick={() => setAccepted(false)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Non</button>
        </div>
      </div>
    );
  }

  if (accepted === false && !started) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-6 text-center animate-pulse">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Malheureusement, le simple fait de refuser ne suffit pas...</h1>
        <p className="italic">Seule ta théorie te sauvera !</p>
        <button onClick={() => setStarted(true)} className="mt-6 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">Commencer</button>
      </div>
    );
  }

  if (!questions.length) return null;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-indigo-900 to-black text-white font-mono">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl border border-indigo-500">
        <h1 className="text-3xl font-bold mb-4 text-indigo-300">💠 Cristal Instable – Surcharge Fragmentée</h1>

        {gameOver ? (
          <div>
            <p className="text-xl font-semibold mb-2">🔍 Résultats :</p>
            <p className="text-green-400">Score : {score} / 10</p>
            <p className="mt-2 text-red-300">{getFinalMessage()}</p>
            {showExplosion && <div className="mt-4 text-center text-red-600 text-lg font-bold animate-bounce">💥 Une explosion cristalline secoue la pièce !</div>}
            {getWhatIfMessage()}
            <p className="mt-4 text-yellow-300 text-sm">📋 Copie et colle ce message dans le chat en jeu :</p>
            <p className="mt-1 text-yellow-400 font-mono">{getAdvertMessage()}</p>
            <button onClick={restartGame} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">🔄 Recommencer</button>
            <p className="mt-4 text-sm italic text-gray-400">Réalisé par Kito Ate – Scientifique de la guilde Kenkyû 🧬</p>
          </div>
        ) : (
          <div>
            <p className="mb-2">⏳ Temps restant : <span className="font-bold text-yellow-300">{timer}s</span></p>
            <p className="mb-3">{questions[questionIndex].text}</p>
            <div className="space-y-2">
              {questions[questionIndex].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {log.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-indigo-200">🧾 Journal :</h2>
            <ul className="list-disc ml-5 space-y-1 text-sm text-gray-300">
              {log.map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;