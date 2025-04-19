package blockchain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

type Block struct {
	Index     int
	Timestamp string
	Data      interface{}
	PrevHash  string
	Hash      string
}

type Blockchain struct {
	blocks []*Block
	mutex  sync.Mutex
}

func NewBlockchain() *Blockchain {

	// Create an empty data for genesis block
	emptyData := map[string]interface{}{}

	genesisBlock := &Block{
		Index:     0,
		Timestamp: time.Now().String(),
		Data:      emptyData,
		PrevHash:  "",
		Hash:      "",
	}
	genesisBlock.Hash = calculateHash(genesisBlock)
	return &Blockchain{
		blocks: []*Block{genesisBlock},
	}
}

func (bc *Blockchain) AddBlock(data interface{}) *Block {
	bc.mutex.Lock()
	defer bc.mutex.Unlock()

	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := &Block{
		Index:     prevBlock.Index + 1,
		Timestamp: time.Now().Format(time.RFC3339),
		Data:      data,
		PrevHash:  prevBlock.Hash,
	}
	newBlock.Hash = calculateHash(newBlock)
	bc.blocks = append(bc.blocks, newBlock)
	return newBlock
}

func calculateHash(block *Block) string {
	dataJson, _ := json.Marshal(block.Data)

	// make the record
	record := fmt.Sprintf("%d%s%s%s%s", block.Index, block.Timestamp, block.PrevHash, string(dataJson), block.PrevHash)
	h := sha256.New()
	h.Write([]byte(record))
	hash := h.Sum(nil)
	return hex.EncodeToString(hash)
}

func (bc *Blockchain) Validate() bool {
	for i := 1; i < len(bc.blocks); i++ {
		prevBlock := bc.blocks[i-1]
		currentBlock := bc.blocks[i]

		if currentBlock.Hash != calculateHash(currentBlock) {
			return false
		}
		if currentBlock.PrevHash != prevBlock.Hash {
			return false
		}
	}
	return true
}

func (bc *Blockchain) GetBlocks() []*Block {
	return bc.blocks
}

// ShopVerificationRequest represents a shopkeeper's verification request
type ShopVerificationRequest struct {
	ShopID    string `json:"shop_id"`
	ShopName  string `json:"shop_name"`
	OwnerName string `json:"owner_name"`
	Status    string `json:"status"` // Pending, Approved, Rejected
	Timestamp string `json:"timestamp"`
}

// AddShopVerificationRequest adds a new verification request to the blockchain
func (bc *Blockchain) AddShopVerificationRequest(request ShopVerificationRequest) {
	blockData := map[string]interface{}{
		"shop_id":    request.ShopID,
		"shop_name":  request.ShopName,
		"owner_name": request.OwnerName,
		"status":     request.Status,
		"timestamp":  request.Timestamp,
	}
	bc.AddBlock(blockData)
}
