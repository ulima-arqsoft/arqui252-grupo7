//
//  MainViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
struct MainViewBuilder {
    
    @ViewBuilder
    static func build() -> some View {
        MainViewContainer()
    }
    
    @ViewBuilder
    private static func innerBuilder(router: Router?) -> MainView {
        let authMonitor = buildAuthMonitor()
        let viewModel = buildViewModel(router: router)
        
        MainView(
            viewModel: viewModel,
            authMonitor: authMonitor
        )
    }
    
    private static func buildAuthMonitor() -> AuthMonitor {
        AuthMonitor.shared
    }
    
    private static func buildViewModel(
        router: Router?
    ) -> MainViewModel {
        MainViewModel(router: router)
    }
    
    private struct MainViewContainer: View {
        @Environment(\.router) var router
        
        var body: some View {
            innerBuilder(router: router)
        }
    }
}
