package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ข้อมูลที่ fix ไว้
const (
	plaintext     = "14.878401 , 102.015687"
	encryptedText = "0zv3J0p2HwOahttBB+KhL2eHUN6JpcW2DpOHasNG+Cc="
	secretKey     = "cookiecookie"
)

func Symmetric(c *gin.Context) {
	// ส่งค่าคงที่กลับไปยังผู้ใช้
	c.JSON(http.StatusOK, gin.H{
		"plainText":     plaintext,
		"encryptedText": encryptedText,
		"secretKey":     secretKey,
	})
}
