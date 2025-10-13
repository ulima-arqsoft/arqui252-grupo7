//
//  ProductDetailStrategy.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import Foundation

@MainActor
protocol ProductDetailStrategy: AnyObject {
    
    func fetchProduct(vm: ProductDetailViewModel)
    
    func handleCloseButtonTapped(vm: ProductDetailViewModel)
}
