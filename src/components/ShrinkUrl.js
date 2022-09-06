export default function ShrinkUrl({
  shrinkHandler,
  fieldHandler,
  loading,
  error,
}) {
  return (
    <>
      <form onSubmit={shrinkHandler} className="w-full">
        <div className="flex flex-col md:flex-row mb-2 justify-center w-full">
          <input
            type="text"
            name="originalUrl"
            onChange={fieldHandler}
            className={`block ${error?.original_url && "border border-red-500"} mb-2 md:mb-0 mr-0 md:mr-2 p-2 rounded-md shadow-md md:w-[400px]`}
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
