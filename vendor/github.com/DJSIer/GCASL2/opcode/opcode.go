package opcode

import (
	"github.com/DJSIer/GCASL2/symbol"

	"github.com/DJSIer/GCASL2/token"
)

// Opcode CASL2 Opcode struct
type Opcode struct {
	Code      uint16         //2byte
	Addr      uint16         //Address
	AddrLabel string         //Address Label
	Op        uint8          //1byte
	Length    int            //Opcode Length
	Label     *symbol.Symbol `json:"Label,omitempty"` //Label
	Token     token.Token    //token
}

func New() *Opcode {
	o := &Opcode{
		Addr: 0xFFFF,
	}
	return o
}
