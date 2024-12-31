import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import './shlok.css';

const Slok = () => {
    const {shlokId} = useParams();
    const [shlok, setShlok] = useState(null);

    console.log("This is ShlokId: ",shlokId);

    useEffect(() => {
        const fetchShlok = async () => {
            const API_URL = `http://localhost:8083/api/shlok/${shlokId}`;
            const response = await axios.get(API_URL);
            setShlok(response.data);
        };

        fetchShlok();
    }, [shlokId]);

    if (!shlok) {
        return <div className="loading">Loading...</div>;
    }
    console.log(shlok);

    return (
        <section className="single-shlok-container">
            <div className="container">
                <h1 className="shlok-title">Shlok Details</h1>

                <div className="shlok-content">
                    <div className="shlok-box">
                        <p className="sanskrit-text">{shlok.sanskritShlok}</p>
                    </div>

                    <div className="translation-box">
                        <h2>English Translation</h2>
                        <p className="english-text">{shlok.englishShlok}</p>
                    </div>

                    <div className="meaning-box">
                        <h2>Hindi Meaning</h2>
                        <p className="hindi-meaning">{shlok.hindiMeaning}</p>
                    </div>

                    <div className="meaning-box">
                        <h2>English Meaning</h2>
                        <p className="english-meaning">{shlok.englishMeaning}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Slok;
