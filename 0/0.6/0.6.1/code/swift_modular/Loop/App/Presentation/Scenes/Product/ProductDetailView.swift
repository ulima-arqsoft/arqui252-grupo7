//
//  ProductDetailView.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import SwiftUI
import LoopCore

struct ProductDetailView: View {
    
    @ObservedObject var viewModel: ProductDetailViewModel
    
    var body: some View {
        let product = viewModel.product
        
        ScrollView {
            ProductDetailHeaderView(product: product)
            
            VStack(alignment: .leading, spacing: 10) {
                Text(product.description)
                    .font(.system(size: 15, weight: .regular))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .lineLimit(1)
                Text(product.name)
                    .font(.system(size: 24, weight: .semibold))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 10)
        }
        .safeAreaInset(edge: .bottom, alignment: .center) {
            HStack {
                Text("S/.\(product.price.formatted())")
                    .font(.system(size: 15, weight: .regular))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .lineLimit(1)
                Spacer()
                LoopButton(
                    text: "Añadir a la bolsa",
                    onTapButton: {}
                )
                    .frameHeight(height: 40)
            }
            .padding(10)
            .background()
            .shadow(radius: 1)
        }
        .overlay(alignment: .topLeading) {
            Button(action: viewModel.onCloseButtonTapped) {
                Image(systemName: "xmark")
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.black)
                    .frame(width: 18, height: 18)
                    .padding()
            }
        }
        .onAppear {
            viewModel.doOnAppear()
        }
    }
}

#Preview {
    ProductDetailBuilder.build(
        product: LoopProduct.Mocklist[0]
    )
}
