//
//  ProductView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import LoopCore

struct ProductCardView: View {
    let product: LoopProduct
    var body: some View {
        VStack {
            AsyncImage(url: product.primaryImageURL) { image in
                image
                    .resizable()
                    .scaledToFill()
            } placeholder: {
                Text("VACIO")
            }
            .frame(width: 180, height: 200)
            .clipped()
            VStack(alignment: .leading, spacing: 10) {
                Text(product.name)
                    .font(.system(size: 14, weight: .medium))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
                Text(product.description)
                    .font(.system(size: 12, weight: .regular))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 10)
        }
        .frame(width: 180)
    }
}

#Preview {
    ProductCardView(product: .Mocklist[0])
}
