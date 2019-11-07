package lexer

import (
	"strings"

	"github.com/DJSIer/GCASL2/token"
)

// Lexer CASL2Lexer
type Lexer struct {
	input        string
	position     int
	readPosition int
	ch           byte
	line         int
}

// New CASL2Lexer init
func New(input string) *Lexer {
	l := &Lexer{input: input, line: 1}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.readPosition >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPosition]
	}
	l.position = l.readPosition
	l.readPosition++
}

// NextToken Token
func (l *Lexer) NextToken() token.Token {
	var tok token.Token
	l.skipWhitespace()
	switch l.ch {
	case ',':
		tok = newToken(token.COMMA, l.ch)
	case '-':
		if isDegit(l.peekChar()) {
			l.readChar()
			tok.Literal = "-" + l.readNumber()
			tok.Type = token.INT
			tok.Line = l.line
			return tok
		}
	case '#':
		if isHex(l.peekChar()) {
			l.readChar()
			tok.Literal = "#" + l.readHexNumber()
			tok.Type = token.HEX
			tok.Line = l.line
			return tok
		}
	case '=':
		if isDegit(l.peekChar()) {
			l.readChar()
			tok.Literal = "=" + l.readNumber()
			tok.Type = token.EQINT
			tok.Line = l.line
			return tok
		} else if l.peekChar() == '#' {
			l.readChar()
			if isHex(l.peekChar()) {
				l.readChar()
				tok.Literal = "=#" + l.readHexNumber()
				tok.Type = token.EQHEX
				tok.Line = l.line
				return tok
			}
		} else if l.peekChar() == '\'' {
			l.readChar()
			l.readChar()
			tok.Literal = "'=" + l.readCaslLetter()
			tok.Type = token.EQSTRING
			tok.Line = l.line
			return tok
		}
	case '\'':
		l.readChar()
		tok.Literal = "'" + l.readCaslLetter()
		tok.Type = token.STRING
		tok.Line = l.line
		return tok
	case ';':
		for l.ch != '\t' && l.ch != '\n' && l.ch != '\r' {
			l.readChar()
		}
		return l.NextToken()
	case 0:
		tok.Literal = ""
		tok.Type = token.EOF
		tok.Line = l.line
	default:
		if isLetter(l.ch) {
			tok.Literal = l.readInst()

			if isUppercaseLetter(tok.Literal) {
				tok.Type = token.LookupInst(tok.Literal)
			} else {
				tok.Type = token.ILLEGAL
			}
			tok.Line = l.line
			return tok
		} else if isDegit(l.ch) {
			tok.Literal = l.readNumber()
			tok.Type = token.INT
			tok.Line = l.line
			return tok
		} else {
			tok = newToken(token.ILLEGAL, l.ch)
		}
	}
	l.readChar()
	tok.Line = l.line
	return tok
}
func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\t' || l.ch == '\n' || l.ch == '\r' {
		if l.ch == '\n' {
			l.line++
		}
		l.readChar()
	}
}
func (l *Lexer) readInst() string {
	position := l.position
	for isLetterDegit(l.ch) {
		l.readChar()
	}
	return l.input[position:l.position]
}
func (l *Lexer) readNumber() string {
	position := l.position
	for isDegit(l.ch) {
		l.readChar()
	}
	return l.input[position:l.position]
}
func (l *Lexer) readHexNumber() string {
	position := l.position
	for isHex(l.ch) {
		l.readChar()
	}
	return l.input[position:l.position]
}
func (l *Lexer) readCaslLetter() string {
	position := l.position
	for isCaslLetter(l.ch) {
		if l.ch == '\'' && l.peekChar() == '\'' {
			l.readChar()
		} else if l.ch == '\'' {
			l.readChar()
			break
		}
		l.readChar()
	}
	return strings.Replace(l.input[position:l.position], "''", "'", -1)
}
func (l *Lexer) peekChar() byte {
	if l.readPosition >= len(l.input) {
		return 0
	} else {
		return l.input[l.readPosition]
	}
}

func isDegit(ch byte) bool {
	return '0' <= ch && ch <= '9'
}
func isHex(ch byte) bool {
	return '0' <= ch && ch <= '9' || 'A' <= ch && ch <= 'F' || 'a' <= ch && ch <= 'f'
}
func isLetter(ch byte) bool {
	return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z'
}
func isLetterDegit(ch byte) bool {
	return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '0' <= ch && ch <= '9'
}
func isUppercaseLetter(str string) bool {
	for _, s := range str {
		if 'a' <= s && s <= 'z' {
			return false
		}
	}
	return true
}
func isCaslLetter(ch byte) bool {
	_, ok := token.LookupLetter(ch)
	return ok
}

func newToken(tokenType token.TokenType, ch byte) token.Token {
	return token.Token{Type: tokenType, Literal: string(ch)}
}
