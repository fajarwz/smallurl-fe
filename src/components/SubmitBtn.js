export default function SubmitBtn({ name, loading }) {
  return (
    <button
      type="submit"
      className="bg-sky-500 px-4 py-2 rounded-lg text-white hover:bg-sky-600 disabled:bg-sky-300"
      disabled={loading}
    >
      {loading ? "Loading..." : name}
    </button>
  );
}
