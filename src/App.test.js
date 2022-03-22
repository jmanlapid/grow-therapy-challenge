import dayjs from 'dayjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import responseStub from './responseStub.json';

jest.mock('axios');

test('fetches articles from wikipedia for yesterday by default', () => {
  render(<App />);
  const axiosGetSpy = jest.spyOn(axios, 'get');
  const yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYY/MM/DD');
  expect(axiosGetSpy).toBeCalledWith(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yesterday}`);
});

test('renders 100 articles by default', async () => {
  jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseStub });
  render(<App />);
  await waitFor(() => {
    const articleCards = screen.getAllByTestId('article-card');
    expect(articleCards).toHaveLength(100);
  });
});

test('renders # articles based on selected number of results', async () => {
  jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseStub });
  render(<App />);
  fireEvent.change(screen.getByTestId('number-of-results'), { target: { value: '50' }});
  await waitFor(() => {
    const articleCards = screen.getAllByTestId('article-card');
    expect(articleCards).toHaveLength(50);
  });
});

// TODO: Find out why the articles aren't reversing
test.skip('fetches and renders different articles when selecting date', async () => {
  const responseStubWithRandomizedArticles = Object.assign({}, responseStub);
  responseStubWithRandomizedArticles.items[0].articles = responseStubWithRandomizedArticles.items[0].articles.reverse();

  console.log(responseStub.items[0].articles[0])
  console.log(responseStubWithRandomizedArticles.items[0].articles[0])

  jest.spyOn(axios, 'get')
    .mockResolvedValueOnce({ data: responseStub })
    .mockResolvedValueOnce({ data: responseStubWithRandomizedArticles });

  render(<App />);

  let initialArticleCards;
  await waitFor(() => {
    initialArticleCards = screen.getAllByTestId('article-card');
    expect(initialArticleCards).toHaveLength(100);
  });

  fireEvent.change(screen.getByTestId('start-date'), { target: { valueAsDate: new Date() }});

  await waitFor(() => {
    const newArticleCards = screen.getAllByTestId('article-card');
    expect(
      initialArticleCards.map(($element) => $element.textContent)
    ).not.toEqual(
      newArticleCards.map($element => $element.textContent)
    );
  });

});

