package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"backend/blockchain"
)

var shopBlockchain *blockchain.Blockchain

func InitShopVerificationRoutes(bc *blockchain.Blockchain) {
	shopBlockchain = bc
}

// SubmitVerificationRequest handles shopkeeper verification requests
func SubmitVerificationRequest(w http.ResponseWriter, r *http.Request) {
	var request blockchain.ShopVerificationRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	request.Status = "Pending"
	request.Timestamp = time.Now().Format(time.RFC3339)

	shopBlockchain.AddShopVerificationRequest(request)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification request submitted successfully"})
}

// GetVerificationRequests retrieves all verification requests
func GetVerificationRequests(w http.ResponseWriter, r *http.Request) {
	blocks := shopBlockchain.GetBlocks()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blocks)
}

// UpdateVerificationStatus updates the status of a verification request
func UpdateVerificationStatus(w http.ResponseWriter, r *http.Request) {
	var update struct {
		ShopID string `json:"shop_id"`
		Status string `json:"status"` // Approved or Rejected
	}

	err := json.NewDecoder(r.Body).Decode(&update)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Update the blockchain (simplified for demonstration)
	chain := shopBlockchain.GetBlocks()
	for _, block := range chain {
		// Assert that block.Data is a map[string]interface{}
		data, ok := block.Data.(map[string]interface{})
		if !ok {
			http.Error(w, "Invalid block data format", http.StatusInternalServerError)
			return
		}

		// Check and update the shop ID and status
		if data["shop_id"] == update.ShopID {
			data["status"] = update.Status
			break
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification status updated successfully"})
}

func GetShopVerificationRequests(w http.ResponseWriter, r *http.Request) {
	blocks := shopBlockchain.GetBlocks() // Use GetBlocks instead of GetAllBlocks
	json.NewEncoder(w).Encode(blocks)
}
