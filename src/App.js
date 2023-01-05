import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  lineBuilder,
  lineChanger,
  wordChecker,
  keyChecker,
  resetGame,
} from './store/wordsSlice';
function App() {
  const [lang, setLang] = useState('turkish');
  const [whichWord, setWhichWord] = useState(1);
  const [text, setText] = useState('');
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(60);

  const textRef = useRef();
  const intervalRef = useRef(null);

  const dispatch = useDispatch();

  const line1 = useSelector((x) => x.words.line1);
  const line2 = useSelector((x) => x.words.line2);
  const wrongKey = useSelector((x) => x.words.wrongKey);
  const correctKey = useSelector((x) => x.words.correctKey);
  const wrongWord = useSelector((x) => x.words.wrongWord);
  const correctWord = useSelector((x) => x.words.correctWord);

  useEffect(() => {
    dispatch(lineBuilder());
    textRef.current.focus();
  }, [dispatch]);
  function run() {
    setTimer((old) => old - 1);
  }
  const textChecker = (e) => {
    setText(e.target.value);
    if (!startTimer) {
      run();
      // setTimerInterval(setInterval(run, 1000));
      intervalRef.current = setInterval(run, 1000);
    }
    setStartTimer(true);
  };
  if (timer === 0) {
    // clearInterval(timerInterval);
    clearInterval(intervalRef.current);
  }
  const spaceChecker = (e) => {
    if (e.code === 'Space') {
      if (whichWord < line1.length) {
        setWhichWord((old) => old + 1);
        dispatch(
          wordChecker({
            text,
            line1,
            lang,
            index: whichWord - 1,
          }),
        );
        setText('');
      } else {
        setWhichWord(1);
        setText('');
        dispatch(lineChanger());
      }
    } else {
      dispatch(
        keyChecker({
          key: e.key,
          textKey: text.length,
          index: whichWord - 1,
          line: line1,
          lang: lang,
        }),
      );
    }
  };
  const handleLang = (e) => {
    setLang(e.target.value);
  };
  const reset = () => {
    dispatch(lineBuilder());
    dispatch(resetGame());
    setText('');
    setWhichWord(1);
    setStartTimer(false);
    clearInterval(intervalRef.current);
    setTimer(60);
    textRef.current.focus();
  };

  return (
    <div className="bg-orange-300 h-[100vh] overflow-hidden">
      <div className="mx-auto my-auto max-w-[600px] container px-2 md:px-0 mt-20">
        <div className="absolute top-0 left-0 right-0 bg-green-200 justify-around flex mx-auto py-5">
          <a
            href="https://github.com/ogulcanmunogullari"
            target={'_blank'}
            rel="noreferrer">
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/ogulcanmunogullari/"
            rel="noreferrer"
            target={'_blank'}>
            LinkedIn
          </a>
        </div>
        <h1 className="text-2xl text-center py-5 ">
          {lang === 'turkish' ? 'Hızlı Parmaklar' : 'Fast Fingers'}
        </h1>
        <div className="flex gap-4 text-red-700 text-lg justify-center">
          <label htmlFor="lg">
            {lang === 'turkish' ? 'Change Language' : 'Dil Değiştir'}
          </label>
          <select id="lg" onChange={(e) => handleLang(e)}>
            <option value="turkish">Türkçe</option>
            <option value="english">English</option>
          </select>
        </div>
        <section className="mt-5 ">
          <span className="flex flex-wrap justify-between items-center">
            {line1 &&
              line1.map((element, i) => {
                return (
                  element && (
                    <span
                      className={`${
                        i + 1 === whichWord
                          ? 'border-green-200 border p-1'
                          : null
                      } text-xs md:text-base`}
                      key={i + 1}>
                      {' '}
                      {element[lang]}{' '}
                    </span>
                  )
                );
              })}
          </span>
          <span className="flex flex-wrap justify-between items-center">
            {line2 &&
              line2.map((element, i) => {
                return (
                  element && (
                    <span key={i} className="text-xs md:text-base">
                      {' '}
                      {element[lang]}{' '}
                    </span>
                  )
                );
              })}
          </span>
        </section>
        <section className="flex gap-1 mt-5">
          <input
            ref={textRef}
            className="border-2 w-full"
            type="text"
            value={text}
            disabled={timer === 0}
            onChange={(e) => textChecker(e)}
            onKeyDown={(e) => spaceChecker(e)}
          />
          <span className="w-20 border border-green-200 text-lg text-red-700 flex justify-center items-center">
            {timer}
          </span>
          <div
            onClick={reset}
            className="w-64 py-2 px-1 border border-red-400 flex justify-center">
            {lang === 'turkish' ? 'Yeniden Dene' : 'Try Again'}
          </div>
        </section>
        {timer === 0 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-red-500/50">
            <div className="p-10 bg-gray-200">
              <div>
                {`${lang === 'turkish' ? 'Doğru Tuş' : 'Correct Key'} : ` +
                  correctKey +
                  ` | ${lang === 'turkish' ? 'Yanlış Tuş' : 'Wrong Key'}: ` +
                  wrongKey}
              </div>
              <div>
                {`${lang === 'turkish' ? 'Doğru Kelime' : 'Correct Word'} : ` +
                  correctWord +
                  ` | ${
                    lang === 'turkish' ? 'Yanlış Kelime' : 'Wrong Word'
                  }: ` +
                  wrongWord}
              </div>
              <button onClick={reset}>
                {lang === 'turkish' ? 'Yeniden Dene' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
