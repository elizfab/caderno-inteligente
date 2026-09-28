// Package token implementa geração e validação de JWT (HS256)
// usando apenas a biblioteca padrão, sem dependências externas.
package token

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

var (
	ErrInvalidToken = errors.New("token inválido")
	ErrExpiredToken = errors.New("token expirado")
)

// Claims são as informações carregadas dentro do JWT.
type Claims struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Iat   int64  `json:"iat"`
	Exp   int64  `json:"exp"`
}

type header struct {
	Alg string `json:"alg"`
	Typ string `json:"typ"`
}

func encode(v any) (string, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return "", fmt.Errorf("falha ao serializar segmento do token: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(data), nil
}

func sign(secret, signingInput string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(signingInput))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

// Generate cria um JWT HS256 assinado com o secret informado.
func Generate(secret, userID, email, name string, ttl time.Duration) (string, error) {
	now := time.Now()
	head, err := encode(header{Alg: "HS256", Typ: "JWT"})
	if err != nil {
		return "", err
	}
	payload, err := encode(Claims{
		Sub:   userID,
		Email: email,
		Name:  name,
		Iat:   now.Unix(),
		Exp:   now.Add(ttl).Unix(),
	})
	if err != nil {
		return "", err
	}
	signingInput := head + "." + payload
	return signingInput + "." + sign(secret, signingInput), nil
}

// Validate verifica assinatura e expiração, devolvendo as claims.
func Validate(secret, tok string) (*Claims, error) {
	parts := strings.Split(tok, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}
	signingInput := parts[0] + "." + parts[1]
	expected := sign(secret, signingInput)
	if !hmac.Equal([]byte(expected), []byte(parts[2])) {
		return nil, ErrInvalidToken
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}
	var claims Claims
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, ErrInvalidToken
	}
	if time.Now().Unix() >= claims.Exp {
		return nil, ErrExpiredToken
	}
	return &claims, nil
}
