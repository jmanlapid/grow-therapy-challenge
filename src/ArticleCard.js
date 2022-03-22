// TODO: Add some way to remove articles from pinned articles
const ArticleCard = (props) => {
  return (
    <div className="article" style={{ cursor: props.handleClick ? 'pointer' : 'default'}} key={props.article.article} data-testid="article-card" onClick={() => props.handleClick(props.article)}>
      <h3>{props.article.article}</h3>
      <div>
        views:
        <br/>
        <span>{props.article.views}</span>
      </div>
    </div>
  );
}

export {
  ArticleCard
};
