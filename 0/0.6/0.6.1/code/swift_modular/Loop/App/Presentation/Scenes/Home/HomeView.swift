//
//  HomeView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct HomeView: View {
    @ObservedObject var viewModel: HomeViewModel
    
    var body: some View {
        ScrollView {
            RecommendedForYouSectionView(
                onProductTappedAction: viewModel.onProductButtonTapped(product:)
            )
        }
    }
}

#Preview {
    HomeViewBuilder.build()
}
