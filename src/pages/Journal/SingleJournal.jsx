import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteJournal, getJournals} from "../../services/JournalService.jsx";
import './SingleJournal.css';
import Cookies from "js-cookie";
import {toast} from "sonner";


const SingleJournal = () => {
    const {journalId} = useParams();
    const [journal, setJournal] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchJournal = async () => {
            const journals = await getJournals();
            const foundJournal = journals.find(journal => journal.id === journalId);
            setJournal(foundJournal);
        };

        fetchJournal();
    }, [journalId]);

    if (!journal) return <div>Loading...</div>;

    console.log(journal);

    const userCookie = Cookies.get("user");
    const username = userCookie ? JSON.parse(userCookie).name : null;

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return date.toLocaleDateString('en-US', options);
    };

    const deleteThisJournal = async () => {
        const journals = await deleteJournal(journalId);
        toast.success(journals);
        navigate('/journals');
    };

    return (
        <section id="singleJournal">
            <div className="singleJournal-banner-image-container">
                <img
                    src={journal.journalbanner || '/journal_1.jpg'}
                    alt="Banner"
                    className="singleJournal-banner-image"
                />
            </div>
            <h1 className="singleJournal-title">{journal.title}</h1>
            <div className="singleJournal-info-container">
                <img
                    src={journal.profileimage || 'https://randomuser.me/api/portraits/men/75.jpg'}
                    alt="Profile"
                    className="journal-profile-image"
                />
                <p>{username}</p>
                <span className="dot-separator">·</span>
                <p>{formatDate(journal.createdAt)}</p>
            </div>

            <div className="singleJournal-content-container">
                <p>{journal.content}</p>
            </div>

            <div className="singleJournal-options-container">
                <button className="singleJournal-button" onClick={deleteThisJournal}>Delete</button>
                <button className="singleJournal-button">Update</button>
            </div>
        </section>
    );
};

export default SingleJournal;
