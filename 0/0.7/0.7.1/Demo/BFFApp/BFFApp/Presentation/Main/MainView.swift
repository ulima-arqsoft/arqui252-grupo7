//
//  MainView.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//

import SwiftUI

struct MainView: View {
    
    @ObservedObject var viewModel: MainViewModel
    
    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading && viewModel.products.isEmpty {
                    // Loading state
                    VStack(spacing: 20) {
                        ProgressView()
                            .scaleEffect(1.5)
                        Text("Cargando productos...")
                            .font(.headline)
                            .foregroundColor(.secondary)
                    }
                } else if let errorMessage = viewModel.errorMessage {
                    // Error state
                    VStack(spacing: 20) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.system(size: 60))
                            .foregroundColor(.red)
                        Text(errorMessage)
                            .font(.headline)
                            .multilineTextAlignment(.center)
                            .padding()
                        Button("Reintentar" ,action: viewModel.refresh)
                        .buttonStyle(.borderedProminent)
                    }
                    .padding()
                } else {
                    // Content
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(viewModel.products) { product in
                                let index = viewModel.products.firstIndex(where: {$0.id == product.id})
                                ProductCardView(product: product)
                                    .onAppear {
                                        let mustRecharge = index == viewModel.products.count - 1
                                        if mustRecharge {
                                            viewModel.doFetchMoreProducts()
                                        }
                                        
                                    }
                            }
                        }
                        .padding()
                            
                    }
                    .refreshable {
                        viewModel.refresh()
                    }
                }
            }
            .navigationTitle("E-Commerce Mobile")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
}

