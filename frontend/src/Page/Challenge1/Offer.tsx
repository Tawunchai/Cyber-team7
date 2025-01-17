import { useEffect, useState } from "react";
import "./offer.css";
import { getHashOne, getHashTwo } from "../../services"; // Import your hash services
import { message } from "antd"; // Ant Design's message component
import Aos from "aos";
import "aos/dist/aos.css";

import img6 from "../../Assets/image (6).jpg";
import img7 from "../../Assets/image (7).jpg";
import img8 from "../../Assets/image (8).jpg";

const Data = [
  {
    id: 1,
    imgSrc: img8,
    destTitle: "Calm Oasis Nest, Surrounding Openness, Love, Elegance",
    location: "Click Hint",
    price: "Picture One",
  },
  {
    id: 2,
    imgSrc: img6,
    destTitle: "Peace, Love, Unity, Serenity",
    location: "Click Hint",
    price: "Picture Answer",
  },
  {
    id: 3,
    imgSrc: img7,
    destTitle:
      "Navigating Endless Terrain With Opportunities, Resilience, Knowledge",
    location: "Click Hint",
    price: "Picture Two",
  },
];

const Offer = () => {
  const [inputValue, setInputValue] = useState<string>(""); // State to store input value

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const handleImageClick = async (id: number) => {
    if (id === 1) {
      const hashOne = await getHashOne();
      console.log("Hash One:", hashOne);
    } else if (id === 3) {
      const hashTwo = await getHashTwo();
      if (hashTwo) {
        const url = `http://localhost:8000/trackHash?hash=${encodeURIComponent(
          hashTwo
        )}`;
        await fetch(url, { method: "GET" });
      }
    }
  };

  const handleSubmit = () => {
    if (inputValue === "15000") {
      message.success("ผ่านด่าน 1"); // Display success message
    } else {
      message.error("คำตอบผิด! ลองใหม่อีกครั้ง"); // Display error message
    }
  };

  const handleHint = (id: number) => {
    if (id === 1 || id === 3) {
      message.info("Hint: ให้สังเกต Description"); // Message for id 1 and 2
    } else if (id === 2) {
      message.info("Hint: ให้สังเกตที่ Picture และ Description"); // Message for id 3
    }
  };

  return (
    <section className="offer section container">
      <div className="secContainter">
        <div data-aos="fade-up" data-aos-duration="2000" className="secIntro">
          <h2 className="secTitle">Game One</h2>
          <p style={{fontWeight:"bold",fontSize:"18px"}}>Hash function Example Game!</p>
        </div>

        <div className="mainContent grid">
          {Data.map(({ id, imgSrc, destTitle, price }) => {
            return (
              <div
                key={id}
                data-aos="fade-up"
                data-aos-duration="3000"
                className="singleOffer"
              >
                <div
                  className="destImage"
                  onClick={() => handleImageClick(id)} // Add click handler
                  style={{ cursor: "pointer" }}
                >
                  <img src={imgSrc} alt={destTitle} />
                </div>

                <div className="offerBody">
                  <div className="price flex">
                    <h4>{price}</h4>
                  </div>

                  <div className="amenities flex">
                    <p style={{ color: "gray", fontWeight: "bold" }}>
                      Description
                    </p>
                    <p>{destTitle}</p>
                  </div>

                  {id === 2 && ( // Add input and submit button only for id: 2
                    <center className="location flex">
                      <input
                        type="text"
                        placeholder="Check answer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} // Update input value
                        style={{ padding: "5px", marginRight: "10px" }}
                      />
                      <button onClick={handleSubmit} style={{ padding: "5px" }}>
                        Submit
                      </button>
                    </center>
                  )}

                  <button
                    className="btn flex"
                    onClick={() => handleHint(id)} // Add hint click handler
                  >
                    Hint
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Offer;
