package handlers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"database/sql"
	"os"
	"io"
	"strconv"
	"math"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetProducts(c echo.Context) error {
	// Ambil query param
	pageStr := c.QueryParam("page")
	limitStr := c.QueryParam("limit")
	search := c.QueryParam("search")
	sort := c.QueryParam("sort") // asc atau desc

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 6
	}

	offset := (page - 1) * limit

	// Base query
	query := "SELECT id, name, description, price, image_url FROM products WHERE 1=1"
	args := []interface{}{}

	// ✅ Filter pencarian
	if search != "" {
		query += " AND name LIKE ?"
		args = append(args, "%"+search+"%")
	}

	// ✅ Sorting
	if sort == "asc" {
		query += " ORDER BY price ASC"
	} else if sort == "desc" {
		query += " ORDER BY price DESC"
	} else {
		query += " ORDER BY id DESC"
	}

	// ✅ Pagination
	query += " LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	// Eksekusi query
	rows, err := config.DB.Query(query, args...)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil produk"})
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.ImageURL); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membaca data"})
		}
		products = append(products, p)
	}

	// Hitung total produk untuk pagination
	countQuery := "SELECT COUNT(*) FROM products WHERE 1=1"
	countArgs := []interface{}{}
	if search != "" {
		countQuery += " AND name LIKE ?"
		countArgs = append(countArgs, "%"+search+"%")
	}

	var total int
	err = config.DB.QueryRow(countQuery, countArgs...).Scan(&total)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menghitung total produk"})
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return c.JSON(http.StatusOK, echo.Map{
		"data":       products,
		"page":       page,
		"limit":      limit,
		"total":      total,
		"totalPages": totalPages,
	})
}



func GetProductByID(c echo.Context) error {
	id := c.Param("id")

	var product models.Product
	err := config.DB.QueryRow("SELECT id, name, description, price, image_url FROM products WHERE id = ?", id).
		Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.ImageURL)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, echo.Map{"error": "Produk tidak ditemukan"})
		}
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil data produk"})
	}

	return c.JSON(http.StatusOK, product)
}

// ✅ Tambah produk
func CreateProduct(c echo.Context) error {
    name := c.FormValue("name")
    description := c.FormValue("description")
    price := c.FormValue("price")

    file, err := c.FormFile("image")
    if err != nil {
        return c.JSON(http.StatusBadRequest, echo.Map{"error": "Gambar diperlukan"})
    }

    src, err := file.Open()
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membuka file"})
    }
    defer src.Close()

    // Simpan file
    filePath := "../ecommerce-frontend/public/images/" + file.Filename
    dst, err := os.Create(filePath)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan file"})
    }
    defer dst.Close()

    if _, err = io.Copy(dst, src); err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan file"})
    }

    // Insert ke DB
    result, err := config.DB.Exec(
        "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)",
        name, description, price, "/images/"+file.Filename,
    )
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan produk"})
    }

    // Ambil ID baru
    id, _ := result.LastInsertId()

    // Return produk yang baru ditambahkan
    var newProduct models.Product
    err = config.DB.QueryRow("SELECT id, name, description, price, image_url FROM products WHERE id = ?", id).
        Scan(&newProduct.ID, &newProduct.Name, &newProduct.Description, &newProduct.Price, &newProduct.ImageURL)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil produk baru"})
    }

    return c.JSON(http.StatusCreated, newProduct)
}

// ✅ Update produk
func UpdateProduct(c echo.Context) error {
    id := c.Param("id")

    name := c.FormValue("name")
    description := c.FormValue("description")
    price := c.FormValue("price")

    var imageURL string

    file, err := c.FormFile("image")
    if file != nil { // Jika ada file baru
        src, err := file.Open()
        if err != nil {
            return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal membuka file"})
        }
        defer src.Close()

        filePath := "../ecommerce-frontend/public/images/" + file.Filename
        dst, err := os.Create(filePath)
        if err != nil {
            return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan file"})
        }
        defer dst.Close()

        if _, err = io.Copy(dst, src); err != nil {
            return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menyimpan file"})
        }

        imageURL = "/images/" + file.Filename
    }

    query := "UPDATE products SET name=?, description=?, price=?"
    args := []interface{}{name, description, price}

    if imageURL != "" {
        query += ", image_url=?"
        args = append(args, imageURL)
    }

    query += " WHERE id=?"
    args = append(args, id)

    _, err = config.DB.Exec(query, args...)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal memperbarui produk"})
    }

    // Ambil produk terbaru setelah update
    var updatedProduct models.Product
    err = config.DB.QueryRow("SELECT id, name, description, price, image_url FROM products WHERE id=?", id).
        Scan(&updatedProduct.ID, &updatedProduct.Name, &updatedProduct.Description, &updatedProduct.Price, &updatedProduct.ImageURL)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal mengambil produk yang diperbarui"})
    }

    return c.JSON(http.StatusOK, updatedProduct)
}


// ✅ Hapus produk
func DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	_, err := config.DB.Exec("DELETE FROM products WHERE id=?", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal menghapus produk"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Produk berhasil dihapus"})
}

