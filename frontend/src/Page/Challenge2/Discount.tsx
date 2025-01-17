import { useEffect, useState } from "react";
import "./Discount.css";
import video from "../../assets/challenge2.mp4";
import Aos from "aos";
import "aos/dist/aos.css";
import Quantion from "./Review/Review";
import { Modal, Button } from "antd"; 

import img1 from "../../assets/image (1).jpg";
import img2 from "../../assets/image (2).jpg";
import img3 from "../../assets/image (3).png";
import img4 from "../../assets/image (4).jpg";
import img5 from "../../assets/image (5).jpg";

import { getSymmetricData } from "../../services";

const Discount = () => {
  const [plainText, setPlainText] = useState<string | null>(null); 
  const [inputValue, setInputValue] = useState<string>(""); 
  const [feedback, setFeedback] = useState<string | null>(null); 
  const [attempts, setAttempts] = useState<number>(2); 
  const [isChallengePassed, setIsChallengePassed] = useState<boolean>(false); 
  const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false); 
  const [isCongratulationModalVisible, setIsCongratulationModalVisible] =
    useState<boolean>(false); 

  const images = [
    { id: 1, src: img1 },
    { id: 2, src: img2 }, 
    { id: 3, src: img3 },
    { id: 4, src: img4 },
    { id: 5, src: img5 },
  ];

  useEffect(() => {
    Aos.init({ duration: 2000 });

    const fetchSymmetricData = async () => {
      const data = await getSymmetricData();
      if (data && data.plainText) {
        setPlainText(data.plainText); 
      } else {
        console.error("Failed to fetch symmetric data");
      }
    };

    fetchSymmetricData();
  }, []);

  const handleSubmit = () => {
    if (plainText && inputValue === plainText) {
      setFeedback("Correct! 🎉 You solved the challenge.");
      setIsImageModalVisible(true); 
    } else {
      setFeedback("Incorrect. Try again! ❌");
    }
  };

  const handleImageClick = (id: number) => {
    if (attempts > 0) {
      setAttempts((prev) => prev - 1); 
      if (id === 2) {
        setIsChallengePassed(true);
        setFeedback("Congratulations! You passed Challenge 2! 🎉");
        setIsImageModalVisible(false); 
        setIsCongratulationModalVisible(true); 
      } else if (attempts === 1) {
        setFeedback("No more attempts left. Try again later.");
      }
    }
  };

  const handleModalClose = () => {
    setIsImageModalVisible(false); 
    setIsCongratulationModalVisible(false); 
  };

  return (
    <>
      <Quantion />
      <div className="discount section">
        <div className="secContainer">
          <video src={video} autoPlay loop muted typeof="mp4"></video>
          <div className="textDiv">
            <span data-aos="fade-up" data-aos-duration="2000" className="title">
              Candy Lands
            </span>
            <p data-aos="fade-up" data-aos-duration="2500">
              Goodluck!
            </p>

            <div
              data-aos="fade-up"
              data-aos-duration="3000"
              className="input_btn flex"
            >
              <input
                type="text"
                placeholder="Enter Your Answer"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} // เก็บค่าจาก input
                style={{ marginBottom: "40px" }}
              />
              <button className="btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>

            {/* แสดงผลลัพธ์การตรวจสอบ */}
            {feedback && (
              <p
                style={{
                  color: feedback.includes("Correct") ? "white" : "red",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal แสดงรูปภาพ */}
      <Modal
        title="สถานที่ ที่คุณตามหาคือที่ไหน ? (สามารถตอบได้ 2 ครั้ง)"
        visible={isImageModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="900px"
      >
        <div className="imageGrid" style={{ display: "flex", gap: "20px" }}>
          {images.map((image) => (
            <img
              key={image.id}
              src={image.src}
              alt={`Image ${image.id}`}
              style={{
                cursor: "pointer",
                border: image.id === 2 && isChallengePassed ? "2px solid white" : "none",
                width: "150px",
                height: "100px",
              }}
              onClick={() => handleImageClick(image.id)}
            />
          ))}
        </div>
        <p style={{ color: "black", marginTop: "10px", textAlign: "center" }}>
          Attempts left: {attempts}
        </p>
      </Modal>

      <Modal
        title="Congratulations!"
        visible={isCongratulationModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 style={{ color: "green" }}>You have successfully completed Challenge 2!</h2>
          <p>Prepare for the next challenge.</p>
        </div>
      </Modal>
    </>
  );
};

export default Discount;
