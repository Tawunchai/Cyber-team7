const apiUrl = "http://localhost:8000";

const getRequestOptions = () => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };
};

export const getHashOne = async (): Promise<string | false> => {
  try {
    const response = await fetch(`${apiUrl}/hashone`, getRequestOptions());
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.hash;
  } catch (error) {
    console.error("Error fetching hash from /hashone:", error);
    return false;
  }
};

export const getHashTwo = async (): Promise<string | false> => {
  try {
    const response = await fetch(`${apiUrl}/hashtwo`, getRequestOptions());
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.hash;
  } catch (error) {
    console.error("Error fetching hash from /hashtwo:", error);
    return false;
  }
};

export const checkAnswerHash = async (answer: number): Promise<any | false> => {
  try {
    const response = await fetch(
      `${apiUrl}/checkAnswerHash?answer=${answer}`,
      getRequestOptions()
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling /checkAnswerHash:", error);
    return false;
  }
};

export const getSymmetricData = async (): Promise<
  | {
      plainText: string;
      encryptedText: string;
      secretKey: string;
    }
  | false
> => {
  try {
    const response = await fetch(`${apiUrl}/symmetric`, getRequestOptions());
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data; // ส่งข้อมูลที่ได้จาก API
  } catch (error) {
    console.error("Error fetching data from /symmetric:", error);
    return false; // กรณีเกิดข้อผิดพลาด
  }
};
