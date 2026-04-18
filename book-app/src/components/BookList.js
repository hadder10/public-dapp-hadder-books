export default function BookList({ books, onRead }) {
  return (
    <div>
      <h2>Books</h2>
      {books.map((b, i) => (
        <div key={i}>
          <button onClick={() => onRead(b.cid)}>{b.title}</button>
        </div>
      ))}
    </div>
  );
}
