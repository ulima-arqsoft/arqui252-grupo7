//
//  MainViewModel.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//  Copyright (c) 2025 Fitia. All rights reserved.
//

import Foundation
import Combine

class MainViewModel: FitiaViewModel {
    
    weak var viewController: MainViewController?
    let useCases: UseCases
        
    // MARK: - Object variables
    @Published var products: [Product] = []
    @Published var isLoading: Bool = false
    @Published var isLoadingMore: Bool = false
    @Published var errorMessage: String?
    @Published var currentPage: Int = 1
    @Published var hasMorePages: Bool = true
    
    // MARK: - Lifecycle
    
    init(useCases: UseCases) {
        self.useCases = useCases
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        doFetchProducts()
    }
    
    
    
}
