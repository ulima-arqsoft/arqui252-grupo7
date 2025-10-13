//
//  ProductDetailBaseStrategy.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import Foundation
import LoopCore

class ProductDetailBaseStrategy: ProductDetailStrategy {
    
    private let product: LoopProduct
    
    init(product: LoopProduct) {
        self.product = product
    }
    
    func fetchProduct(vm: ProductDetailViewModel) {
        vm.product = product
    }
    
    func handleCloseButtonTapped(vm: ProductDetailViewModel) {
        
    }
    
}
