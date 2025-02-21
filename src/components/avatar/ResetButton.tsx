import React from "react";

const ResetButton = ({ onReset }: { onReset: () => void }) => {
    return (
        <button 
            onClick={onReset} 
            style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px 12px",
                backgroundColor: "#00539F",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px"
            }}
        >
            Learn More
        </button>
    );
};

export default ResetButton;



