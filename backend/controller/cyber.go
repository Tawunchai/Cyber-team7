package controller

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
)

// AES Symmetric Encryption
var aesKey = []byte("12345678901234567890123456789012") // 32 bytes key
var aesIV = []byte("1234567890123456")                  // 16 bytes IV

func aesEncrypt(plainText string) string {
	block, err := aes.NewCipher(aesKey)
	if err != nil {
		panic(err)
	}

	paddedText := []byte(plainText)
	padding := aes.BlockSize - len(paddedText)%aes.BlockSize
	paddedText = append(paddedText, bytes.Repeat([]byte{byte(padding)}, padding)...)

	ciphertext := make([]byte, len(paddedText))
	mode := cipher.NewCBCEncrypter(block, aesIV)
	mode.CryptBlocks(ciphertext, paddedText)

	return base64.StdEncoding.EncodeToString(ciphertext)
}

func aesDecrypt(encryptedText string) string {
	block, err := aes.NewCipher(aesKey)
	if err != nil {
		panic(err)
	}

	ciphertext, err := base64.StdEncoding.DecodeString(encryptedText)
	if err != nil {
		panic("Invalid base64 input")
	}

	if len(ciphertext) < aes.BlockSize || len(ciphertext)%aes.BlockSize != 0 {
		panic("Invalid ciphertext length")
	}

	plainText := make([]byte, len(ciphertext))
	mode := cipher.NewCBCDecrypter(block, aesIV)
	mode.CryptBlocks(plainText, ciphertext)

	// Validate padding
	padding := int(plainText[len(plainText)-1])
	if padding > aes.BlockSize || padding == 0 || len(plainText) < padding {
		panic("Invalid padding")
	}
	for i := 0; i < padding; i++ {
		if plainText[len(plainText)-1-i] != byte(padding) {
			panic("Invalid padding")
		}
	}

	return string(plainText[:len(plainText)-padding])
}

// RSA Asymmetric Encryption
var privateKey *rsa.PrivateKey
var publicKey *rsa.PublicKey

func init() {
	var err error
	privateKey, err = rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}
	publicKey = &privateKey.PublicKey
}

func rsaEncrypt(plainText string) string {
	encryptedBytes, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, publicKey, []byte(plainText), nil)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString(encryptedBytes)
}

func rsaDecrypt(encryptedText string) string {
	ciphertext, _ := base64.StdEncoding.DecodeString(encryptedText)
	decryptedBytes, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, privateKey, ciphertext, nil)
	if err != nil {
		panic(err)
	}
	return string(decryptedBytes)
}

// Hash Function (SHA-256)
func generateHash(text string) string {
	hash := sha256.Sum256([]byte(text))
	return fmt.Sprintf("%x", hash)
}

// Handlers
func challenge1(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		secretMessage := "50"
		encryptedMessage := aesEncrypt(secretMessage)
		json.NewEncoder(w).Encode(map[string]string{
			"challenge": "จงตอบคำถามนี้ด้วยเลข",
			"encrypted": encryptedMessage,
		})
	} else if r.Method == http.MethodPost {
		var req map[string]string
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		answer := req["answer"]

		// ตรวจสอบคำตอบที่ส่งมา
		if answer == "50" {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "true",
				"message": "ผ่านด่าน 1 แล้ว! นี่คือคีย์สำหรับด่านถัดไป: KEY123",
			})
		} else {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "false",
				"message": "คำตอบไม่ถูกต้อง",
			})
		}
	}
}

func challenge2(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		secretMessage := "KEY123"
		encryptedMessage := rsaEncrypt(secretMessage)
		json.NewEncoder(w).Encode(map[string]string{
			"challenge": "จงถอดรหัสข้อความนี้โดยใช้ Private Key",
			"encrypted": encryptedMessage,
		})
	} else if r.Method == http.MethodPost {
		var req map[string]string
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		answer := req["answer"]

		// ตรวจสอบว่า answer มีค่า
		if answer == "" {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "false",
				"message": "ไม่มีข้อมูลที่ถอดรหัสได้",
			})
			return
		}

		// ตรวจสอบกรณีข้อความดิบ
		if answer == "KEY123" {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "true",
				"message": "ผ่านด่าน 2 แล้ว! นี่คือคำใบ้ด่านถัดไป: FINALFLAG",
			})
			return
		}

		// ถอดรหัสข้อความที่ส่งมา (กรณีข้อความที่เข้ารหัส)
		defer func() {
			if r := recover(); r != nil {
				json.NewEncoder(w).Encode(map[string]string{
					"success": "false",
					"message": "การถอดรหัสล้มเหลว",
				})
			}
		}()

		// พยายามถอดรหัสข้อความ
		decrypted := rsaDecrypt(answer)

		// ตรวจสอบคำตอบ
		if decrypted == "KEY123" {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "true",
				"message": "ผ่านด่าน 2 แล้ว! นี่คือคำใบ้ด่านถัดไป: FINALFLAG",
			})
		} else {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "false",
				"message": "คำตอบไม่ถูกต้อง",
			})
		}
	}
}

func challenge3(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		hashExample := generateHash("FINALFLAG")
		json.NewEncoder(w).Encode(map[string]string{
			"challenge":   "จงสร้าง Hash ที่ตรงกับตัวอย่างนี้",
			"hashExample": hashExample,
		})
	} else if r.Method == http.MethodPost {
		var req map[string]string
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		answer := req["answer"]

		// เปรียบเทียบโดยตรงจากข้อความต้นฉบับ
		if generateHash(answer) == generateHash("FINALFLAG") {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "true",
				"message": "ยินดีด้วย! คุณแก้โจทย์สำเร็จทั้งหมดแล้ว 🎉",
			})
		} else {
			json.NewEncoder(w).Encode(map[string]string{
				"success": "false",
				"message": "คำตอบไม่ถูกต้อง",
			})
		}
	}
}

func main() {
	http.HandleFunc("/challenge1", challenge1)
	http.HandleFunc("/challenge2", challenge2)
	http.HandleFunc("/challenge3", challenge3)

	fmt.Println("Server running at http://localhost:8000")
	http.ListenAndServe(":8000", nil)
}
