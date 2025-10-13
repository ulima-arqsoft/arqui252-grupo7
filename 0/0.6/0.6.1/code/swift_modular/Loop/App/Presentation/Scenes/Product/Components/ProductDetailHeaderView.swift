//
//  ProductHeaderView.swift
//  Loop
//
//  Created by Kohji Onaja on 24/08/25.
//

import SwiftUI
import LoopCore

struct ProductDetailHeaderView: View {
    
    let product: LoopProduct
    @State var selectedImage: URL?
    
    var body: some View {
        let images =  [product.primaryImageURL] + product.secondaryImageURLs
        
        VStack {
            TabView(selection: $selectedImage){
                ForEach(images, id: \.self) { image in
                    ImageView(url: image)
                        .id(image)
                }
            }
            .tabViewStyle(.page)
            .frame(height: 350)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(images, id: \.self) { image in
                        let isSelected = image == selectedImage
                        ImageView(url: image)
                            .frame(width: 90, height: 90)
                            .overlay(alignment: .bottom) {
                                if isSelected {
                                    Rectangle()
                                        .frame(height: 3)
                                }
                            }
                            .onTapGesture {
                                withAnimation(.easeInOut) {
                                    selectedImage = image
                                }
                            }
                    }
                }
                .padding(.horizontal, 10)
            }
        }
        .onAppear {
            selectedImage = product.primaryImageURL
        }
    }
    
    @ViewBuilder
    private func ImageView(url: URL?) -> some View {
        AsyncImage(url: url) { image in
            image
                .resizable()
                .scaledToFill()
        } placeholder: {
            Text("VACIO")
        }
        .clipped()
    }
}

#Preview {
    ProductDetailBuilder.build(
        product: LoopProduct.Mocklist[0]
    )
}
