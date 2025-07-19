package models

type OrderWithProductName struct {
	ID          int    `json:"id"`
	ProductID   int    `json:"product_id"`
	ProductName string `json:"product_name"`
	Name        string `json:"name"`
	Address     string `json:"address"`
	Note        string `json:"note"`
	UserID      int    `json:"user_id"`      
	CreatedAt   string `json:"created_at"`
}

type OrderRequest struct {
	ProductID int    `json:"product_id"`
	UserID    int    `json:"user_id"`
	Name      string `json:"name"`
	Address   string `json:"address"`
	Note      string `json:"note"`
}

