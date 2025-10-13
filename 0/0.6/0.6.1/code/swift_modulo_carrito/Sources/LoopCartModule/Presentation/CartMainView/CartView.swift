//
//  CartView.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

struct CartView: View {
    @ObservedObject var viewModel: CartViewModel
    var body: some View {
        ScrollView {
            CartEmptyView(backToStoreAction: viewModel.onBackToStoreTapped)
        }
        .frame(maxWidth: .infinity)
//        .background(Color.blue)
    }
}
