package symbol

type Symbol struct {
	Label   string
	Index   int
	Address uint16
}

type SymbolTable struct {
	store          map[string]Symbol
	numDefinitions int
}

func NewSymbolTable() *SymbolTable {
	s := make(map[string]Symbol)
	return &SymbolTable{store: s}
}
func (s *SymbolTable) Define(label string, addr uint16) (Symbol, bool) {
	symbol := Symbol{Label: label, Index: s.numDefinitions, Address: addr}
	if val, ok := s.store[label]; ok {
		return val, false
	}
	s.store[label] = symbol
	s.numDefinitions++
	return symbol, true
}
func (s *SymbolTable) LiteralDefine(label string, addr uint16) bool {
	symbol := Symbol{Label: label, Index: s.numDefinitions, Address: addr}
	if _, ok := s.store[label]; ok {
		return false
	}
	s.store[label] = symbol
	s.numDefinitions++
	return true
}
func (s *SymbolTable) LiteralAddressSet(label string, addr uint16) {
	obj, ok := s.store[label]
	if !ok {
		return
	}
	obj.Address = addr
	s.store[label] = obj
	return
}
func (s *SymbolTable) Resolve(name string) (Symbol, bool) {
	obj, ok := s.store[name]
	if !ok {
		return obj, ok
	}
	return obj, ok
}
