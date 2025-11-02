//
//  ProductsResponse.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//


struct ProductsResponse: Codable {
    let results: [Product]?
    let page: String?
    let pageSize: Int?
    let source: String?
    
    enum CodingKeys: String, CodingKey {
        case results
        case page
        case pageSize = "page_size"
        case source
    }
}

