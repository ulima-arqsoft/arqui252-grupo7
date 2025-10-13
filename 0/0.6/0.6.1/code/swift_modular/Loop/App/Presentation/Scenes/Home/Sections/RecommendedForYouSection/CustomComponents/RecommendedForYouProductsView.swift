//
//  RecommendedForYouProductsView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import LoopCore

struct RecommendedForYouProductsView: View {
    let products: [LoopProduct]
    let onProductTappedAction: (LoopProduct) -> Void
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(products, id: \.id) { product in
                    ProductCardView(product: product)
                        .onTapGesture {
                            print("PRODUCTO", product.name)
                            onProductTappedAction(product)
                        }
                }
            }
            .padding(.horizontal)
        }
    }
}

#Preview {
    RecommendedForYouProductsView(
        products: [],
        onProductTappedAction: {_ in}
    )
}
