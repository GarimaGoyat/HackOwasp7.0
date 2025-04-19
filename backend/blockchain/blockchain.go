package blockchain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

type Product struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Price     string `json:"price"`
	Shop      string `json:"shop"`
	OnBlinkit bool   `json:"onBlinkit"`
	Location  string `json:"location,omitempty"`
}

type Block struct {
	Index     int
	Timestamp string
	Product   Product
	PrevHash  string
	Hash      string
}

type Blockchain struct {
	blocks []*Block
	mutex  sync.Mutex
}

func NewBlockchain() *Blockchain {

	// Create an empty product for genesis block
	emptyProduct := Product{}

	genesisBlock := &Block{
		Index:     0,
		Timestamp: time.Now().String(),
		Product:   emptyProduct,
		PrevHash:  "",
		Hash:      "",
	}
	genesisBlock.Hash = calculateHash(genesisBlock)
	return &Blockchain{
		blocks: []*Block{genesisBlock},
	}
}

func (bc *Blockchain) AddBlock(product Product) *Block {
	bc.mutex.Lock()
	defer bc.mutex.Unlock()

	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := &Block{
		Index:     prevBlock.Index + 1,
		Timestamp: time.Now().Format(time.RFC3339),
		Product:   product,
		PrevHash:  prevBlock.Hash,
	}
	newBlock.Hash = calculateHash(newBlock)
	bc.blocks = append(bc.blocks, newBlock)
	return newBlock
}

func calculateHash(block *Block) string {
	productJson, _ := json.Marshal(block.Product)

	// make the record
	record := fmt.Sprintf("%d%s%s%s%s", block.Index, block.Timestamp, block.PrevHash, string(productJson), block.PrevHash)
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

// Add these methods to blockchain.go

// Get all products stored in the blockchain
func (bc *Blockchain) GetAllProducts() []Product {
	bc.mutex.Lock()
	defer bc.mutex.Unlock()

	var products []Product
	for _, block := range bc.blocks {
		if block.Index > 0 { // Skip genesis block
			products = append(products, block.Product)
		}
	}
	return products
}

// Get product by ID
func (bc *Blockchain) GetProductById(id int) (Product, bool) {
	bc.mutex.Lock()
	defer bc.mutex.Unlock()

	for _, block := range bc.blocks {
		if block.Product.ID == id {
			return block.Product, true
		}
	}
	return Product{}, false
}

// Get products by shop
func (bc *Blockchain) GetProductsByShop(shopName string) []Product {
	bc.mutex.Lock()
	defer bc.mutex.Unlock()

	var products []Product
	for _, block := range bc.blocks {
		if block.Index > 0 && block.Product.Shop == shopName {
			products = append(products, block.Product)
		}
	}
	return products
}
