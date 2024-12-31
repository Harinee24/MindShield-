import {useEffect, useState} from "react";
import axios from "axios";

import "./shlokBanner.css";
import {Link} from "react-router-dom";


const ShlokBanner = () => {

    const [shlok, setShlok] = useState(null);

    useEffect(() => {
        const fetchShlok = async () => {
            const API_URL = `http://localhost:8083/api/shlok/random`;
            try {
                const response = await axios.get(API_URL);
                setShlok(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error fetching the shlok:", error);
            }
        };
        fetchShlok();
    }, []);

    if (!shlok) {
        return (
            <section>
                <div className="services-content">
                    <h2>Positive Affirmations</h2>
                </div>
                <div className="ThirdComp">
                    <div className="bg">
                        <img src="/mental-health-wellbeing.png"
                             alt="bg" width="693" height="598"/>
                    </div>
                    <div className='content'>
                        <h2>मनो दर्पणसदृशं, शुद्धं ध्यानेन शुद्ध्यति।
                            अशुद्धं कामसङ्कल्पैः, सोऽहमिति च धारणा।।</h2>
                        <br/>
                        <br/><br/>
                        <p>(हिन्दी अनुवाद)</p>
                        <h4>

                            मन दर्पण के समान है, ध्यान से यह शुद्ध होता है।
                            यह कामनाओं और गलत विचारों से अशुद्ध हो सकता है।
                        </h4>
                        <br/><br/><br/>
                        <p>(English Translation)</p>
                        <h4>
                            The mind is like a mirror; it becomes pure through meditation.
                            It can be tainted by desires and impure thoughts.</h4>
                        <br/><br/>


                        <button className="button">Learn More</button>
                    </div>
                </div>
            </section>
        )
            ;
    }

    return (

        <section>
            <div className="services-content">
                <h2>Positive Affirmations</h2>
            </div>
            <div className="ThirdComp">
                <div className="bg">
                    <img src="/mental-health-wellbeing.png"
                         alt="bg" width="693" height="598"/>
                </div>
                <div className='content'>
                    <h2>“{shlok.sanskritShlok}”</h2>
                    <br/>
                    <br/><br/>
                    <p>(हिन्दी अनुवाद)</p>
                    <h4>“{shlok.hindiMeaning}”</h4>
                    <br/><br/><br/>
                    <p>(English Translation)</p>
                    <h4>{shlok.englishMeaning}</h4>
                    <br/><br/>


                    {/*<button className="button">Learn More</button>*/}
                    <Link to={`/shlok/${shlok.shlokId}`} className="button">Learn More</Link>
                </div>
            </div>

        </section>
    );
};

export default ShlokBanner;
