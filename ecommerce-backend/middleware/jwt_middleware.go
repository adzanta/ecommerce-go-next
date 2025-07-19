package middleware

import (
	"ecommerce-backend/utils"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Ambil cookie token
		cookie, err := c.Cookie("token")
		if err != nil {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Token tidak ditemukan"})
		}

		tokenStr := cookie.Value
		claims := jwt.MapClaims{}

		// Validasi dan parse token
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return utils.JwtSecret, nil
		})

		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Token tidak valid"})
		}

		// Simpan ke context
		c.Set("user_id", claims["user_id"])
		c.Set("user_role", claims["role"])

		return next(c)
	}
}

func AdminOnly(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		role := c.Get("user_role").(string)
		if role != "admin" {
			return c.JSON(http.StatusForbidden, echo.Map{"error": "Akses hanya untuk admin"})
		}
		return next(c)
	}
}
