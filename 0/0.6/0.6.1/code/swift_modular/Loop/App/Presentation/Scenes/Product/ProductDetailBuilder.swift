//
//  ProductDetailViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import SwiftUI
import LoopCore

@MainActor
struct ProductDetailBuilder {
    
    @ViewBuilder
    static func build(product: LoopProduct) -> some View {
        ProductDetailViewContainer(product: product)
    }
    
    @ViewBuilder
    private static func innerBuilder(product: LoopProduct) -> ProductDetailView {
        let strategy = buildStrategy(product: product)
        let vm = buildViewModel(strategy: strategy)
        ProductDetailView(viewModel: vm)
    }
    
    private static func buildViewModel(strategy: ProductDetailStrategy) -> ProductDetailViewModel {
        ProductDetailViewModel(strategy: strategy)
    }
    
    private static func buildStrategy(product: LoopProduct) -> ProductDetailStrategy {
        ProductDetailBaseStrategy(product: product)
    }

    private struct ProductDetailViewContainer: View {
        let product: LoopProduct
        
        var body: some View {
            NavigatableView { _ in
                innerBuilder(product: product)
            }
        }
    }
}
