export default function CardLink({ name, urlRefs, shortUrl, originalUrl, i }) {
  function copyUrlFromList(ref) {
    const copyText = ref.current;

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);

    alert("URL Copied");
  }

  return (
    <div className="bg-white mb-2 p-4 max-w-[500px] rounded-md hover:bg-blue-200">
      <div className="mb-4">
        <div>
          <strong>{name}</strong>
        </div>
        <div className="flex flex-row">
          <div className="mr-2 w-full">{shortUrl}</div>
          <input
            ref={urlRefs.current[i]}
            value={shortUrl}
            className="hidden"
            readOnly
          />
          <button
            onClick={() => copyUrlFromList(urlRefs.current[i])}
            className="text-gray-500 hover:underline"
          >
            <small>Copy</small>
          </button>
        </div>
      </div>
      <div>
        <small className="leading-none">Destination: {originalUrl}</small>
      </div>
    </div>
  );
}
