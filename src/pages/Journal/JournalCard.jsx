import './JournalCard.css';

const JournalCard = ({journalbanner, journaltitle, journalbody}) => {
    // Truncate body to 2-3 lines
    const truncatedBody = journalbody.length > 200 ? `${journalbody.slice(0, 200)}...` : journalbody;

    return (
        <section id="journal-card-container">
            <div className="journal-card-banner-image-container">
                <img
                    src={journalbanner || '/journal_1.jpg'}
                    alt="Banner"
                    className="journal-banner-image"
                />
            </div>
            <div className="journal-card-info-container">
                <h1 className="journal-card-title">{journaltitle}</h1>
                <p className="journal-card-body">{truncatedBody}</p>
            </div>
        </section>
    );
};

export default JournalCard;
