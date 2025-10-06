import React, { useRef } from 'react';

interface CrawlUploadPanelProps {
  onCrawl: (url: string) => void;
  onUpload: (file: File) => void;
}

export const CrawlUploadPanel: React.FC<CrawlUploadPanelProps> = ({ onCrawl, onUpload }) => {
  const urlRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <input ref={urlRef} type="text" placeholder="Website URL" className="border px-2 py-1 mr-2" />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={() => urlRef.current && onCrawl(urlRef.current.value)}
        >
          Crawl
        </button>
      </div>
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={e => {
            if (e.target.files && e.target.files[0]) onUpload(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};
