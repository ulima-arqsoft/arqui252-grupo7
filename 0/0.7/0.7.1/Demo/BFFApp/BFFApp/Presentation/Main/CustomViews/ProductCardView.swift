//
//  ProductCardView.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//

import SwiftUI

struct ProductCardView: View {
    
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Imagen del producto
            AsyncImage(url: URL(string: product.thumbnailUrl ?? "")) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                        .overlay {
                            ProgressView()
                        }
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure:
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                        .overlay {
                            Image(systemName: "photo")
                                .font(.system(size: 30))
                                .foregroundColor(.gray)
                        }
                @unknown default:
                    EmptyView()
                }
            }
            .frame(height: 140)
            .clipped()
            
            // Información del producto
            VStack(alignment: .leading, spacing: 6) {
                // Nombre
                Text(product.name ?? "")
                    .font(.system(size: 14, weight: .semibold))
                    .lineLimit(2)
                    .frame(height: 36, alignment: .top)
                
                // Rating
                HStack(spacing: 4) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 11))
                        .foregroundColor(.yellow)
                    Text(String(format: "%.1f", product.rating ?? ""))
                        .font(.system(size: 12, weight: .medium))
                }
                
                Spacer(minLength: 4)
                
                // Precio y Stock
                HStack(alignment: .bottom) {
                    Text("$\(product.price)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.blue)
                    
                    Spacer()
                    
                    Circle()
                        .fill(product.inStock == true ? Color.green : Color.red)
                        .frame(width: 8, height: 8)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 10)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

#Preview {
    HStack(spacing: 16) {
        ProductCardView(product: Product(
            id: 1,
            name: "iPhone 15 Pro Max",
            price: "1199.99",
            thumbnailUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300",
            inStock: true,
            rating: 4.9
        ))
        
        ProductCardView(product: Product(
            id: 2,
            name: "MacBook Air M2",
            price: "1299.99",
            thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
            inStock: true,
            rating: 4.8
        ))
    }
    .padding()
}
