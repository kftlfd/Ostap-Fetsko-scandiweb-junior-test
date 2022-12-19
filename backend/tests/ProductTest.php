<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use App\Product;
use App\ValidationError;

final class ProductTest extends TestCase
{
    public function testRaisesExceptionOnEmptyConstructor()
    {
        $this->expectException(ValidationError::class);
        Product::create([]);
    }

    public function testCanBeCreated()
    {
        $p = Product::create([
            "type" => "DVD",
            "name" => "testDVD"
        ]);
        $this->assertInstanceOf(Product::class, $p);
        $this->assertEquals("testDVD", $p->name);
    }

    public function testRejectsWrongInput()
    {
        $p = Product::create([
            "type" => "DVD",
            "name" => 1,
            "price" => "one"
        ]);
        $this->assertNull($p->name);
        $this->assertNull($p->price);
        $this->assertNotEmpty($p->validate());
    }
}
