//
//  HomeViewModel+Interactions.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import Foundation
import LoopCore

extension HomeViewModel {
    func onProductButtonTapped(product: LoopProduct) {
        navigateToProductDetail(product: product)
    }
}
