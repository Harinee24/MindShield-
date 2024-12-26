import {useState} from "react";
import "./JournalEditor.css";
import {createJournal} from "../../services/JournalService";
import {toast} from "sonner";
import confetti from "canvas-confetti";

const JournalEditor = ({closePopup}) => { // Accept closePopup function as prop
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handlePublish = async () => {
        try {
            if (!title) {
                toast.error("Please enter journal title");
            } else if (!content) {
                toast.error("Please enter journal content");
            } else {
                await createJournal(title, content); // Send content as-is (with whitespace preserved)
                handleClick();
                toast.success("Journal created successfully.");
                closePopup(); // Close the popup after journal is published
            }
        } catch (error) {
            console.error("Error saving journal:", error);
            toast.error("Error saving journal:", error);
        }
    };

    const handleClick = () => {
        const end = Date.now() + 10; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 100,
                angle: 60,
                spread: 99,
                startVelocity: 60,
                origin: {x: 0, y: 0.5},
                colors: colors,
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 99,
                startVelocity: 60,
                origin: {x: 1, y: 0.5},
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <button className="add-button">
                    <i className="icon-image"/> Add Cover
                </button>
            </div>
            <div className="editor-body">
                {/* Editable Title */}
                <div
                    className={`journal-title ${title ? "filled" : ""}`}
                    contentEditable="true"
                    onInput={(e) => setTitle(e.target.innerText)} // Store title as it is, including whitespaces
                    data-placeholder="Journal Title..."
                ></div>

                {/* Editable Body */}
                <div
                    className={`journal-body ${content ? "filled" : ""}`}
                    contentEditable="true"
                    onInput={(e) => setContent(e.target.innerText)} // Store content as it is, including whitespaces
                    data-placeholder="Start writing your journal..."
                ></div>
            </div>
            <button className="publish-button" onClick={handlePublish}>
                Publish
            </button>
        </div>
    );
};

export default JournalEditor;
