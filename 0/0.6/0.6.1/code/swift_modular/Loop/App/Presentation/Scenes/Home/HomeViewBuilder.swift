//
//  HomeViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
struct HomeViewBuilder {

    static func build() -> some View {
        HomeViewContainer()
    }
    
    private static func innerBuilder(router: Router?) -> HomeView {
        HomeView(
            viewModel: buildViewModel(router: router)
        )
    }
    
    private static func buildViewModel(router: Router?) -> HomeViewModel {
        HomeViewModel(router: router)
    }

    private struct HomeViewContainer: View {
        @Environment(\.router) var router: Router?
        
        var body: some View {
            innerBuilder(router: router)
        }
    }
}
