"use client"
import Image from "next/image"
import tennisGPTLogo from "./assets/logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"


const Home = () => {

    const { append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()

    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    return (
        <main>
            <Image src={tennisGPTLogo} width={250} alt="TennisGPT Logo" />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                    <p className = "starter-text">
                        The Ultimate place for Tennis Fans!
                        Ask TennisGPT anything about the amazing sport of Tennis 
                        and it will come back with the most up-to-date answers.
                        We hope you enjoy!
                    </p>
                    <br/>
                    <PromptSuggestionsRow onPromptClick={handlePrompt}/>
                    </>

                ) : (
                    <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
                        {isLoading && <LoadingBubble/>}
                    </>

                )}

            </section>
            <form onSubmit={handleSubmit}>
                    <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something... "/>
                    <input type = "submit"/>
                </form>
        </main>
    );
};

export default Home;