//
//  RecommendedForYouSectionView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import LoopCore

struct RecommendedForYouSectionView: View {
    let categories: [LoopCategory] = LoopCategory.allCases
    let products: [LoopProduct] = LoopProduct.Mocklist
    let onProductTappedAction: (LoopProduct) -> Void
    
    @State var selectedCategory: LoopCategory = LoopCategory.allCases.first ?? .lifestyle
    var body: some View {
        VStack {
            HStack {
                Text("Recomendado para ti")
                    .font(.system(size: 20, weight: .bold))
                Image("ic_settings")
                    .renderingMode(.template)
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                Spacer()
            }
            .padding(.horizontal)
           
            RecommendedForYouHeaderView(
                categories: categories,
                selectedCategory: $selectedCategory
            )
            RecommendedForYouProductsView(
                products: products,
                onProductTappedAction: onProductTappedAction
            )
            
        }
    }
}

#Preview {
    RecommendedForYouSectionView(onProductTappedAction: {_ in})
}
