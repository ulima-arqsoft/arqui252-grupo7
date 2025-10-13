//
//  ProductDetailView.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import SwiftUI
import LoopCore

@MainActor
class ProductDetailViewModel: ObservableObject {
    
    let strategy: ProductDetailStrategy
    
    init(strategy: ProductDetailStrategy) {
        self.strategy = strategy
    }
    
    @Published var product: LoopProduct = .init(
        id: "",
        name: "",
        description: "",
        price: 0,
        category: .finance,
        primaryImageURL: nil,
        secondaryImageURLs: []
    )
    
    func doOnAppear() {
        strategy.fetchProduct(vm: self)
    }
}
