import { useEffect, useState } from "react";
import AddBookForm from "./components/AddBookForm";
import BookCatalog from "./components/BookCatalog";
import ReaderPanel from "./components/ReaderPanel";
import WalletStatus from "./components/WalletStatus";
import {
  addBookToContract,
  deleteBookFromContract,
  fetchBooksFromContract,
  getCurrentWalletInfo,
  requestWalletConnection,
} from "./web3/contract";
import "./index.css";

const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
];

export default function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [readerContent, setReaderContent] = useState("");
  const [readerFileUrl, setReaderFileUrl] = useState("");
  const [readerContentType, setReaderContentType] = useState("");

  const [isBooksLoading, setIsBooksLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readerError, setReaderError] = useState("");

  async function refreshWalletInfo() {
    try {
      const info = await getCurrentWalletInfo();
      setWalletInfo(info);
    } catch {
      setWalletInfo(null);
    }
  }

  async function loadBooks() {
    setIsBooksLoading(true);

    try {
      const nextBooks = await fetchBooksFromContract();
      setBooks(nextBooks);

      if (selectedBook) {
        const stillExists = nextBooks.find(
          (book) => book.id === selectedBook.id && !book.isDeleted,
        );

        if (!stillExists) {
          setSelectedBook(null);
          setReaderContent("");
          setReaderFileUrl("");
          setReaderContentType("");
          setReaderError("");
        }
      }
    } finally {
      setIsBooksLoading(false);
    }
  }

  async function handleConnectWallet() {
    await requestWalletConnection();
    await refreshWalletInfo();
  }

  async function handleAddBook(title, cid) {
    try {
      setIsSubmitting(true);
      await addBookToContract(title, cid);
      await loadBooks();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBook(bookId) {
    try {
      setIsDeleting(true);
      await deleteBookFromContract(bookId);
      await loadBooks();
    } finally {
      setIsDeleting(false);
    }
  }

  function buildGatewayUrls(cid) {
    return IPFS_GATEWAYS.map((gateway) => `${gateway}${cid}`);
  }

  function detectContentType(cid, response) {
    const normalizedCid = cid.toLowerCase();
    const contentType = response.headers.get("content-type") || "";

    if (
      normalizedCid.endsWith(".pdf") ||
      contentType.includes("application/pdf")
    ) {
      return "pdf";
    }

    if (
      normalizedCid.endsWith(".epub") ||
      contentType.includes("application/epub+zip")
    ) {
      return "epub";
    }

    return "text";
  }

  async function loadBookResource(cid) {
    const urls = buildGatewayUrls(cid);

    for (const url of urls) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          continue;
        }

        const type = detectContentType(cid, response);

        if (type === "pdf" || type === "epub") {
          return {
            type,
            fileUrl: url,
            text: "",
          };
        }

        return {
          type: "text",
          fileUrl: "",
          text: await response.text(),
        };
      } catch {}
    }

    throw new Error("Не удалось загрузить книгу через доступные IPFS gateway.");
  }

  async function handleSelectBook(book) {
    setSelectedBook(book);
    setReaderContent("");
    setReaderFileUrl("");
    setReaderContentType("");
    setReaderError("");
    setIsReading(true);

    try {
      const resource = await loadBookResource(book.cid);
      setReaderContent(resource.text);
      setReaderFileUrl(resource.fileUrl);
      setReaderContentType(resource.type);
    } catch (error) {
      setReaderError(error.message || "Ошибка чтения книги.");
    } finally {
      setIsReading(false);
    }
  }

  useEffect(() => {
    refreshWalletInfo();
    loadBooks();
  }, []);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = () => {
      refreshWalletInfo();
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum?.removeListener) {
        return;
      }

      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Hadder books dApp</p>
          <h1>Децентрализованная система хранения и чтения электронных книг</h1>
          <p className="hero-text">
            Сайт получает каталог книг из контракта, а содержимое книги — из
            IPFS по CID. Поддерживаются TXT, PDF и EPUB.
          </p>
        </div>
      </header>

      <section className="top-grid">
        <WalletStatus walletInfo={walletInfo} onConnect={handleConnectWallet} />
        <AddBookForm onSubmit={handleAddBook} isSubmitting={isSubmitting} />
      </section>

      <section className="content-grid">
        <BookCatalog
          books={books}
          selectedBookId={selectedBook?.id ?? null}
          onSelectBook={handleSelectBook}
          onDeleteBook={handleDeleteBook}
          currentAccount={walletInfo?.account ?? null}
          isLoading={isBooksLoading}
          isDeleting={isDeleting}
        />
        <ReaderPanel
          selectedBook={selectedBook}
          content={readerContent}
          contentType={readerContentType}
          fileUrl={readerFileUrl}
          isReading={isReading}
          error={readerError}
        />
      </section>
    </main>
  );
}
