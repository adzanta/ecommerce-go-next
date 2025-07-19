package routes

import (
	"ecommerce-backend/handlers"
	"ecommerce-backend/middleware"

	"github.com/labstack/echo/v4"
)

func InitRoutes(e *echo.Echo) {
	// Public routes
	e.GET("/products", handlers.GetProducts)
	e.GET("/products/:id", handlers.GetProductByID)
	e.POST("/products", handlers.CreateProduct)
	e.PUT("/products/:id", handlers.UpdateProduct)
	e.DELETE("/products/:id", handlers.DeleteProduct)
	e.POST("/login", handlers.Login)
	e.POST("/logout", handlers.Logout)
	e.POST("/register", handlers.Register)

	// Protected routes (butuh login)
	e.POST("/orders", handlers.CreateOrder, middleware.JWTMiddleware)
	e.GET("/orders", handlers.GetAllOrders, middleware.JWTMiddleware)
	e.GET("/admin/orders", handlers.GetAllOrders, middleware.JWTMiddleware, middleware.AdminOnly)
	e.GET("/me", handlers.Me, middleware.JWTMiddleware)

}
