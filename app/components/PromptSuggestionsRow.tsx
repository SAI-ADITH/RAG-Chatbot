import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "Who is currently the Men's number one ranked tennis player in the world?",
        "Which ATP tournanmts are happening in November 2024?",
        "Who is currently the Women's number one ranked tennis player in the world?",
        "Which tennis player has the most aces in the 2024 season?",
        "Who recently won the 2024 Wimbeldon?"
    ]

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
            <PromptSuggestionButton key={"suggestion-${index}"}
            text={prompt}
            onClick={() => onPromptClick(prompt)}
            
            />)}
        </div>
    )
}

export default PromptSuggestionsRow