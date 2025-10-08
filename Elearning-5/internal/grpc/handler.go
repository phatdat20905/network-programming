package grpc

import (
	"math/rand"
	"sync"
	"time"
)

var (
	mu sync.Mutex
)

func init() {
	rand.Seed(time.Now().UnixNano())
}
