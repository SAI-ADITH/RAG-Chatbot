const PromptSuggestionButton = ({ text, onClick }: { text: string; onClick: any }) => {
    return (
        <button 
            className="prompt-suggestion-button"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default PromptSuggestionButton;
