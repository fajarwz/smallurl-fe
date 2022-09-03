export default function InputError({ errors }) {
  return (
    <>
      {errors?.map((error, i) => (
        <div key={i} className="text-red-500 text-sm">
          {i > 0 ? ", " : ""}
          {error}
        </div>
      ))}
    </>
  );
}
