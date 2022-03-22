import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import './app.css';
import { ArticleCard} from './ArticleCard';

function App() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [date, setDate] = useState(yesterday);
  const [numberOfResults, setnumberOfResults] = useState('100');
  const [articles, setArticles] = useState([]);
  // TODO: Clean line 16 up
  const [pinnedArticles, setPinnedArticles] = useState(localStorage.getItem('articles') ? JSON.parse(localStorage.getItem('articles')) : []);
  const resultOptions = ['25', '50', '75', '100', '200'];

  useEffect(() => {
    // TODO: Figure out why 2 requests are going out at the same time
    async function fetchWikiArticles() {
      const formattedDate = dayjs(date).format('YYYY/MM/DD');
      const response = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${formattedDate}`);
      setArticles(response?.data?.items[0]?.articles ?? []);
      // TODO: Handle non 2** responses and show graceful UX
    }
    fetchWikiArticles();
  }, [date]);

  const pinArticle = (article) => {
    // TODO: Use a const for 'articles'
    const articles = localStorage.getItem('articles');
    try { 
      // TODO: Don't add articles that already exist
      const articlesJson = JSON.parse(articles);
      articlesJson.push(article);
      setPinnedArticles(articlesJson);
      localStorage.setItem('articles', JSON.stringify(articlesJson));
    } catch(e) {
      localStorage.setItem('articles', JSON.stringify([article]));
    }
  };

  return (
    // TODO: Show loader while fetch is in flight
    // TODO: Prevent the user from selecting future dates
    // TODO: Make pinned article show in a scrollable row instead of pushing main content down
    // TODO: Remove a pinned item by adding an (X) button on the card
    <div className="App">
      <h2>Pinned articles</h2>
      {pinnedArticles.map((item) => <ArticleCard article={item} />)}
      <div className="form">
        <div className="label-input">
          <label for="start-date">Start date:</label>
          
          <input 
            type="date" 
            id="start-date"
            data-testid="start-date"
            value={dayjs(date).format('YYYY-MM-DD')} 
            onChange={(event) => setDate(event.target.valueAsDate)} 
          />
        </div>
        <div className="label-input">
          <label for="number-of-results">Number of Results</label>
          <select 
            id="number-of-results"
            data-testid="number-of-results" 
            value={numberOfResults} 
            onChange={(event) => setnumberOfResults(event.target.value)}
          >
            {resultOptions.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </div>
      </div>
      {articles.map((item) => <ArticleCard article={item} handleClick={pinArticle} />).splice(0, parseInt(numberOfResults))}
    </div>          
  );
}

export default App;
