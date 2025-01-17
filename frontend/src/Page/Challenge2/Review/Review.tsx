import { useEffect, useState } from "react";
import "./Review.css";

// Imported Images
import user1 from "../../../assets/user (1).jpg";
import user2 from "../../../assets/user (2).png";
import user3 from "../../../assets/user (3).png";
import cookie from "../../../assets/cookiecookie.jpg";

import Aos from "aos";
import "aos/dist/aos.css";

// Import Services
import { getSymmetricData } from "../../../services";

const Review = () => {
  const [symmetricData, setSymmetricData] = useState<{
    plainText: string;
    encryptedText: string;
    secretKey: string;
  } | null>(null);

  useEffect(() => {
    Aos.init({ duration: 2000 });

    // Fetch Symmetric Data
    const fetchSymmetricData = async () => {
      const data = await getSymmetricData();
      if (data) {
        setSymmetricData(data); // เก็บข้อมูลใน state
      } else {
        console.error("Failed to fetch symmetric data");
      }
    };

    fetchSymmetricData();
  }, []);

  return (
    <div className="review section">
      <div className="secContainer">
        <center className="secTitle" style={{ marginBottom: "50px" }}>
          Game Two : What People Say
          <p style={{ color: "gray", fontSize: "16px" }}>
            Symmetric cryptography Example Game!
          </p>
        </center>

        <div className="reviewContainer container grid">
          <div
            data-aos="fade-up"
            data-aos-duration="3000"
            className="singleReview"
          >
            <div className="imgDiv">
              <img src={user1} alt="User 1" />
            </div>

            <p>
              สวัสดีทุกคน ฉันต้องการให้ช่วยหาสถานที่ในมหาลัยหน่อยได้ไหม
              บังเอิญว่าฉันจำไม่ได้ว่าที่ไหน เเต่ฉันอยากได้เป็นชื่อสถานที่นะ รบกวนช่วยหาที?
            </p>

            <div className="name">Nicole Webb</div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="3500"
            className="singleReview"
          >
            <div className="imgDiv">
              <img src={user2} alt="User 2" />
            </div>

            <p>
              ได้สิ! เเต่ฉันเองก็ไม่มั่นใจนะว่าอยู่ตรงไหน
              เเต่พอมีข้อมูลอยู่เเต่เธอต้องหาเอง
              <p>
                <strong>
                  {symmetricData ? symmetricData.encryptedText : "Loading..."}
                </strong>
              </p>
            </p>

            <div className="name">Lidney Josline</div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="4000"
            className="singleReview"
          >
            <div className="imgDiv">
              <img src={user3} alt="User 3" />
            </div>

            <p>
              ฉันว่าข้อมูลมันยากเกินที่จะหานะ งั้นเดี๋ยวใบเพิ่มให้ :{" "}
              <img src={cookie} alt="cookiecookie" />
            </p>

            <div className="name">Rupert Loreot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
