//
//  MainBuilder.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//  Copyright (c) 2025 Fitia. All rights reserved.
//

import UIKit

@MainActor
struct MainBuilder {
    
    // MARK: - Builders
    
    static func build() -> MainViewController {
        let viewModel = makeViewModel()
        let rootView = MainView(viewModel: viewModel)
        let viewController = MainViewController(rootView: rootView)
        configure(viewController: viewController, viewModel: viewModel)
        return viewController
    }
    
    // MARK: - ViewModel
    
    private static func makeViewModel() -> MainViewModel {
        let useCases = makeUseCases()
        return MainViewModel(useCases: useCases)
    }
    
    private static func makeUseCases() -> MainViewModel.UseCases {
//        let repository = ...
        return .init(
            getProductsUseCase: .init(httpClient: URLSessionHTTPClient())
      )
    }
    
    // MARK: - Configure
    
    private static func configure(viewController: MainViewController, viewModel: MainViewModel) {
        viewController.viewModel = viewModel
        viewModel.viewController = viewController
    }
    
}
