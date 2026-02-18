export default function NewsBar({ news }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-red-500 p-3 z-40 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-red-500 pixel-font text-xs shrink-0">
            🚨 NOTÍCIA:
          </div>
          <div className="text-yellow-400 text-sm pixel-font animate-marquee">
            {news.text}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
