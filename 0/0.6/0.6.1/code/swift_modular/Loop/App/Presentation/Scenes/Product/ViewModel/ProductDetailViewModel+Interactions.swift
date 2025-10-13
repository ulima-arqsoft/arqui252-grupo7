//
//  ProductDetailViewModel+Interactions.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import Foundation

extension ProductDetailViewModel {
    
    func onCloseButtonTapped() {
        strategy.handleCloseButtonTapped(vm: self)
    }
}
