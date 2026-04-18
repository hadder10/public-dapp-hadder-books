import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const file = useMemo(() => ({ url: fileUrl }), [fileUrl]);

  function handleLoadSuccess({ numPages: loadedPages }) {
    setNumPages(loadedPages);
    setPageNumber(1);
  }

  return (
    <div className="reader-content rich-reader">
      <div className="reader-toolbar">
        <button
          className="secondary-button"
          onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span>
          Page {pageNumber} / {numPages || 1}
        </span>
        <button
          className="secondary-button"
          onClick={() => setPageNumber((page) => Math.min(numPages, page + 1))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>

      <div className="pdf-frame">
        <Document
          file={file}
          onLoadSuccess={handleLoadSuccess}
          loading={<p className="panel-text">Загрузка PDF...</p>}
          error={<p className="error-text">Не удалось открыть PDF.</p>}
        >
          <Page pageNumber={pageNumber} width={760} />
        </Document>
      </div>
    </div>
  );
}
