export default function BookCatalog({
  books,
  selectedBookId,
  onSelectBook,
  onDeleteBook,
  currentAccount,
  isLoading,
  isDeleting,
}) {
  const visibleBooks = books.filter((book) => !book.isDeleted);

  function isOwner(book) {
    if (!currentAccount) return false;
    return book.owner.toLowerCase() === currentAccount.toLowerCase();
  }

  return (
    <section className="panel catalog-panel">
      <div className="catalog-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 className="panel-title">Добавленные книги</h2>
        </div>
        <span className="counter">{visibleBooks.length}</span>
      </div>

      {isLoading ? <p className="panel-text">Загрузка каталога...</p> : null}

      {!isLoading && visibleBooks.length === 0 ? (
        <p className="panel-text">В контракте пока нет доступных книг.</p>
      ) : null}

      <div className="book-list">
        {visibleBooks.map((book) => {
          const isActive = selectedBookId === book.id;

          return (
            <div
              key={book.id}
              className={`book-card ${isActive ? "active" : ""}`}
            >
              <button
                className="book-main-button"
                onClick={() => onSelectBook(book)}
              >
                <div>
                  <p className="book-title">{book.title}</p>
                  <p className="book-cid mono">CID: {book.cid}</p>
                  <p className="book-owner mono">Owner: {book.owner}</p>
                </div>
                <span className="read-badge">Read</span>
              </button>

              {isOwner(book) ? (
                <button
                  className="danger-button"
                  onClick={() => onDeleteBook(book.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
