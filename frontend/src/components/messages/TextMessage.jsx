const TextMessage = ({ content }) => {
  return (
    <li className="bg-blue-500 rounded-full p-2 text-white max-w-xs ml-auto">
      <p>{content}</p>
    </li>
  );
};

export default TextMessage;
