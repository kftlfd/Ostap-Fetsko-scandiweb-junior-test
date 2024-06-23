package models

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	_ "github.com/ncruces/go-sqlite3/driver"
	_ "github.com/ncruces/go-sqlite3/embed"
)

type ProductRow struct {
	Id     int
	Sku    string
	Name   string
	Price  float64
	Type   string
	Size   float64
	Width  float64
	Length float64
	Height float64
	Weight float64
}

type Product struct {
	Id    int     `json:"id"`
	Sku   string  `json:"sku"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"`
}

type ProductDVD struct {
	Product
	Size float64 `json:"size"`
}

type ProductFurniture struct {
	Product
	Width  float64 `json:"width"`
	Length float64 `json:"length"`
	Height float64 `json:"height"`
}

type ProductBook struct {
	Product
	Weight float64 `json:"weight"`
}

type MyDB struct{}

var DB MyDB

var db *sql.DB

func ConnectDB() {
	sqliteDB, err := sql.Open("sqlite3", "file:db.sqlite3")
	if err != nil {
		panic("Failed to connect to DB")
	}

	schema, err := os.ReadFile("db.schema.sql")
	if err != nil {
		panic("DB schema not found")
	}

	sqliteDB.Exec(string(schema))

	db = sqliteDB
}

func (mdb *MyDB) GetAll() ([]ProductRow, error) {
	rows, err := db.Query("SELECT * FROM products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	vals := make([]ProductRow, 0)

	for rows.Next() {
		var p ProductRow
		var s sql.NullFloat64
		var w sql.NullFloat64
		var h sql.NullFloat64
		var l sql.NullFloat64
		var weight sql.NullFloat64

		rows.Scan(&p.Id, &p.Sku, &p.Name, &p.Price, &p.Type, &s, &w, &h, &l, &weight)

		p.Size = s.Float64
		p.Width = w.Float64
		p.Height = h.Float64
		p.Length = l.Float64
		p.Weight = weight.Float64

		vals = append(vals, p)
	}

	return vals, nil
}

func (p *Product) GetBaseKeys() []string {
	return []string{"Sku", "Name", "Price", "Type"}
}

func (p *Product) GetBaseValues() []any {
	return []any{p.Sku, p.Name, p.Price, p.Type}
}

func (p *ProductDVD) GetKeys() []string {
	keys := p.GetBaseKeys()
	return append(keys, "Size")
}

func (p *ProductDVD) GetValues() []any {
	vals := p.GetBaseValues()
	return append(vals, p.Size)
}

func (p *ProductBook) GetKeys() []string {
	keys := p.GetBaseKeys()
	return append(keys, "Weight")
}

func (p *ProductBook) GetValues() []any {
	vals := p.GetBaseValues()
	return append(vals, p.Weight)
}

func (p *ProductFurniture) GetKeys() []string {
	keys := p.GetBaseKeys()
	return append(keys, "Width", "Length", "Height")
}

func (p *ProductFurniture) GetValues() []any {
	vals := p.GetBaseValues()
	return append(vals, p.Height, p.Length, p.Height)
}

type Insertable interface {
	GetKeys() []string
	GetValues() []any
}

func (mdb *MyDB) Insert(row Insertable) error {
	keys := row.GetKeys()
	vals := make([]string, len(keys))
	for i := range keys {
		vals[i] = "?"
	}

	query := fmt.Sprintf("INSERT INTO products (%s) VALUES (%s)", strings.Join(keys, ", "), strings.Join(vals, ", "))

	stmt, err := db.Prepare(query)
	if err != nil {
		return err
	}

	values := row.GetValues()
	if len(values) != len(keys) {
		return fmt.Errorf("values len doesn't match keys len")
	}

	_, err = stmt.Exec(values...)
	stmt.Close()
	return err
}

func (mdb *MyDB) Delete(ids []int) error {
	vals := make([]string, len(ids))
	for i := range ids {
		vals[i] = "?"
	}

	query := fmt.Sprintf("DELETE FROM products WHERE id IN (%s)", strings.Join(vals, ", "))

	stmt, err := db.Prepare(query)
	if err != nil {
		return err
	}

	valss := make([]any, len(ids))
	for i, v := range ids {
		valss[i] = v
	}

	_, err = stmt.Exec(valss...)
	stmt.Close()
	return err
}
