export default function ShortenedUrlNotification({ shortenedUrl, copyUrl }) {
  return (
    <div className="bg-green-500 flex flex-row items-center justify-between mb-8 p-2 rounded-md w-full text-center text-white">
      <span>{shortenedUrl}</span>
      <button onClick={copyUrl} className="text-white hover:underline">
        Copy
      </button>
    </div>
  );
}
