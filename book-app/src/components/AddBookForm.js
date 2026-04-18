import { useState } from "react";

export default function AddBookForm({ onSubmit, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [cid, setCid] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCid = cid.trim();

    if (!trimmedTitle || !trimmedCid) {
      setError("Заполни название книги и CID.");
      return;
    }

    setError("");
    await onSubmit(trimmedTitle, trimmedCid);
    setTitle("");
    setCid("");
  }

  return (
    <section className="panel">
      <p className="eyebrow">Library management</p>
      <h2 className="panel-title">Добавить книгу</h2>

      <form className="book-form" onSubmit={handleSubmit}>
        <label>
          <span>Название книги</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, Игра Престолов"
          />
        </label>

        <label>
          <span>IPFS CID</span>
          <input
            value={cid}
            onChange={(event) => setCid(event.target.value)}
            placeholder="Например, Qm..."
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохраняем..." : "Add Book"}
        </button>
      </form>
    </section>
  );
}
