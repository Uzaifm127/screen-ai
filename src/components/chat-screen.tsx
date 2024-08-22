import React, { useCallback, useRef, useState } from "react";
import Arrow from "@/components/ui/arrow";
import { useStore } from "@/store";
import ChatHome from "./chat-home";
import ChatMessages from "./chat-message";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types";

const ChatScreen = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const chatStatus = useStore((state) => state.chatStatus);
  const setChatStatus = useStore((state) => state.setChatStatus);
  const setResponseLoading = useStore((state) => state.setResponseLoading);

  const chatsContainerRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [setInput]
  );

  const goToBottom = () => {
    chatsContainerRef.current?.scrollTo({
      top:
        chatsContainerRef.current?.scrollHeight +
        chatsContainerRef.current?.offsetHeight,
      behavior: "smooth",
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (chatStatus !== "chatting") {
      setChatStatus("chatting");
    }

    const humanMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: input,
    };

    setInput("");

    setMessages((prev) => [...prev, humanMessage]);

    goToBottom();

    setResponseLoading(true);

    const res = await fetch("/api/ai/onboarding/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setResponseLoading(false);

    goToBottom();

    setMessages((prev) => [...prev, data.message]);
  };

  return (
    <div className="w-[85vw] sm:w-[70vw] xl:mx-0 mx-auto xl:w-[55rem] flex flex-col justify-between">
      <div className="h-[65vh] w-full">
        {chatStatus !== "chatting" ? (
          <ChatHome setMessages={setMessages} />
        ) : (
          <ChatMessages
            chatsContainerRef={chatsContainerRef}
            setMessages={setMessages}
            messages={messages}
          />
        )}
      </div>

      <form
        onSubmit={submitHandler}
        className="bg-white rounded-full p-[0.6rem] flex w-full items-center"
      >
        <input
          className="bg-transparent placeholder:text-[#0000004D] text-black px-5 mr-3 w-full text-lg font-medium border-none outline-none"
          placeholder="Type your question here."
          value={input}
          onChange={handleInputChange}
          type="text"
        />
        <button
          type="submit"
          className="bg-[#7931F0] flex items-center justify-center rounded-full p-3 w-10 h-10"
        >
          <Arrow />
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
