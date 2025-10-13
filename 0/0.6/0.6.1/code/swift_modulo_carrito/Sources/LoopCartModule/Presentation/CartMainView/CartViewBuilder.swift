//
//  CartViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

@MainActor
public struct CartViewBuilder {
    
    @ViewBuilder
    public static func build() -> some View {
        CartViewContainer()
    }
    
    @ViewBuilder
    private static func innerBuilder() -> CartView {
        let vm = buildViewModel()
        CartView(
            viewModel: vm
        )
    }
    
    private static func buildViewModel() -> CartViewModel {
        CartViewModel()
    }

    private struct CartViewContainer: View {
        
        var body: some View {
            innerBuilder()
        }
    }
}
