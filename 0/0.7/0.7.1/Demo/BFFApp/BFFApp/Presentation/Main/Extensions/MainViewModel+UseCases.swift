//
//  MainViewModel+UseCases.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//  Copyright (c) 2025 Fitia. All rights reserved.
//

import Foundation

extension MainViewModel {
    
    func doFetchProducts() {
        isLoading = true
        errorMessage = nil
        Task {
            do {
                let response = try await useCases.getProductsUseCase.execute(page: currentPage)
                let results = response.results ?? []
                self.products = results
                self.hasMorePages = results.count >= 10
                isLoading = false
            } catch {
                isLoading = false
                print(error)
                errorMessage = error.localizedDescription
            }
        }
    }
    
    func doFetchMoreProducts() {
        guard !isLoadingMore && !isLoading && hasMorePages else { return }

        isLoadingMore = true
        currentPage += 1
        Task {
            do {
                let response = try await useCases.getProductsUseCase.execute(page: currentPage)
                let results = response.results ?? []
                self.products.append(contentsOf: results)
                self.hasMorePages = results.count >= 10
            } catch {
                print(error)
                errorMessage = error.localizedDescription
            }
            isLoadingMore = false
        }
    }
    
    func doRefresh() {
        currentPage = 1
        hasMorePages = true
        doFetchMoreProducts()
    }
}
