package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func init() {
	// Initialize the database connection
	var err error
	db, err = sql.Open("mysql", "user:password@tcp(localhost:3306)/your_database")
	if err != nil {
		panic(err)
	}
}

// Get all products from the database
func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, price, shop FROM products")
	if err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var id, name, shop string
		var price float64
		if err := rows.Scan(&id, &name, &price, &shop); err != nil {
			http.Error(w, "Failed to parse products", http.StatusInternalServerError)
			return
		}
		products = append(products, map[string]interface{}{
			"id":    id,
			"name":  name,
			"price": price,
			"shop":  shop,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// Add a new product to the database
func AddProduct(w http.ResponseWriter, r *http.Request) {
	var product struct {
		Name  string  `json:"name"`
		Price float64 `json:"price"`
		Shop  string  `json:"shop"`
	}

	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO products (name, price, shop) VALUES (?, ?, ?)", product.Name, product.Price, product.Shop)
	if err != nil {
		http.Error(w, "Failed to add product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product added successfully"})
}
