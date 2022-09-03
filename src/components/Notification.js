export default function Notification({ isError, messages }) {
  return (
    <div className={`${isError ? "bg-red-500" : "bg-green-500"} flex flex-row items-center justify-between mb-2 p-2 rounded-md w-full text-center text-white`}>
      <ul className="mb-0">
      {messages?.map((message, i) => (
        <li key={i}>
          {message}
        </li>
      ))}
      </ul>
    </div>
  )
}