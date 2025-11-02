//
//  Product.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//


struct Product: Codable, Identifiable {
    let id: Int?
    let name: String?
    let price: String?
    let thumbnailUrl: String?
    let inStock: Bool?
    let rating: Double?
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case price
        case thumbnailUrl = "thumbnail_url"
        case inStock = "in_stock"
        case rating
    }
}
