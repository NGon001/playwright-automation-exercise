export class ProductInfo{
    Name: string;
    Price: number;
    Quantity: number;

    constructor(name: string, price: number, quantity: number){
        this.Name = name;
        this.Price = price;
        this.Quantity = quantity;
    }
}