import { useEffect, useState } from "react";
import { ReactReader } from "react-reader";

export default function EpubViewer({ fileUrl }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setLocation(null);
  }, [fileUrl]);

  return (
    <div className="reader-content rich-reader epub-shell">
      <ReactReader
        url={fileUrl}
        location={location}
        locationChanged={(nextLocation) => setLocation(nextLocation)}
        epubInitOptions={{
          openAs: "epub",
        }}
        loadingView={<p className="panel-text">Загрузка EPUB...</p>}
      />
    </div>
  );
}
