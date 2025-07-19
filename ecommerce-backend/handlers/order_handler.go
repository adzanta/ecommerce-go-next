package handlers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

// handlers/order_handler.go
func CreateOrder(c echo.Context) error {
	userID := c.Get("user_id").(float64) // JWT menyimpan float64
	var req models.OrderRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid data"})
	}

	// Validasi minimal
	if req.Name == "" || req.Address == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Nama dan alamat wajib diisi"})
	}

	_, err := config.DB.Exec(
		`INSERT INTO orders (user_id, product_id, name, address, note) VALUES (?, ?, ?, ?, ?)`,
		int(userID), req.ProductID, req.Name, req.Address, req.Note,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membuat pesanan"})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "Order berhasil dibuat"})
}


func GetAllOrders(c echo.Context) error {
	rows, err := config.DB.Query(`
		SELECT orders.id, orders.product_id, products.name, orders.name, orders.address, orders.note, orders.user_id, orders.created_at
		FROM orders
		JOIN products ON orders.product_id = products.id
	`)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil data pesanan"})
	}
	defer rows.Close()

	var orders []models.OrderWithProductName
	for rows.Next() {
		var o models.OrderWithProductName
		if err := rows.Scan(
			&o.ID,
			&o.ProductID,
			&o.ProductName,
			&o.Name,
			&o.Address,
			&o.Note,
			&o.UserID,
			&o.CreatedAt,
		); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membaca data"})
		}		
		orders = append(orders, o)
	}

	return c.JSON(http.StatusOK, orders)
}



