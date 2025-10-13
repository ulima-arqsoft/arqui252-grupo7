//
//  HomeViewModel+Routes.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import Foundation
import LoopCore

extension HomeViewModel {
    func navigateToProductDetail(product: LoopProduct) {
        router?.showScreen(.sheet) { _ in
            ProductDetailBuilder.build(product: product)
        }
    }
}
