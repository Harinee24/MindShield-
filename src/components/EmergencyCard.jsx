import {useState} from "react";
import "./EmergencyCard.css";

const EmergencyCard = ({image, name, color, contact}) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardStyle = {
        backgroundColor: isHovered ? color : " ",
        transition: "background-color 0.3s ease-in-out",
    };

    return (
        <div
            className="emergency-card"
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="emergency-card-image" style={{background: color}}>
                <img src={image} alt="Emergency image"/>
            </div>
            <div className="emergency-card-content">
                <p>{name}</p>
                <p>{contact}</p>
            </div>
        </div>
    );
};

export default EmergencyCard;
