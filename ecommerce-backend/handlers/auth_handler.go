package handlers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
	"database/sql"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func Login(c echo.Context) error {
	var req models.User
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid data"})
	}

	var user models.User
	err := config.DB.QueryRow("SELECT id, email, password, role FROM users WHERE email = ?", req.Email).
		Scan(&user.ID, &user.Email, &user.Password, &user.Role)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Email tidak ditemukan"})
		}
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil data user"})
	}

	// Bandingkan password (hash)
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Password salah"})
	}

	// Buat token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // berlaku 1 hari
	})

	// Tanda tangan token
	signedToken, err := token.SignedString(utils.JwtSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membuat token"})
	}

	// Kirim token ke client dalam bentuk httpOnly cookie
	c.SetCookie(&http.Cookie{
		Name:     "token",
		Value:    signedToken,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400, // 1 hari
	})

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Login berhasil",
	})
}

func Register(c echo.Context) error {
	var req models.User
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid request"})
	}

	// Validasi sederhana
	if req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Email dan password wajib diisi"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal hash password"})
	}

	// Simpan user baru
	_, err = config.DB.Exec("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", req.Email, hashedPassword, "user")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membuat user"})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "User berhasil dibuat"})
}

func Me(c echo.Context) error {
	userID := c.Get("user_id")
	role := c.Get("user_role")

	return c.JSON(http.StatusOK, echo.Map{
		"user_id": userID,
		"role":    role,
	})
}

func Logout(c echo.Context) error {
	c.SetCookie(&http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // ubah jadi true kalau deploy di HTTPS
		MaxAge:   -1,    // langsung hapus cookie
	})

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Berhasil logout",
	})
}


