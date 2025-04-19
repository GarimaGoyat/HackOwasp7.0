package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/your_project/blockchain"
)

var shopBlockchain = blockchain.NewBlockchain()

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
	blocks := shopBlockchain.GetAllBlocks()
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
	for _, block := range shopBlockchain.Chain {
		if block.Data["shop_id"] == update.ShopID {
			block.Data["status"] = update.Status
			break
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification status updated successfully"})
}
