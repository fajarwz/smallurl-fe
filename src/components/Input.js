export default function Input({ name, type, value, placeholder, fieldHandler, isError }) {
  return (
    <>
      <input
        type={type ?? "text"}
        value={value}
        name={name}
        onChange={fieldHandler}
        className={`block ${isError && "border border-red-500"} mb-1 p-2 rounded-md shadow-md w-[400px]`}
        placeholder={placeholder}
      />
    </>
  );
}
