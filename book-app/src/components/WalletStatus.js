export default function WalletStatus({ walletInfo, onConnect }) {
  return (
    <section className="panel wallet-panel">
      <div>
        <p className="eyebrow">Wallet</p>
        <h2 className="panel-title">Подключение кошелька</h2>
        <p className="panel-text">
          Для добавления книг нужен MetaMask. Для чтения уже добавленных книг
          интерфейс использует данные контракта и IPFS.
        </p>
      </div>

      <div className="wallet-meta">
        <div>
          <span className="meta-label">Сеть</span>
          <strong>{walletInfo?.networkName || "Не определена"}</strong>
        </div>
        <div>
          <span className="meta-label">Chain ID</span>
          <strong>{walletInfo?.chainId || "—"}</strong>
        </div>
        <div>
          <span className="meta-label">Аккаунт</span>
          <strong className="mono">
            {walletInfo?.account || "Кошелёк не подключён"}
          </strong>
        </div>
      </div>

      <button className="primary-button" onClick={onConnect}>
        Connect Wallet
      </button>
    </section>
  );
}
