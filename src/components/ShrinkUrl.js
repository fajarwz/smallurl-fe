export default function ShrinkUrl({
  shrinkHandler,
  fieldHandler,
  loading,
  error,
}) {
  return (
    <>
      <form onSubmit={shrinkHandler}>
        <div className="flex flex-row mb-1">
          <input
            type="text"
            name="url"
            onChange={fieldHandler}
            className={`block ${error?.original_url && "border border-red-500"} mr-2 p-2 rounded-md shadow-md w-[400px]`}
            placeholder="https://my-very-long-url.com"
          />
          <button
            type="submit"
            className="bg-sky-500 px-4 py-2 rounded-lg text-white hover:bg-sky-600 disabled:bg-sky-300"
            disabled={loading ? "disabled" : ""}
          >
            {loading ? "Loading..." : "Shrink"}
          </button>
        </div>
        <div className="text-red-500 text-sm">{error?.original_url}</div>
      </form>
    </>
  );
}
