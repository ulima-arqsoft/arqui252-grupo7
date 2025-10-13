//
//  ExploreViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
struct ExploreViewBuilder {
    
    @ViewBuilder
    static func build() -> some View {
        ExploreViewContainer()
    }
    
    @ViewBuilder
    private static func innerBuilder() -> ExploreView {
        let vm = buildViewModel()
        ExploreView(
            viewModel: vm
        )
    }
    
    private static func buildViewModel() -> ExploreViewModel {
        ExploreViewModel()
    }

    private struct ExploreViewContainer: View {
        
        var body: some View {
            innerBuilder()
        }
    }
}
