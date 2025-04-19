package main

import (
	"backend/blockchain"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/your_project/routes"
)

var bc *blockchain.Blockchain
var db *sql.DB
var jwtKey = []byte("your_secret_key") // Replace with a secure key

type Product struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Price     string `json:"price"`
	Shop      string `json:"shop"`
	OnBlinkit bool   `json:"onBlinkit"`
	Location  string `json:"location,omitempty"`
	Category  string `json:"category,omitempty"`
	Quantity  int    `json:"quantity,omitempty"`
	Image     string `json:"image,omitempty"`
}

// Update your Credentials struct to include shop owner details
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	ShopName string `json:"shopName,omitempty"`
	Email    string `json:"email,omitempty"`
	Role     string `json:"role,omitempty"`
}

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

var products = []Product{
	{ID: 1, Name: "Campus T-Shirt", Price: "₹0", Shop: "Campus Store", OnBlinkit: false},
	{ID: 2, Name: "Special Chai Mix", Price: "₹150", Shop: "Canteen", OnBlinkit: false},
}

var requestedItems = []Product{}

func initializeDatabase() error {
	// Connect to MySQL server (without database)
	rootDB, err := sql.Open("mysql", "root:Ggoyat@15@tcp(127.0.0.1:3306)/")
	if err != nil {
		return err
	}
	defer rootDB.Close()

	// Create database if not exists
	_, err = rootDB.Exec("CREATE DATABASE IF NOT EXISTS `LocalMart`")
	if err != nil {
		return err
	}

	// Create tables
	queries := []string{
		`CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        )`,
		`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role_id INT NOT NULL,
            FOREIGN KEY (role_id) REFERENCES roles(id)
        )`,
		`CREATE TABLE IF NOT EXISTS shops (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            shop_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
		`CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(100),
            price VARCHAR(50) NOT NULL,
            quantity INT,
            image_url VARCHAR(255),
            shopkeeper_username VARCHAR(50) NOT NULL,
            FOREIGN KEY (shopkeeper_username) REFERENCES users(username)
        )`,
		`CREATE TABLE IF NOT EXISTS verification_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            shopkeeper_username VARCHAR(50) NOT NULL,
            business_name VARCHAR(100) NOT NULL,
            address VARCHAR(255) NOT NULL,
            document_url VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (shopkeeper_username) REFERENCES users(username)
        )`,
		`INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin'), (2, 'user'), (3, 'shop_owner')`,
		`INSERT IGNORE INTO users (username, password, role_id) 
         VALUES ('admin1', 'admin_password', 1), ('user1', 'user_password', 2)
         ON DUPLICATE KEY UPDATE username=username`,
	}

	for _, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	// Get DB credentials from env or use defaults
	dbUser := getEnv("DB_USER", "root")
	dbPass := getEnv("DB_PASS", "Ggoyat@15")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "LocalMart")

	// Connection string
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		dbUser, dbPass, dbHost, dbPort, dbName)

	// Connect
	var err error
	db, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize database
	if err := initializeDatabase(); err != nil {
		log.Fatal("Database initialization failed: ", err)
	}

	bc = blockchain.NewBlockchain()

	r := mux.NewRouter()

	// Public routes
	r.HandleFunc("/login", login).Methods("POST")
	r.HandleFunc("/signup", signup).Methods("POST")

	// Protected routes
	api := r.PathPrefix("/api").Subrouter()
	api.Use(authMiddleware)
	api.HandleFunc("/requests", getRequestedItems).Methods("GET")
	api.HandleFunc("/list-item", listItem).Methods("POST")

	// Product endpoints
	api.HandleFunc("/products", getProducts).Methods("GET")
	api.HandleFunc("/products", addProduct).Methods("POST")
	api.HandleFunc("/shopkeeper-products", getShopkeeperProducts).Methods("GET")
	api.HandleFunc("/shopkeeper/products", getShopkeeperProducts).Methods("GET")
	api.HandleFunc("/shopkeeper/add-product", addNewProduct).Methods("POST")
	api.HandleFunc("/products", getAllProducts).Methods("GET")
	api.HandleFunc("/product", getProductByID).Methods("GET")
	api.HandleFunc("/products/{id}", getProductByID).Methods("GET")
	api.HandleFunc("/products/{id}", getProductByID).Methods("GET")
	api.HandleFunc("/products/{id}", getProductByID).Methods("GET")
	api.HandleFunc("/products/{id}", getProductByID).Methods("GET")
	api.HandleFunc("/products/{id}", deleteProduct).Methods("DELETE")
	api.HandleFunc("/products/delete", deleteProduct).Methods("DELETE")

	// Shop endpoints
	api.HandleFunc("/shop/details", getShopDetails).Methods("GET")
	api.HandleFunc("/shop/details", updateShopDetails).Methods("PUT")

	// Blockchain endpoints
	api.HandleFunc("/blockchain", getBlockchain).Methods("GET")

	// Verification request endpoint
	api.HandleFunc("/verification/request", requestVerification).Methods("POST")

	// Verification routes
	http.HandleFunc("/api/verification/submit", routes.SubmitVerificationRequest)
	http.HandleFunc("/api/verification/requests", routes.GetVerificationRequests)
	http.HandleFunc("/api/verification/update", routes.UpdateVerificationStatus)

	// New routes for products
	http.HandleFunc("/api/products", routes.GetAllProducts)
	http.HandleFunc("/api/products/add", routes.AddProduct)

	fmt.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Helper function to get env vars with defaults
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var newProduct Product
	if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Add complete product to blockchain
	bc.AddBlock(blockchain.Product{
		ID:        newProduct.ID,
		Name:      newProduct.Name,
		Price:     newProduct.Price,
		Shop:      newProduct.Shop,
		OnBlinkit: newProduct.OnBlinkit,
		Location:  newProduct.Location,
	})

	products = append(products, newProduct)
	w.WriteHeader(http.StatusCreated)
}

func getRequestedItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(requestedItems)
}

func requestItem(w http.ResponseWriter, r *http.Request) {
	var requestedItem Product
	if err := json.NewDecoder(r.Body).Decode(&requestedItem); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	requestedItems = append(requestedItems, requestedItem)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item requested successfully"})
}

func listItem(w http.ResponseWriter, r *http.Request) {
	var itemToBeListed Product
	if err := json.NewDecoder(r.Body).Decode(&itemToBeListed); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Add item to blockchain
	bc.AddBlock(blockchain.Product{
		ID:        itemToBeListed.ID,
		Name:      itemToBeListed.Name,
		Price:     itemToBeListed.Price,
		Shop:      itemToBeListed.Shop,
		OnBlinkit: itemToBeListed.OnBlinkit,
		Location:  itemToBeListed.Location,
	})

	// Add item to products list
	products = append(products, itemToBeListed)

	// Remove from requested items
	for i, item := range requestedItems {
		if item.ID == itemToBeListed.ID {
			requestedItems = append(requestedItems[:i], requestedItems[i+1:]...)
			break
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item listed successfully"})
}

func getBlockchain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bc.GetBlocks())
}

func login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var hashedPassword, role string
	err := db.QueryRow("SELECT password, name FROM users INNER JOIN roles ON users.role_id = roles.id WHERE username = ?", creds.Username).Scan(&hashedPassword, &role)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Compare passwords (use bcrypt in production)
	if creds.Password != hashedPassword {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		Role:     role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}

func signup(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Check if username already exists
	var exists bool
	err := db.QueryRow("SELECT 1 FROM users WHERE username = ?", creds.Username).Scan(&exists)
	if err == nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	// In production, hash the password with bcrypt here

	// Start a transaction to ensure both user and shop records are created
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Default role is user (2) unless specified
	roleID := 2
	if creds.Role == "shop_owner" {
		roleID = 3
	}

	// Insert new user
	result, err := tx.Exec("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
		creds.Username, creds.Password, roleID)
	if err != nil {
		tx.Rollback()
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// If this is a shop owner, store shop details
	if roleID == 3 && creds.ShopName != "" {
		userID, _ := result.LastInsertId()
		_, err = tx.Exec("INSERT INTO shops (user_id, shop_name, email) VALUES (?, ?, ?)",
			userID, creds.ShopName, creds.Email)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Failed to create shop", http.StatusInternalServerError)
			return
		}
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenStr := cookie.Value
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Add role-based access control
		if strings.HasPrefix(r.URL.Path, "/api/requests") && claims.Role != "admin" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func getShopkeeperProducts(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Fetch products from the blockchain for the shopkeeper's shop
	shopProducts := bc.GetProductsByShop(claims.Username)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(shopProducts)
}

func addNewProduct(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var newProduct Product
	if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Insert the product into the database
	_, err = db.Exec(
		"INSERT INTO products (name, category, price, quantity, image_url, shopkeeper_username) VALUES (?, ?, ?, ?, ?, ?)",
		newProduct.Name, newProduct.Category, newProduct.Price, newProduct.Quantity, newProduct.Image, claims.Username,
	)
	if err != nil {
		http.Error(w, "Failed to add product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product added successfully"})
}

func getAllProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, category, price, quantity, image_url, shopkeeper_username FROM products")
	if err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Name, &product.Category, &product.Price, &product.Quantity, &product.Image, &product.Shop); err != nil {
			http.Error(w, "Failed to parse products", http.StatusInternalServerError)
			return
		}
		products = append(products, product)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// Add this function to handle fetching shop details
func getShopDetails(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var shop struct {
		ShopName string `json:"shopName"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Address  string `json:"address"`
		LogoURL  string `json:"logoUrl"`
	}

	err = db.QueryRow("SELECT shop_name, email, phone, address, logo_url FROM shops WHERE user_id = (SELECT id FROM users WHERE username = ?)", claims.Username).Scan(&shop.ShopName, &shop.Email, &shop.Phone, &shop.Address, &shop.LogoURL)
	if err != nil {
		http.Error(w, "Failed to fetch shop details", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(shop)
}

// Add this function to handle updating shop details
func updateShopDetails(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var shop struct {
		ShopName string `json:"shopName"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Address  string `json:"address"`
		LogoURL  string `json:"logoUrl"`
	}

	if err := json.NewDecoder(r.Body).Decode(&shop); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err = db.Exec("UPDATE shops SET shop_name = ?, email = ?, phone = ?, address = ?, logo_url = ? WHERE user_id = (SELECT id FROM users WHERE username = ?)", shop.ShopName, shop.Email, shop.Phone, shop.Address, shop.LogoURL, claims.Username)
	if err != nil {
		http.Error(w, "Failed to update shop details", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Shop details updated successfully"})
}

func getProductByID(w http.ResponseWriter, r *http.Request) {
	productID := r.URL.Query().Get("id")
	if productID == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	var product struct {
		ID       int     `json:"id"`
		Name     string  `json:"name"`
		Category string  `json:"category"`
		Price    float64 `json:"price"`
		Quantity int     `json:"quantity"`
		Image    string  `json:"image"`
	}

	err := db.QueryRow("SELECT id, name, category, price, quantity, image_url FROM products WHERE id = ?", productID).Scan(
		&product.ID, &product.Name, &product.Category, &product.Price, &product.Quantity, &product.Image,
	)
	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.URL.Query().Get("id")
	if productID == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("DELETE FROM products WHERE id = ?", productID)
	if err != nil {
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product deleted successfully"})
}

func requestVerification(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var request struct {
		BusinessName string `json:"businessName"`
		Address      string `json:"address"`
		DocumentURL  string `json:"documentUrl"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err = db.Exec(
		"INSERT INTO verification_requests (shopkeeper_username, business_name, address, document_url, status) VALUES (?, ?, ?, ?, ?)",
		claims.Username, request.BusinessName, request.Address, request.DocumentURL, "Pending",
	)
	if err != nil {
		http.Error(w, "Failed to submit verification request", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification request submitted successfully"})
}
