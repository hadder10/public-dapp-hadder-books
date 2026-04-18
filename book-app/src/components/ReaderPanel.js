import PdfViewer from "./PdfViewer";
import EpubViewer from "./EpubViewer";

export default function ReaderPanel({
  selectedBook,
  content,
  contentType,
  fileUrl,
  isReading,
  error,
}) {
  function renderContent() {
    if (!selectedBook) {
      return (
        <p className="panel-text">
          После выбора книги интерфейс попытается загрузить её содержимое по CID
          из IPFS.
        </p>
      );
    }

    if (isReading) {
      return <p className="panel-text">Загрузка содержимого книги...</p>;
    }

    if (error) {
      return <p className="error-text">{error}</p>;
    }

    if (contentType === "pdf" && fileUrl) {
      return <PdfViewer fileUrl={fileUrl} />;
    }

    if (contentType === "epub" && fileUrl) {
      return <EpubViewer fileUrl={fileUrl} />;
    }

    if (contentType === "text") {
      return (
        <div className="reader-content">
          <pre>{content}</pre>
        </div>
      );
    }

    return (
      <p className="panel-text">
        Формат книги пока не распознан. Поддерживаются TXT, PDF и EPUB.
      </p>
    );
  }

  return (
    <section className="panel reader-panel">
      <div className="reader-header">
        <div>
          <p className="eyebrow">Reader</p>
          <h2 className="panel-title">
            {selectedBook ? selectedBook.title : "Выбери книгу слева"}
          </h2>
        </div>
        {selectedBook ? <span className="mono">{selectedBook.cid}</span> : null}
      </div>

      {renderContent()}
    </section>
  );
}
